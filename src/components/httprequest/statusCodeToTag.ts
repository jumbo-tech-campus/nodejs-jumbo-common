export const statusCodeToTag = (statusCode: number): string => {
  if (statusCode >= 100 && statusCode < 200) {
    return 'information_response';
  } else if (statusCode >= 200 && statusCode < 300) {
    return 'success';
  } else if (statusCode >= 300 && statusCode < 400) {
    return 'redirection';
  } else if (statusCode >= 400 && statusCode < 500) {
    return 'client_error';
  } else {
    return 'server_error';
  }
};