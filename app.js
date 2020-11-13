const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const userRouter = require('./routes/users');

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.urlencoded({ extended:false }));
app.use(express.static('public'));
app.use(session({
    secret: 'n_blog_session',
    resave: false,
    saveUninitialized: true
}));
app.use((req, res, next) => {
    res.locals.login = req.session.login;
    next();
});

app.use('/users',userRouter);

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(3000, () => {
    console.log('Connected 3000 port!');
});