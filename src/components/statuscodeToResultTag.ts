export const statuscodeToResultTag = (statuscode: number): string => {
  if (statuscode >= 200 && statuscode < 300) {
    return 'success';
  } else if (statuscode >= 400 && statuscode < 500) {
    return 'badrequest';
  } else if (statuscode >= 500) {
    return 'internal';
  } else {
    return 'unknown';
  }
};