const {setDate} = require('../src/controller/booking/index');

describe('running getMyAccountInfo tests', () => {
    const context = {
      functionName: 'index.setDate'
    };
  
    it('getMyAccountInfo autherization validation', async () => {
      const getMyAccountInfoEvent = {
        headers:{
            'Content-Type': 'application-json'
        },
        queryStringParameters:{
            id:"abc123"
        },
        body:`{
            "firstDate":"12",
            "secondDate":"13",
            "country":"sri lanka",
            "city":"Galle",
            "status":"abc",
            "clientType":"client"
        }`

      }
  
    //   await authenticationFunc(
    //     CUSTOM_ERROR_MSISDN.INVALID_MSISDN,
    //     'view_main_balance_details'
    //   );
      const res = await setDate(getMyAccountInfoEvent, context);
      expect(res.statusCode).toBe(401);
    });

});