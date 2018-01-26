const sqlError = {
    code: 'sql_error',
    message: 'Error in the sql layer of the application',
  };
  
const jwtAuthError = {
    code: 'jwt_auth_error',
    message: 'Failed to authenticate jwt token',
  };
  
const jwtNotProvidedError = {
    code: 'jwt_not_provided',
    message: 'JWT token not provided in authentication call',
  };

  module.exports = {
      sqlError,
      jwtAuthError,
      jwtNotProvidedError
  };