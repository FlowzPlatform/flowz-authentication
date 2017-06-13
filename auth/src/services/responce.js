"use strict";

// Responce is a base class
module.exports = class Responce {

    constructor (status,code, type, results) {
        this.status = status;
        this.code = code;
        this.type = type;
        this.results = results;
    }

    print () {
      console.log( this.toString() );
    }
}
