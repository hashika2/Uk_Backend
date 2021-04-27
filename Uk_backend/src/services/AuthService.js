const AmozonCognitoIdentity = require("amazon-cognito-identity-js");
const { STATUS_CODE } = require("../shared/constant");
const { ClientId, UserPoolId } = require("../shared/environment/env.json");
const {
  createUser,
  checkUserExist,
} = require("../shared/repositories/UserRepo");

const poolData = {
  ClientId: ClientId,
  UserPoolId: UserPoolId,
};

const RegisterService = async ({
  email,
  password,
  username,
  company,
  address,
  phone,
}) => {
  try {
    // check mail is already exist
    const isExist = await checkUserExist(email);
    if (!isExist) {
      return {
        statusCode: STATUS_CODE.BAD_REQUEST,
        body: JSON.stringify({
          error: "User Already Exist",
        }),
      };
    }
    const signIn = await createUser(
      email,
      password,
      username,
      company,
      address,
      phone
    );
    console.log(signIn)

    /** sign up with aws cognito  **/
    let attributeList = [];
    const userPool = new AmozonCognitoIdentity.CognitoUserPool(poolData);
    const emailData = {
      Name: "email",
      Value: email,
    };
    const emailAttribues = new AmozonCognitoIdentity.CognitoUserAttribute(
      emailData
    );
    attributeList.push(emailAttribues);
    return {
      body: JSON.stringify(
        await new Promise((resolve, reject) => {
          userPool.signUp(email, password, attributeList, null, (err, data) => {
            if (err) {
              console.log(err);
              reject(err);
            }
            resolve(data.user);
          });
        })
      ),
    };
  } catch (error) {
    console.log(error);
    return error;
  }
};

const LoginService = async (email, password) => {
  try {
    const authenticationData = {
      Username: email,
      Password: password,
    };

    /** signIn with aws cognito and get token **/
    const authenticationDetails = new AmozonCognitoIdentity.AuthenticationDetails(
      authenticationData
    );
    const userPool = new AmozonCognitoIdentity.CognitoUserPool(poolData);
    const userData = {
      Username: email,
      Pool: userPool,
    };
    const cognitoUser = new AmozonCognitoIdentity.CognitoUser(userData);

    /* cognitoUser.forgotPassword({
        onSuccess:data=>{
          console.log(data);
        },
        onFailure:err=>{
          console.log(err)
        }
      }) */

    /*cognitoUser.confirmPassword(code,password,{
        onSuccess:data=>{
          console.log(data)
        },
        onFailure:err=>{
          console.log(err)
        }
      })*/

    return {
      body: JSON.stringify(
        await new Promise((resolve, reject) => {
          cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (session) {
              const tokens = {
                accessToken: session.getAccessToken().getJwtToken(),
                idToken: session.getIdToken().getJwtToken(),
                refreshToken: session.getRefreshToken().getToken(),
              };
              cognitoUser["tokens"] = tokens; // Save tokens for later use
              console.log(cognitoUser.signInUserSession.idToken);
              resolve(cognitoUser.signInUserSession.idToken);
              // return cognitoUser.signInUserSession;
            },
            onFailure: function (err) {
              reject(err);
            },
          });
        })
      ),
    };
  } catch (error) {
    return {
      body: JSON.stringify(error),
      statusCode: STATUS_CODE.SERVER_ERROR,
    };
  }
};

module.exports = { RegisterService, LoginService };
