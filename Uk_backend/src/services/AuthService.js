const AmozonCognitoIdentity = require("amazon-cognito-identity-js");

const RegisterService = async (email, password, username) => {
  try {
    /** sign up with aws cognito  **/
    const poolData = {
      ClientId: "6ecinkimcnl43l5mfc60dfv1f0",
      UserPoolId: "us-east-1_Na6ojbUpd",
    };
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
    console.log(emailAttribues);
    userPool.signUp(email, password, attributeList, null, (err, data) => {
      if (err) {
        console.log(err);
        return {
          statusCode: 500,
          body: JSON.stringify(err),
        };
      }
      console.log(data.user);
      return {
        statusCode: 200,
        body: JSON.stringify(data.user),
      };
    });
    
  } catch (error) {
    console.log(error);
    return error;
  }
  //   return {
  //     statusCode: 200,
  //     body: JSON.stringify(
  //       {
  //         message: "Go Serverless v1.0! Your function executed successfully!",
  //         input: event,
  //       },
  //       null,
  //       2
  //     ),
  //   };
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
      const poolData = {
        ClientId: "6ecinkimcnl43l5mfc60dfv1f0",
        UserPoolId: "us-east-1_Na6ojbUpd",
      };
      const userPool = new AmozonCognitoIdentity.CognitoUserPool(poolData);
      console.log("***********");
  
      const userData = {
        Username: email,
        Pool: userPool,
      };
      const cognitoUser = new AmozonCognitoIdentity.CognitoUser(userData);
      console.log(authenticationDetails);
  
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (session) {
          const tokens = { 
            accessToken: session.getAccessToken().getJwtToken(),
            idToken: session.getIdToken().getJwtToken(),
            refreshToken: session.getRefreshToken().getToken(),
          };
          cognitoUser["tokens"] = tokens; // Save tokens for later use
          // console.log(cognitoUser.signInUserSession);
          return {
            statusCode: 200,
            body: JSON.stringify(cognitoUser.signInUserSession),
          };
          // return res.send(cognitoUser.signInUserSession); // Resolve user
        },
        onFailure: function (err) {
          return {
            statusCode: 500,
            body: err,
          };
          // return res.send(err); // Reject out errors
        },
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { RegisterService, LoginService };
