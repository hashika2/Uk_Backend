const AmozonCognitoIdentity = require("amazon-cognito-identity-js");
const passwordHash = require("password-hash");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { uuid } = require('uuidv4');
const { STATUS_CODE } = require("../shared/constant");
const { user } = require("../shared/environment");
const {
  ClientId,
  UserPoolId,
  ClientIdExtend,
  UserPoolIdExtend,
} = require("../shared/environment/env.json");
const {
  createUser,
  checkUserExist,
  getUserId,
} = require("../shared/repositories/UserRepo");

const poolData = {
  ClientId: ClientIdExtend,
  UserPoolId: UserPoolIdExtend,
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

    /** sign up with aws cognito  **/
    let attributeList = [];
    const userPool = new AmozonCognitoIdentity.CognitoUserPool(poolData);
    const emailData = {
      Name: "email",
      Value: email,
    };
    const companyData = {
      Name: "companyName",
      Value: company,
    };
    const emailAttribues = new AmozonCognitoIdentity.CognitoUserAttribute(
      emailData,
    );
    const addressAttribute = new AmozonCognitoIdentity.CognitoUserAttribute( { Name: "address", Value: address })
    const phoneAttribute = new AmozonCognitoIdentity.CognitoUserAttribute( { Name: "phone_number", Value: phone })
    const nameAttribute = new AmozonCognitoIdentity.CognitoUserAttribute( { Name: "name", Value: username })
    const companyAttribute = new AmozonCognitoIdentity.CognitoUserAttribute(  { Name: "custom:company", Value: company })
    attributeList.push(emailAttribues);
    attributeList.push(addressAttribute);
    attributeList.push(phoneAttribute);
    attributeList.push(nameAttribute);
    attributeList.push(companyAttribute);
    return {
      body: JSON.stringify(
        await new Promise((resolve, reject) => {
          userPool.signUp(email, password, attributeList, null, async (err, data) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              const hashPassword = passwordHash.generate(password);
              console.log(`************${data.user.pool.clientId}`)
              const clientId = data.user.pool.clientId;
              const signIn = await createUser(
                email,
                clientId,
                hashPassword,
                username,
                company,
                address,
                phone
              );

              // if (!signIn.isNewRecord) {
              //   return {
              //     statusCode: STATUS_CODE.SERVER_ERROR,
              //     body: JSON.stringify({
              //       error: "User is not added to database",
              //     }),
              //   };
              // }
              resolve(data.user);
          userPool.signUp(
            email,
            password,
            attributeList,
            null,
            async (err, data) => {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                const hashPassword = passwordHash.generate(password);
                console.log(`************${data.user.pool.clientId}`);
                const clientId = data.user.pool.clientId;
                await createUser(
                  email,
                  uuid(),
                  hashPassword,
                  username,
                  company,
                  address,
                  phone
                );

                // if (!signIn.isNewRecord) {
                //   return {
                //     statusCode: STATUS_CODE.SERVER_ERROR,
                //     body: JSON.stringify({
                //       error: "User is not added to database",
                //     }),
                //   };
                // }
                resolve(data.user);
              }
            }
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

    return {
      body: JSON.stringify(
        await new Promise((resolve, reject) => {
          cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: async function (session) {
              const tokens = {
                accessToken: session.getAccessToken().getJwtToken(),
                idToken: session.getIdToken().getJwtToken(),
                refreshToken: session.getRefreshToken().getToken(),
              };
              const userId = await getUserId(email);
              console.log('********',userId)
              cognitoUser["tokens"] = tokens; // Save tokens for later use  2lkjm717aaenjk1gaplh9pql8t
              resolve({
                userId: userId,
                accessToken: cognitoUser.signInUserSession.accessToken,
                refreshToken: cognitoUser.signInUserSession.refreshToken
              });
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

const ForgetPasswordService = async (email) => {
  try {
    const authenticationData = {
      Username: email,
      // Password: password,
    };

    /** resignIn with aws cognito and get token **/
    const authenticationDetails = new AmozonCognitoIdentity.AuthenticationDetails(
      authenticationData
    );
    const userPool = new AmozonCognitoIdentity.CognitoUserPool(poolData);
    const userData = {
      Username: email,
      Pool: userPool,
    };
    const cognitoUser = new AmozonCognitoIdentity.CognitoUser(userData);
    return {
      body: JSON.stringify(
        await new Promise((resolve, reject) => {
          cognitoUser.forgotPassword({
            onSuccess: (data) => {
              console.log(data);
              resolve(data.CodeDeliveryDetails);
            },
            onFailure: (err) => {
              reject(err);
              console.log(err);
            },
            // inputVerificationCode(){
            //   cognitoUser.confirmPassword(code,password,{
            //     onSuccess:data=>{
            //       console.log(data)
            //     },
            //     onFailure:err=>{
            //       console.log(err)
            //     }
            //   })
            // }
          });
        })
      ),
    };

    /*cognitoUser.confirmPassword(code,password,{
        onSuccess:data=>{
          console.log(data)
        },
        onFailure:err=>{
          console.log(err)
        }
      })*/
  } catch (error) {
    return {
      body: JSON.stringify(error),
    };
  }
};

const ConfirmPasswordService = async (password, code, email) => {
  try {
    const userPool = new AmozonCognitoIdentity.CognitoUserPool(poolData);
    const userData = {
      Username: email,
      Pool: userPool,
    };
    const cognitoUser = new AmozonCognitoIdentity.CognitoUser(userData);
    return {
      body: JSON.stringify(
        await new Promise((resolve, reject) => {
          cognitoUser.confirmPassword(code, password, {
            onSuccess: (data) => {
              console.log(data);
              resolve(data);
            },
            onFailure: (err) => {
              console.log(err);
              reject(err);
            },
          });
        })
      ),
    };
  } catch (error) {
    return {
      body: JSON.stringify(error),
    };
  }
};

module.exports = {
  RegisterService,
  LoginService,
  ForgetPasswordService,
  ConfirmPasswordService,
};
