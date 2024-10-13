const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const PreferencesRoutes = require('./routes/preferences');
const newsRoutes = require('./routes/news');
const app = express();
const port = 3000;
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

app.use('/api/auth', authRoutes);
app.use('/api', PreferencesRoutes);
app.use('/api', newsRoutes);

module.exports = app;
