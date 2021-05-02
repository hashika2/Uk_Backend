const { Register, Login, ForgotPassword, ConfirmPassword } = require("./Auth");

module.exports.register = async (event,context) => {
  return await Register(event);
};

module.exports.login = async (event,context) => {
  return await Login(event);
};

module.exports.forgotPassword = async (event,context) => {
  return await ForgotPassword(event);
};

module.exports.confirmPassword = async (event,context) => {
  return await ConfirmPassword(event);
};
