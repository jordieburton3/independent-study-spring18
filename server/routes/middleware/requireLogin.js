const jwt = require('jsonwebtoken');
const { 
    sqlError,
    jwtAuthError,
    jwtNotProvidedError 
  } = require('../../helpers/errors');

const requireLogin = (req, res, next) => {
    // check header or url parameters or post parameters for token
    console.log(req.body);
    const token =
      req.body.token || req.query.token || req.headers['x-access-token'];
  
    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, process.env.JWT_SECRET, {complete: true}, (err, decoded) => {
        console.log(err);
        if (err) {
          res.send(jwtAuthError);
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          console.log('*********Begin decoded');
          console.log(decoded);
          console.log(req);
          console.log('*********** End decoded');
          next();
        }
      });
    } else {
      // if there is no token
      // return an error
      return res.status(403).send(jwtNotProvidedError);
    }
  };

  module.exports = {
      requireLogin
  }