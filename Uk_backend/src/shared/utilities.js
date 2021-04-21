const joi = require('joi');

validateObject = (schemaObject,requestObject) => {
    const schema = joi.object().keys(schemaObject);
    return joi.validate(requestObject,schema)
}
module.exports = { validateObject }