"use strict";
const { Nda} = require('./Nda');

module.exports.ndaDetails = async (event)=>{
    return await Nda(event);
}