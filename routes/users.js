const express = require('express');
const bodyParser = require('body-parser');
const mybatisMapper = require('mybatis-mapper');
const pool = require('../config/database');
const format = {language:'sql',indent:' '};
const router = express.Router();

router.use(express.static('public'));
mybatisMapper.createMapper(['./public/mapper/userMapper.xml']);
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended:false }));


router.get('/login', (req, res) => {
    res.render('login', {state: 1});
});

// 로그인
router.post('/login', (req, res) => {
    const user = {
        'email': req.body.email,
        'pw': req.body.pw
    };
    const param = {
        "email": user.email
    };

    pool.getConnection((err, conn) => {
        let sql = mybatisMapper.getStatement('user', 'selectEmailCnt', param, format);
        conn.query(sql, (err, result) => {
            if(err) {
                console.log('[로그인: 실패] db 오류');
                res.render('login', {state: 2});
            }
            if (result[0].cnt) {
                sql = mybatisMapper.getStatement('user', 'selectLogin', param, format);
                conn.query(sql, (err, userInfo) => {
                    if (userInfo[0].MBR_PW != user.pw) {
                        console.log('[로그인: 실패] 비밀번호 오류');
                        sql = mybatisMapper.getStatement('user','addPwErr', param, format);
                        conn.query(sql);
                        res.render('login',{state: 2});
                    }else {
                        console.log('[로그인: 성공]')
                        sql = mybatisMapper.getStatement('user','resetPwErr', param, format);
                        conn.query(sql);
                        res.redirect('/');
                    }
                })
            } else {
                console.log('[로그인: 실패] 등록되지 않은 이메일');
                res.render('login',{state: 2});
            }
        })
    });
});

router.get('/signUp', (req, res) => {
    res.render('sign-up');
});

router.post('/signUp', (req, res) => {
    const param = {
        'email': req.body.email,
        'pw': req.body.pw,
        'nickname': req.body.nickname,
        'gender': req.body.gender,
        'intro': req.body.intro
    };
    const sql = mybatisMapper.getStatement('user','insertUser', param, format);

    pool.getConnection((err, conn) => {
        conn.query(sql, (err, result) => {
            if (err) {
                console.log('[회원가입: 실패] db 오류');
            }
            console.log('[회원가입: 성공!]');
            res.render('login',{state: 0});
        })
    })
});

module.exports = router;