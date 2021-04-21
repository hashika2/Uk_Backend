module.exports = {
    CUSTOM_HEADERS: {
        CONTENT_TYPE:'Content-Type',
        X_SOURCE: 'x-source',
        X_DEVICE: 'x-device',
        X_BROWSER: 'x-browser',
        X_CELLCARD_REQUEST_ID: 'X-Cellcard-Request-ID',
        MOE_APPKEY: 'MOE-APPKEY',
        HEADER_KEY: 'Header-key'
      },

    STATUS_CODE:{
        BAD_REQUEST:400,
        FORBIDDEN:401,
        SERVER_ERROR:500
    },

    ERROR_MESSAGE:{
        CUSTOM_HEADERS:"Custom headers are not supplied",
        EMPTY_BODY: "Request body is empty"
    }
}