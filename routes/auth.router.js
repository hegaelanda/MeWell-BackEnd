const express = require('express');
const {
  Login,
  register,
  Logout,
  Me,
  Login,
  verify,
  resendVerification,
} = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', register);
router.post('/login', Login);
router.get('/verify/:id', verify);
router.post('/resendverify', resendVerification);
router.delete('/logout', Logout);
router.post('/me', Me);

module.exports = router;
