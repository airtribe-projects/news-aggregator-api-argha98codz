const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { preferencesValidation } = require('../validation/preferencesValidation');
const router = express.Router();

router.get('/preferences', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('preferences');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.send(user.preferences);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/preferences', auth, async (req, res) => {
    const { error } = preferencesValidation(req.body);
    if (error){
        return res.status(400).json({ msg: error.details[0].message });
    }

    const {categories, languages} = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.preferences = {categories, languages};
        await user.save();
        res.json({ message: 'Preferences updated successfully' });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;