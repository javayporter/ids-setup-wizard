/**
 * Represents an expected application error.
 *
 * Examples:
 * - Missing Client ID
 * - IDS returns 403
 * - No master location is found
 *
 * This lets us preserve:
 * - the correct HTTP status
 * - a useful message
 * - the original IDS response when available
 */
export class AppError extends Error {
  statusCode: number;
  rawResponse?: unknown;

  constructor(statusCode: number, message: string, rawResponse?: unknown) {
    // Pass the message to JavaScript's built-in Error class.
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.rawResponse = rawResponse;
  }
}
