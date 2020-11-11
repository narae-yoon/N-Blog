const express = require('express');
const bodyParser = require('body-parser');
const mybatisMapper = require('mybatis-mapper');
const pool = require('../config/database');

const format = {language:'sql',indent:' '};
const router = express.Router();

router.use(express.static('public'));
mybatisMapper.createMapper(['./public/mapper/userMapper.xml']);


router.get('/login', (req, res) => {
    pool.getConnection( (err, conn) => {
        const query = mybatisMapper.getStatement('user', 'selectAllUser',null,format) ;
        console.log(query);
        conn.query (query, (err, result, fields) => {
            console.log(result);
        })
    })
    res.render('sign-in');
});

router.post('/login', (req, res) => {

});

router.get('/signUp', (req, res) => {
    res.render('sign-up');
});

router.post('/signUp', (req, res) => {
    const member = {
        'email': req.body.email,
        'password': req.body.password,
        'nickname': req.body.nickname,
        'gender': req.body.gender,
        'infomation': req.body.info
    };
});

module.exports = router;