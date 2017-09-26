const { json, send } = require('micro')

const ldapConfig = require('../config.js');

var ldap = require('ldapjs');
console.log(ldapConfig.ldapUrl);
var client = ldap.createClient({
  url: ldapConfig.ldapUrl
});

//const ldapDc = 'dc=ldaptest,dc=local';

//console.log(client);

var self = {
  userlist : async (req, res) => {
    try {
      console.log(req);
      console.log(res);

      console.log(ldapConfig.adminDn);
      client.bind(ldapConfig.adminDn, ldapConfig.adminPass, function(err) {
        //assert.ifError(err);
        console.log(err);
      });

      return "userslist..";

    } catch (err) {
      console.log(err);
      //throw createError(403, 'error!');
    }
  },

  abc : async(a) => {
    console.log(a);
  },

  ldapbind : async (strBindDn, strPass) => {

    let isAuth = false;
    return new Promise((resolve, reject) => {
      client.bind(strBindDn, strPass, function(err) {
        //assert.ifError(err);
        if(!err)
        {
          isAuth = true;
        }
        console.log(err);
        resolve({'auth':isAuth});
      });
    });

  },

  ldapsearch : async (strDn, options) => {

    let searchData = [];
    return new Promise((resolve, reject) => {

      client.search(strDn, options, function(err, res) {
        //assert.ifError(err);
        console.log(err);

        res.on('searchEntry', function(entry) {
          console.log('entry: ' + JSON.stringify(entry.object));
          searchData.push(entry.object)
          //resolve({'event':'searchEntry','reponse':entry.object});
        });
        res.on('searchReference', function(referral) {
          console.log('referral: ' + referral.uris.join());
          //resolve({'event':'searchReference','reponse':referral.uris.join()});
        });
        res.on('error', function(err) {
          console.error('error: ' + err.message);
          //resolve({'event':'error','reponse':err.message});
        });
        res.on('end', function(result) {
          console.log('status: ' + result.status);
          resolve({'response':searchData});
        });
      });
    });

/*
    let isAuth = false;
    return new Promise((resolve, reject) => {
      client.bind(strBindDn, strPass, function(err) {
        //assert.ifError(err);
        if(!err)
        {
          isAuth = true;
        }
        console.log(err);
        resolve({'auth':isAuth});
      });
    });
*/
  },

  userauth : async (req, res) => {
    try {
      const body = await json(req)
      //send(res, 200, body)

      console.log(body);
      //console.log(res);

      //self.abc("1111111111111111111");
      //return;
console.log("admin dn :: " + ldapConfig.adminDn);
      var isAdminAuth = isUserAuth = false;
      isAdminAuth = await self.ldapbind(ldapConfig.adminDn, ldapConfig.adminPass);

      console.log("admin auth :: "+isAdminAuth.auth);

      if(isAdminAuth.auth)
      {
        //  admin is authenticated, search for given user
        var searchOptions = {
            filter: '(uid='+body.userid+')',
            //filter: '(cn=*)',
            scope: 'sub'
            //attributes: ['dn', 'sn', 'cn']
        };

        var strDn = 'ou=users,'+ldapConfig.ldapDc;
        console.log(strDn);
        var result = await self.ldapsearch(strDn, searchOptions);

        console.log('==================================');
        if(result.response.length)
        {
            console.log(result.response[0]);

            let searchUserDn = result.response[0].dn;

            isUserAuth = await self.ldapbind(searchUserDn, body.passwd);

            if(isUserAuth.auth)
            {
              send(res, 200, isUserAuth);
              return;
              //return isUserAuth;
            }
            else
            {
              send(res, 404, isUserAuth);
              return;
            }
        }
      }

      send(res, 404, {'auth': false});

      /*
      var isUserAuth = false;
      const strBind = 'cn='+body.userid+',ou=users,'+ldapDc;
      console.log(strBind);

      return new Promise((resolve, reject) => {
        client.bind(strBind, body.passwd, function(err) {
          //assert.ifError(err);

          if(!err)
            isUserAuth = true;

          console.log(err);

          resolve({ "auth": isUserAuth })
        });
      });
      */

    } catch (err) {
      console.log(err);
      //throw createError(403, 'error!');
    }
  }
};

module.exports = self;
