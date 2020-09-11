import jwt from 'jsonwebtoken';

const createToken = (newUser) => {
  const payLoad = {
    id: newUser.id,
    email: newUser.email,
    firstname: newUser.firstname,
    status: newUser.status,
    isadmin: newUser.isadmin,
  };
  return jwt.sign(payLoad, process.env.APP_TOKEN);
};

const validateToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  if (bearerHeader) {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    return jwt.verify(req.token, process.env.APP_TOKEN, (err, authData) => {
      if (err) {
        return res.status(403).json({
          status: 403,
          error: 'Invalid token, You need to login or signup',
        });
      }
      req.authData = authData;
      return next();
    });
  }
  return res.status(401).json({
    status: 201,
    error: 'Auth failed',
  });
};

export default {
  createToken,
  validateToken,
};

 