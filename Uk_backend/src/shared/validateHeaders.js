const { CUSTOM_HEADERS } = require("./constant");

const validateHeader = (event) => {
    if(!event.headers || !event.headers[CUSTOM_HEADERS.CONTENT_TYPE]){
        return false;
    }
    return true;
}

module.exports = {validateHeader};