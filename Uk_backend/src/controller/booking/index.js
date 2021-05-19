"use strict";
const { BookDate } = require('./Book');
/*
 * Author: Hashika
 * Date: 18/05/2021
 * Copyright © 2021 CellcardPlay. All rights reserved.
 *
 * Book Entity
 */
module.exports.setDate = async (event)=>{
    return await BookDate(event);
}