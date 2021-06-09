const AmozonCognitoIdentity = require("amazon-cognito-identity-js");
const passwordHash = require("password-hash");
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
} = require("../shared/repositories/UserRepo");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const poolData = {
  ClientId: ClientIdExtend,
  UserPoolId: UserPoolIdExtend,
};

const CLIENT_ID =
  "401375404695-8uvprtkgdpkn48b2u8atld55aklji032.apps.googleusercontent.com";
const CLIENT_SECRET = "UEUriq78IJdTv5tc4239NdCI";
const REDIRECT_URL = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//04Cst2SNV_-EkCgYIARAAGAQSNwF-L9Iradsg4TFpAKXHzAtDItq4px4EC9XmaHW5uH2hIpsuauM-34mrkjhjn5-JIfM3Yx9Rhu8";

// const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_ID, REDIRECT_URL);
// oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

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
      emailData
    );
    const addressAttribute = new AmozonCognitoIdentity.CognitoUserAttribute({
      Name: "address",
      Value: address,
    });
    const phoneAttribute = new AmozonCognitoIdentity.CognitoUserAttribute({
      Name: "phone_number",
      Value: phone,
    });
    const nameAttribute = new AmozonCognitoIdentity.CognitoUserAttribute({
      Name: "name",
      Value: username,
    });
    const companyAttribute = new AmozonCognitoIdentity.CognitoUserAttribute({
      Name: "custom:company",
      Value: company,
    });
    attributeList.push(emailAttribues);
    attributeList.push(addressAttribute);
    attributeList.push(phoneAttribute);
    attributeList.push(nameAttribute);
    attributeList.push(companyAttribute);
    return {
      body: JSON.stringify(
        await new Promise((resolve, reject) => {
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
              }
            }
          );
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

    let transport = await nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      auth: {
        user: "info@codexlabstechnologies.com",
        pass: "|lSFDtuM#K6M",
      },
    });

    // let transport = nodemailer.createTransport({
    //   service: "hotmail",
    //   auth: {
    //     user: "outlook_D153FB64C3419942@outlook.com",
    //     pass: "Hashika1996",
    //   },
    // });

    const message = {
      from: "info@codexlabstechnologies.com", // Sender address
      to: email, // List of recipients
      subject: "Design Your Model S | Tesla", // Subject line
      text: "Have the most fun you can in a car. Get your Tesla today!", // Plain text body,
    };

    await transport.sendMail(message, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });

    // await emailSend();
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
            onSuccess: function (session) {
              const tokens = {
                accessToken: session.getAccessToken().getJwtToken(),
                idToken: session.getIdToken().getJwtToken(),
                refreshToken: session.getRefreshToken().getToken(),
              };
              cognitoUser["tokens"] = tokens; // Save tokens for later use  2lkjm717aaenjk1gaplh9pql8t
              resolve({
                accessToken: cognitoUser.signInUserSession.accessToken,
                refreshToken: cognitoUser.signInUserSession.refreshToken,
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

// const emailSend = async () => {
//   try {
//     const oauth2Client = new google.auth.OAuth2(
//       CLIENT_ID,
//       CLIENT_ID,
//       REDIRECT_URL
//     );
//     oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
//     const oauth2Client = new google.auth.OAuth2(
//       CLIENT_ID,
//       CLIENT_ID,
//       REDIRECT_URL
//     );
//     oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
//     const accessToken = await oauth2Client.getAccessToken();
//     const transport = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         type: "OAuth2",
//         user: "m.g.hashikamaduranga@gmail.com",
//         clientId: CLIENT_ID,
//         clientSecret: CLIENT_SECRET,
//         refreshToken: REFRESH_TOKEN,
//         accessToken: accessToken,
//       },
//     });

//     const mailOption = {
//       from: "Your Truely <m.g.hashikamaduranga@gmail.com>", // Sender address
//       to: "hashikamaduranga108@gmail.com", // List of recipients
//       subject: "Design Your Model S | Tesla", // Subject line
//       text: "Have the most fun you can in a car. Get your Tesla today!", // Plain text body
//       html:
//         "<h1>Have the most fun you can in a car. Get your Tesla today!</h1>",
//     };

//     const result = await transport.sendMail(mailOption);
//     return this.res.send(result);
//   } catch (error) {
//     return error;
//   }
// };

module.exports = {
  RegisterService,
  LoginService,
  ForgetPasswordService,
  ConfirmPasswordService,
};
