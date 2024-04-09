const express = require('express');
const User = require('../models/user.model')
const { register, login} = require('../controllers/user.controller');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/confirm/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send('User not found.');
    }

    user.confirmed = true;
    await user.save();

    res.redirect('/api/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error confirming email.');
  }
});

module.exports = router;