const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerValidation } = require('../validation/authValidation');
require('dotenv').config();

const router = express.Router();

router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error){
        return res.status(400).json({ msg: error.details[0].message });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({
            email,
            password: hashedPassword,
        });

        await user.save();

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;