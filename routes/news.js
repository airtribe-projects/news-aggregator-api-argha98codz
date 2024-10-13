const express = require('express');
const axios = require('axios');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/news', auth, async (req, res) => {
    try{
        const user = await User.findById(req.user._id).select('preferences');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const { categories, languages } = user.preferences;
        const category = categories && categories.length ? categories[0] : 'general';
        const language = languages && languages.length ? languages[0] : 'en';

        const url = `https://newsapi.org/v2/top-headlines`;
        const params = {
            apiKey: process.env.NEWS_API_KEY,
            category,
            language,
        };

        const response = await axios.get(url, { params });
        const articles = response.data.articles;
        res.json(articles);
    } catch (e) {
        if(e.response) {
            res.status(502).json({ error: 'News API error' });
        }
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;