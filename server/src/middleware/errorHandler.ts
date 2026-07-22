import type { ErrorRequestHandler } from "express";

import { AppError } from "../errors/AppError.js";

/**
 * Global Express error handler.
 *
 * Any controller that calls next(error) will send the error here.
 *
 * Expected errors:
 * - IDS returns 403
 * - Missing Client ID
 * - No master location found
 *
 * Unexpected errors:
 * - Programming bugs
 * - Unknown runtime failures
 */
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  // Known application errors keep their original status and details.
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      rawResponse: error.rawResponse ?? null,
    });

    return;
  }

  // Unknown errors are treated as internal server errors.
  console.error("Unexpected application error:", error);

  res.status(500).json({
    success: false,
    message: "An unexpected server error occurred.",
    rawResponse: null,
  });
};
