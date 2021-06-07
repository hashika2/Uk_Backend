
const PaymentType = require('./Payment');
/*
 * Author: Hashika
 * Date: 07/06/2021
 * Copyright © 2021 CellcardPlay. All rights reserved.
 *
 * Payment Entity
 */
module.exports.checkPaymentType = async (event) => {
    return await PaymentType(event);
};