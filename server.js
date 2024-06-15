const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middle Ware
app.use(bodyParser.urlencoded({ extended: true})); //bodyParser no longer used in Express
app.use(express.static(path.join(__dirname, 'public')));

// Views Removed the EJS
//app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname, 'views'));

// Static HTMl
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Controlls
const hotelController = require('./controllers/hotelController');
app.use('/', hotelController);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});