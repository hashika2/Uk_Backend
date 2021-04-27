const { User } = require("../entities");

const createUser = async (
  email,
  password,
  username,
  company,
  address,
  phone
) => {
  const user = await User.create({
    username: username,
    email: email,
    password: password,
    companyName: company,
    companyAddress: address,
    phoneNumber: phone,
  });
  await user.save();
  return user;
};

const checkUserExist = async (email) => {
  const isExist = await User.count({ where: { email: email } });
  if (isExist > 0) return false;
  else return true;
};

module.exports = { createUser, checkUserExist };
