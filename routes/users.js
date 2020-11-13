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
function hashingPw (pw){
    return new Promise ((resolve, reject) => {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if(err) {
                reject(err);
            }else {
                 bcrypt.hash(pw, salt, (err, hash) => {
                    if(err) {
                        reject(err);
                    }else {
                        resolve(hash);
                    }
                });
            }
        });
    });
}



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
                    bcrypt.compare(user.pw, userInfo[0].MBR_PW, (err, success) => {
                        if(err) {
                            console.log('bcrypt.compare() error : ', err.message);
                        }else {
                            if(!success) {
                                console.log('[로그인: 실패] 비밀번호 오류');
                                sql = mybatisMapper.getStatement('user','addPwErr', param, format);
                                conn.query(sql);
                                res.render('login',{state: 2});
                            }else {
                                console.log('[로그인: 성공]')
                                sql = mybatisMapper.getStatement('user','resetPwErr', param, format);
                                conn.query(sql);
        
                                req.session.login = {
                                    no: userInfo[0].MBR_NO,
                                    email: userInfo[0].MBR_EMAIL,
                                    nickname: userInfo[0].MBR_NKNM,
                                    intro: userInfo[0].MBR_INTRO
                                };
        
                                req.session.save(() => {
                                    res.render('index', {login: true});
                                });
                            }
                        }
                    });
                });
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
    let param = { 'email': req.body.email };
    const sql = mybatisMapper.getStatement('user','selectEmailCnt', param, format);
    pool.getConnection((err, conn) => {
        conn.query(sql, (err, result) => {
            if(result.length > 0) {
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
                        const sql2 = mybatisMapper.getStatement('user','insertUser', param, format);
                        pool.getConnection((err, conn) => {
                            conn.query(sql2, (err, result) => {
                                if (err) {
                                    console.log('[회원가입: 실패] db 오류');
                                }
                                console.log('[회원가입: 성공!]');
                                res.render('login',{state: 0});
                            })
                        });
                    })
                    .catch((err) => { console.log(err) })
            }
        });
    });
});

module.exports = router;