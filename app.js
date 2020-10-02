const express = require('express');
const app = express();
const passport = require('passport');
const bodyParser=require('body-parser');
const session = require('express-session');

const port = process.env.PORT || 5000;

require('./passportjs-setup');
app.use(session({ secret: "cats" }));
app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn=(req,res,next)=>{
    if(req.user){
        console.log(req.user)
        next()
    }
    else{
        res.sendStatus(401);
    }       
}


app.get('/failed', (req, res) => {
    res.send('failed to signin')
})
app.get('/pass', isLoggedIn, (req, res) => {
    console.log(req.user)
    res.send(`welcome ${req.user.displayName}`)
})
app.get('/google/auth',
    passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/failed' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/pass');
    });

app.listen(port,()=>{
    console.log(`app is running on port at ${port}`);
})