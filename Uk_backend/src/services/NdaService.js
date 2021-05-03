const AmozonCognitoIdentity = require("amazon-cognito-identity-js");
const {
  ClientIdExtend,
  UserPoolIdExtend,
} = require("../shared/environment/env.json");
const { getUserDetails } = require("../shared/repositories/UserRepo");

const poolData = {
  ClientId: ClientIdExtend,
  UserPoolId: UserPoolIdExtend,
};

const NdaService = async (email) => {
  try {

    const userDetails = await getUserDetails(email);
    console.log(userDetails)
    return {
      body:JSON.stringify(userDetails)
    };
    /** get Data from aws cognito user pool **/
    const userPool = new AmozonCognitoIdentity.CognitoUserPool(poolData);
    const userData = {
      Username: email,
      Pool: userPool,
    };
    const cognitoUser = new AmozonCognitoIdentity.CognitoUser(userData);

     await new Promise((resolve, reject) => {
      cognitoUser.getUserData((err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      },
      { bypassCache: true }
      );
    });
  } catch (error) {
    return {
      body: JSON.stringify(error)
    }
  }
};

module.exports = NdaService;
