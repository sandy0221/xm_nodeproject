//http://ju.outofmemory.cn/entry/99459

var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User');
var bcrypt = require('bcrypt');
passport.serializeUser(function (user,done) {
    done(null,user.id);
})
passport.deserializeUser(function (id,done) {
    User.findById(id,function (err,user) {
        done(err,user);
    })
})
passport.use(new LocalStrategy({usernameField:'username'},function (username,password,done) {
    var criteria = (username.index('@') === -1) ? {username:username} : {email:username};
    User.findOne(criteria,function (err,user) {
        if(!user) return done(null,false,{message:'用户名或邮箱' + username + '不存在'});
        bcompare(password,hash,function (err,isMatch) {
            if(isMatch){
                return done(null,user);
            }else{
                return done(null,false,{message:'密码不匹配'})
            }
        })
    })
}))
app.use(cookieParser());
app.use(session({secret:'need change'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.post('/login',passport.authenticate('local',function (err,user,info) {
    if(err) return next(err);
    if(!user){
        req.flash('errors',{msg:info.message});
        return res.redirect('/login');
    }
    req.logIn(user,function (err) {
        if(err) return next(err);
        req.flash('success',{msg:'登录成功'});
        res.redirect('/');
    })(req,res,next)
    )