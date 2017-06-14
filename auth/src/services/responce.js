"use strict";

// Responce is a base class
module.exports = class Responce {

    constructor (status,code,message) {
        this.status = status;
        this.code = code;
        this.message = message;
        // this.results = results;
    }
    

    print () {
      console.log( this.toString() );
    }
}
