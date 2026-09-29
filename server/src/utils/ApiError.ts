// Error with proper API format/information
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly success: false;
  public readonly code?: string | undefined;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    options?: {
      code?: string;
      details?: unknown;
      isOperational?: boolean;
      cause?: unknown;
    },
  ) {
    super(message, { cause: options?.cause });

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.success = false;
    this.code = options?.code;
    this.details = options?.details;
    this.isOperational = options?.isOperational ?? true;

    Error.captureStackTrace(this, ApiError);
  }
}
