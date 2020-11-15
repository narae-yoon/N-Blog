const express = require('express');
const bodyParser = require('body-parser');
const mybatisMapper = require('mybatis-mapper');
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const format = {language:'sql',indent:' '};
const saltRounds = 10;
const router = express.Router();

mybatisMapper.createMapper(['./public/mapper/userMapper.xml']);

router.use(express.static('public'));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended:false }));

// 비밀번호 암호화
function hashingPw(pw) {
    return new Promise ((resolve, reject) => {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if(err) reject(err);
            else {
                bcrypt.hash(pw, salt, (err, hash) => {
                    if(err) reject(err);
                    else resolve(hash);
                });
            }
        });
    });
}



router.get('/login', (req, res) => {
    res.render('login', {state: 1});
});

// 로그인
router.post('/login', async (req, res) => {
    const user = {
        'email': req.body.email,
        'pw': req.body.pw
    };
    const param = { "email": user.email };
    const conn = await pool.getConnection(conn => conn);
    const userCnt = await conn.query(mybatisMapper.getStatement('user', 'selectEmailCnt', param, format));
    
    if (userCnt[0].length > 0) {
        const userDB = await conn.query(mybatisMapper.getStatement('user', 'selectLogin', param, format));
    
        bcrypt.compare(user.pw, userDB[0][0].MBR_PW, (err, success) => {
            if(success) {
                conn.query(mybatisMapper.getStatement('user','resetPwErr', param, format));
                console.log('로그인 성공');
                req.session.login = {
                    no: userDB[0][0].MBR_NO,
                    email: userDB[0][0].MBR_EMAIL,
                    nickname: userDB[0][0].MBR_NKNM,
                    intro: userDB[0][0].MBR_INTRO
                };

                req.session.save(() => {
                    res.render('index', {login: true});
                });
             }
             else {
                 conn.query(mybatisMapper.getStatement('user','addPwErr', param, format));
                 console.log('[로그인: 실패] 비밀번호 오류');
                 res.render('login',{state: 2});
             }
        });
    }

    // 에러처리
    // if(err) {
    //     console.log('[로그인: 실패] db 오류');
    //     console.log('[로그인: 실패] 등록되지 않은 이메일');
    //     res.render('login',{state: 2});
    // }

    conn.release();
});

router.get('/signUp', (req, res) => {
    res.render('sign-up');
});

router.post('/signUp', async (req, res) => {
    let param = { 'email': req.body.email };
    const conn = await pool.getConnection(conn => conn);
    const userCnt = await conn.query(mybatisMapper.getStatement('user','selectEmailCnt', param, format));
    
    console.log(userCnt[0][0].cnt);
    if (userCnt[0][0].cnt > 0) {
        console.log('등록된 사용자입니다.');
    }else {
        hashingPw(req.body.pw)
            .then((hashedPw) => {
                param = {
                    'email': req.body.email,
                    'pw': hashedPw,
                    'nickname': req.body.nickname,
                    'gender': req.body.gender,
                    'intro': req.body.intro
                };

                try {
                    conn.query(mybatisMapper.getStatement('user','insertUser', param, format));
                    console.log('[회원가입: 성공!]');
                    res.render('login',{state: 0});
                } catch {
                    console.log('[회원가입: 실패] db 오류');
                }  
            })
            .catch((err) => { console.log(err) });
    }
});

module.exports = router;