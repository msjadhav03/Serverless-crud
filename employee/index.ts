import { APIGatewayProxyEvent } from "aws-lambda";
import { v4 } from "uuid";
import { employeeSchema } from "./model/employee.model";
import { handleError } from "./common/error-handler";
import { docClient } from "./common/db";
import { statusCodes } from "./common/statuscodes";
import { HEADERS as headers } from "./common/constants";
const { CREATED, SUCCESS } = statusCodes;
import { messages } from "./common/messages";
import { HttpError } from "./common/HttpError";
const { DELETION_SUCCESS } = messages.EMPLOYEE;

const tableEmployeeName = "EmployeeTable";

/**
 * Add new employee to the origanization
 * @param event
 * @returns result after adding employee to the organization
 */
export const createEmployee = async (event: APIGatewayProxyEvent): Promise<any> => {
  try {
    const reqBody = JSON.parse(event.body as string);

    await employeeSchema.validate(reqBody, { abortEarly: false });

    const employee = {
      ...reqBody,
      employeeID: v4(),
    };

    await docClient
      .put({
        TableName: tableEmployeeName,
        Item: employee,
      })
      .promise();

    return {
      statusCode: CREATED,
      headers,
      body: JSON.stringify(employee),
    };
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Fetch Employee By Id
 * @param id
 * @returns return specific employee data
 */
const fetchEmployeeById = async (id: string) => {
  const output = await docClient
    .get({
      TableName: tableEmployeeName,
      Key: {
        employeeID: id,
      },
    })
    .promise();

  if (!output.Item) {
    throw new HttpError(404, { error: "not found" });
  }

  return output.Item;
};

/**
 * This is responsible for fetching employee data of specific employee
 * @param event
 * @returns specific employee data
 */
export const getEmployee = async (event: APIGatewayProxyEvent): Promise<any> => {
  try {
    const employee = await fetchEmployeeById(event.pathParameters?.id as string);

    return {
      statusCode: SUCCESS,
      headers,
      body: JSON.stringify(employee),
    };
  } catch (error) {
    return handleError(error);
  }
};

/**
 * This is to update employee data by employee id
 * @param event
 * @returns return updated employee data
 */
export const updateEmployee = async (event: APIGatewayProxyEvent): Promise<any> => {
  try {
    const id = event.pathParameters?.id as string;

    await fetchEmployeeById(id);

    const reqBody = JSON.parse(event.body as string);

    await employeeSchema.validate(reqBody, { abortEarly: false });

    const employee = {
      ...reqBody,
      employeeID: id,
    };

    await docClient
      .put({
        TableName: tableEmployeeName,
        Item: employee,
      })
      .promise();

    return {
      statusCode: SUCCESS,
      headers,
      body: JSON.stringify(employee),
    };
  } catch (error) {
    return handleError(error);
  }
};

/**
 * This function is responsible for delete employee from the organization
 * @param event
 * @returns
 */
export const deleteEmployee = async (event: APIGatewayProxyEvent): Promise<any> => {
  try {
    const id = event.pathParameters?.id as string;
    await fetchEmployeeById(id);
    await docClient
      .delete({
        TableName: tableEmployeeName,
        Key: {
          employeeID: id,
        },
      })
      .promise();

    return {
      statusCode: 204,
      body: `${DELETION_SUCCESS} ${id}`,
    };
  } catch (error) {
    return handleError(error);
  }
};

/**
 * This function is responsible for list employee from the organization
 * @param event
 * @returns
 */
export const listEmployee = async (event: APIGatewayProxyEvent): Promise<any> => {
  try {
    const output = await docClient
      .scan({
        TableName: tableEmployeeName,
      })
      .promise();

    return {
      statusCode: SUCCESS,
      headers,
      body: JSON.stringify(output.Items),
    };
  } catch (error) {
    return handleError(error);
  }
};
