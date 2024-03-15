import * as yup from "yup";
import { HEADERS as headers } from "./constants";
import { HttpError } from "./HttpError";
import { statusCodes } from "./statuscodes";
const { INVALID_REQUEST, INTERNAL_SERVER_ERROR } = statusCodes;
import { messages } from "./messages";
const { INVALID_REQUEST_FORMAT } = messages.COMMON;
/**
 * This is responsible fot handle error instance and throw error according to instance
 * @param error
 * @returns
 */
export const handleError = (error: unknown) => {
  if (error instanceof yup.ValidationError) {
    return {
      statusCode: INVALID_REQUEST,
      headers,
      body: JSON.stringify({
        errors: error.errors,
      }),
    };
  }

  if (error instanceof SyntaxError) {
    return {
      statusCode: INVALID_REQUEST,
      headers,
      body: JSON.stringify({ error: `${INVALID_REQUEST_FORMAT} "${error.message}"` }),
    };
  }

  if (error instanceof HttpError) {
    return {
      statusCode: error.statusCode,
      headers,
      body: error.message,
    };
  }
  return {
    statusCodes: INTERNAL_SERVER_ERROR,
    headers,
    body: error,
  };
};
