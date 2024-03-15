import { APIGatewayProxyEvent } from "aws-lambda";
import { v4 } from "uuid";
import { handleError } from "./common/error-handler";
import { organizationSchema } from "./model/organization.model";
import { docClient } from "./common/db";
import { statusCodes } from "./common/statuscodes";
import { HEADERS as headers } from "./common/constants";
const { CREATED, SUCCESS } = statusCodes;
import { messages } from "./common/messages";
import { HttpError } from "./common/HttpError";
const { NOT_FOUND } = messages.COMMON;
const { DELETION_SUCCESS } = messages.EMPLOYEE;

const tableOrganizationName = "OrganizationTable";

/**
 * Handler to add new employee to organization
 * @param event
 * @returns result after adding employee to the organization
 */
export const createOrganization = async (event: APIGatewayProxyEvent): Promise<any> => {
  try {
    const reqBody = JSON.parse(event.body as string);

    await organizationSchema.validate(reqBody, { abortEarly: false });

    const organization = {
      ...reqBody,
      organizationID: v4(),
    };

    await docClient
      .put({
        TableName: tableOrganizationName,
        Item: organization,
      })
      .promise();

    return {
      statusCode: CREATED,
      headers,
      body: JSON.stringify(organization),
    };
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Fetch organization By Id
 * @param id
 * @returns return specific organization data
 */
const fetchOrganizationById = async (id: string) => {
  const output = await docClient
    .get({
      TableName: tableOrganizationName,
      Key: {
        organizationID: id,
      },
    })
    .promise();

  if (!output.Item) {
    throw new HttpError(404, { error: NOT_FOUND });
  }

  return output.Item;
};

/**
 * Handler to delete organization
 * @param event
 * @returns
 */
export const deleteOrganization = async (event: APIGatewayProxyEvent): Promise<any> => {
  try {
    const id = event.pathParameters?.id as string;
    await fetchOrganizationById(id);
    await docClient
      .delete({
        TableName: tableOrganizationName,
        Key: {
          organizationID: id,
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
 * Handler to update organization
 * @param event
 * @returns
 */
export const updateOrganization = async (event: APIGatewayProxyEvent): Promise<any> => {
  try {
    const id = event.pathParameters?.id as string;

    await fetchOrganizationById(id);

    const reqBody = JSON.parse(event.body as string);

    await organizationSchema.validate(reqBody, { abortEarly: false });

    const organization = {
      ...reqBody,
      organizationID: id,
    };

    await docClient
      .put({
        TableName: tableOrganizationName,
        Item: organization,
      })
      .promise();

    return {
      statusCode: SUCCESS,
      headers,
      body: JSON.stringify(organization),
    };
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Handler to get organization
 * @param event
 * @returns
 */
export const getOrganization = async (event: APIGatewayProxyEvent): Promise<any> => {
  try {
    const organization = await fetchOrganizationById(event.pathParameters?.id as string);

    return {
      statusCode: SUCCESS,
      headers,
      body: JSON.stringify(organization),
    };
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Handler to list organization
 * @param event
 * @returns
 */
export const listOrganization = async (event: APIGatewayProxyEvent): Promise<any> => {
  try {
    const output = await docClient
      .scan({
        TableName: tableOrganizationName,
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

/**
 * Handler to list employee specific to organization
 * @param event
 * @returns
 */
export const listEmployeePerOrganization = async (event: APIGatewayProxyEvent): Promise<any> => {
  return {
    statusCode: 200,
    body: "listEmployeePerOrganization Check Success",
  };
};
