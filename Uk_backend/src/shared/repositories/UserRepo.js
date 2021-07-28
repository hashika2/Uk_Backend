const { User } = require("../entities");

const createUser = async (
  email,
  clientId,
  password,
  username,
  company,
  address,
  phone
) => {
  const user = await User.create({
    username: username,
    email: email,
    userId:clientId,
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

const getUserDetails = async(email,id)=>{
  return await User.findOne({where:{userId:id}})
}

const getUserId = async(email)=>{
  return await User.findOne({where:{email:email},attributes: ['userId']})
}

module.exports = { createUser, checkUserExist, getUserDetails, getUserId };
