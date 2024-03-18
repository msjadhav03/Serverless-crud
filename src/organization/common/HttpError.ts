/**
 * This is responsible for handle response
 */
export class HttpError extends Error {
  constructor(
    public statusCode: number,
    body: Record<string, unknown> = {},
  ) {
    super(JSON.stringify(body));
  }
}
