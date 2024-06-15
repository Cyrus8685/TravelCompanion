const express = require('express');
const sequelize = require('./db.js'); // Import Sequelize instance
const User = require("./models/User.js")(sequelize);// Import User Model
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var path = require('path');
var bodyParser = require('body-parser');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

sequelize
    .sync()
    .then(() => {
        console.log("Database synced");
        app.listen(4000, () => console.log ("Server Listening on Port 4000"));
    })
    .catch(err => console.error("Error syncing database:", err));

    app.use(express.json());
    app.use(bodyParser.json());

//User Registration
app.post("/register", async (req, res) =>{
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully', user});
    } catch (error) {
        console.error('Error Registering User:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

//User Login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid Credentials '});
        }
        const token = jwt.sign({ userId: user.id }, process.env.DB_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Server Error'});
    }
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Access Denied'});
    } try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.DB_SECRET);
        req.user = decoded;
        next();
    }   catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ message: 'Invalid Token' });
    }
}

// Protected route to get user info
app.get('/userinfo', verifyToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User Not Found'});
        }
        res.json({ user });
    }   catch (error) {
        console.error('Error Fetching User Info:', error);
        res.status(500).json({ message: 'Server Error'});
    }
});