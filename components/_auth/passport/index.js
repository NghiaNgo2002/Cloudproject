const passport = require('passport');
const LocalStrategy = require('passport-local');
const authorizeService = require('../authorizeService');

passport.use(new LocalStrategy({ usernameField: 'phonenumber'}, async function verify(username, password, cb){
    const user = await authorizeService.checkUserCredential(username, password);
    if(user)
        return cb(null, user);
    return cb(null, false);
}));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { 
        ID: Object.values(user)[0],
        PHONENUMBER: Object.values(user)[1],
        FULLNAME: Object.values(user)[3],
        EMAIL: Object.values(user)[4],
        CREATEDDATE: Object.values(user)[5],
        LEVEL: Object.values(user)[6],
        IMAGE: Object.values(user)[7],
        BUDGET: Object.values(user)[8],
        ACTIVE: Object.values(user)[9],
        VERIFIED: Object.values(user)[10]
    });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

module.exports = passport;