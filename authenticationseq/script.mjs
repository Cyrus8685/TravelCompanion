const logregBox = document.querySelector('.logreg-box');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const express = require('express');
const sequelize = require('./db.mjs'); // Import Sequelize instance
const User = require("./models/User.mjs")(sequelize);// Import User Model
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const app = express();


registerLink.addEventListener('click', () => {
    logregBox.classList.add('active');
});

loginLink.addEventListener('click', () => {
    logregBox.classList.remove('active');
});


sequelize
    .sync()
    .then(() => {
        console.log("Database synced");
        app.listen(3000, () => console.log ("Server running on port 5432"));
    })
    .catch(err => console.error("Error syncing database:", err));

app.use(express.json());

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

// Start Server
const PORT = process.env.PORT || 5432;
app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});

