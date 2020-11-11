const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mybatisMapper = require('mybatis-mapper');
const pool = require('./config/database');
mybatisMapper.createMapper(['./public/mapper/userMapper.xml']);

const format = {language:'sql',indent:' '};

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.urlencoded({ extended:false }));
app.use(express.static('public'));
app.locals.pretty = true;

app.get('/', (req, res) => {
    pool.getConnection( (err, conn) => {
        const query = mybatisMapper.getStatement('user', 'selectAllUser',null,format) ;
        console.log(query);
        conn.query (query, (err, result, fields) => {
            console.log(result);
        })
    })
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