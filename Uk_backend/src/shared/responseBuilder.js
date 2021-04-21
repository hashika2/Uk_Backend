const responseBuilder = (statusCode, errorMessage) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      error: errorMessage,
    }),
  };
};

module.exports = { responseBuilder };
