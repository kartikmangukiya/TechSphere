export interface ApiResponseOptions {
  message?: string;
  statusCode?: number;
}

export const apiResponse = <T>(data: T, options: ApiResponseOptions = {}) => {
  const { message = "Success", statusCode = 200 } = options;

  return {
    success: true,
    statusCode,
    message,
    data,
  };
};
