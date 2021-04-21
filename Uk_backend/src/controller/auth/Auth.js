const { validateHeader } = require("../../shared/validateHeaders");

const Register = (event) => {
  const validity = validateHeader(event);
  if (!validity) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Custom headers are not supplied",
      }),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v1.0! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports = { Register };
