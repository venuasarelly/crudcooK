const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const {auth} = require('../middleware/auth')
router.post('/create', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const user = new User({
      fullName,
      email,
      password
    });

    const newUser = await user.save();

    let accessTokenPayload = {
      user: {
        id: newUser.id
      }
    };

    let refreshTokenPayload = {
      user: {
        id: newUser.id
      }
    };

    // Generate access token
    jwt.sign(accessTokenPayload, 'accessTokenSecret', { expiresIn: '15m' }, (err, accessToken) => {
      if (err) throw err;
      
      // Generate refresh token
      jwt.sign(refreshTokenPayload, 'refreshTokenSecret', { expiresIn: '24h' }, (err, refreshToken) => {
        if (err) throw err;
        
        return res.status(201).json({ newUser, accessToken, refreshToken });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/login', auth,async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'logged in'});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
