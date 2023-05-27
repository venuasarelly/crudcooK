const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    let token = req.header('x-token');
    let refresh = req.header('x-refresh-token');

    if (!token) {
      return res.status(400).send('Token not found');
    }
    if (!refresh) {
      return res.status(400).send('refresh Token not found');
    }
    let decode = jwt.verify(token, 'accessTokenSecret');
    req.user = decode.user;

    let redecode = jwt.verify(refresh,'refreshTokenSecret');
    req.user = redecode.user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(400).send('Server error');
  }
};

module.exports = { auth };
