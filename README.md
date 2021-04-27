# Uk_Backend

Deploying the Project
With the repository cloned, change directories into the repository and make sure you're on the same level as the serverless.yml file. Then you can make a few changes to the demo code:

Either configure your own org and app name with Framework Pro or remove the org and app from the top of serverless.yml.
Update the DOMAIN_SUFFIX value in the provider environment section to something unique. I recommend you use something like your name and favorite mythical animal.
After that, save the file and run serverless deploy.
This should deploy all the Amazon Cognito resources required as well as all the parts of our new HTTP API.

  endpoints:
  GET - https://yea4h11vtb.execute-api.us-east-1.amazonaws.com/user/profile
  POST - https://yea4h11vtb.execute-api.us-east-1.amazonaws.com/user/profile
  functions:
  getProfileInfo: http-api-node-dev-getProfileInfo
  createProfileInfo: http-api-node-dev-createProfileInfo
  layers:
  None
  
  
