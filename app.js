const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const conn = mysql.createConnection(require('./dbconfig'));
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.urlencoded({ extended:false }));
app.use(express.static('public'));
app.locals.pretty = true;

conn.connect();

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/signUp', (req, res) => {
    res.render('sign-up');
});

app.post('/signUp', (req, res) => {
    const member = {
        'email': req.body.email,
        'password': req.body.password,
        'nickname': req.body.nickname,
        'gender': req.body.gender,
        'infomation': req.body.info
    };
});

app.get('/signIn', (req, res) => {
    res.render('sign-in');
});

app.listen(3000, () => {
    console.log('Connected 3000 port!');
});