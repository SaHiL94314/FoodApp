const express=require('express');
const authRouter=express.Router();
const userModel=require('../models/userModel');
const {sendMail}=require('../utilities/nodemailer.js');
const jwt=require('jsonwebtoken');
const jwt_key=require('../secret.js');


//user signed up
module.exports.signup=async function signup(req,res){
    try{
        let dataobj=req.body;
        let user=await userModel.create(dataobj);
        if(user){
            sendMail("signup",user);
            res.json({
            "message":"user signed up",
            "data":user
          })
        }
        else{
            res.json({
                "message":"error occurs while signing up"
            })
        }
        
    }
    catch(err){
        res.json({
            message:err.message
        })
    }
}

//user login
module.exports.login=async function login(req,res){
    try{
        let data=req.body;
        if(data.email){
            let user=await userModel.findOne({email:data.email});
            if(user){
                if(user.password==data.password){
                    // res.cookie('isLoggedIn',true,{httpOnly:true});
                    let uid=user['_id'];
                    let token=jwt.sign({payload:uid},jwt_key);
                    res.cookie('isLoggedIn',token,{httpOnly:true});
                    res.json({
                        "message":"user logged in",
                        "userDetails":user
                    })
                }
                else{
                    res.json({
                        "message":"credential are wrong"
                    })
                }
            }
            else{
                res.json({
                    "message":"user not found"
                })
            }
        }
        else{
            res.json({
                    "message":"empty field found"
            })
        }
    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
    
}

module.exports.isAuthorise=function isAuthorise(roles){
    return function(req,res,next){
        if(roles.includes(req.role)==true){
            next();
        }
        else{
            res.status(401).json({
                message:"operation not allowed"
            })
        }
    }
}

//protect route 
module.exports.protectRoute=async function protectRoute(req,res,next){
    try{
    let token;
    if(req.cookies.isLoggedIn){
        // console.log("cookies" ,req.cookies);
        token=req.cookies.isLoggedIn;
        let payload=jwt.verify(token,jwt_key);
        if(payload){
            // console.log("payload token",payload);
            let user=await userModel.findById(payload.payload);
            req.role=user.role;
            req.id=user['_id'];
            // console.log(req.role," ",req.id);
            next();
        }
        else{
            res.json({
                'message':'user not verified'
            })
        }
         
    }
    else{
        const client=req.get('User-Agent');
        if(client.includes('Mozilla')){
            return res.redirect('/login');
        }
        else {
            return res.json({
            message:"please login"
        })
    }
    }
}
catch(err){
    res.json({
        message:err.message
    })
}
}

module.exports.forgetpassword=async function forgetpassword(req,res){
    try{
    let email=req.body.email;
    if(email){
        const user=await userModel.findOne({email:email});
        if(user){
            //createResetToken is used to create new token
            const resetToken=user.createResetToken();
            // url http://abc.com/resetpassword/resettoken
            let resetpasswordlink=`${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`;
            //send email to the user
            //nodemailer
            let obj={
                resetpasswordlink,
                email:user.email
            }
            sendmMail("resetpassword",obj);
        }
        else{
            res.json({
                "message":"please sign up first"
            })
        }
    }
    else{
        res.json({
            "message":"enter valid email"
        })
    }
}
catch(err){
    res.status(500).json({
        "message":err.message
    })
}
}

module.exports.resetpassword=async function resetpassword(req,res) {
    try{
        const token=req.params.token;
        const {password,confirmPassword}=req.body;
        if(password==confirmPassword){
            const user=await userModel.findOne({resetToken:token});
            if(user){
                //resetpasswordhandler will update user's password in db
                user.resetPasswordHandler(password,confirmPassword);
                await user.save();
                res.json({
                    message:"password changed successfully"
                })
            }
            else{
                res.json({
                    message:"user not found"
                })
            }
        }
        else{
            res.json({
                "message":"password and confirm password are not equal"
            })
        }
    }
    catch(err){
        res.json({
            message:err.message
        })
    }
}

module.exports.logout=function logout(req,res){
    res.cookie('isLoggedIn',' ',{maxAge:1});
    res.json({
        "message":"user logged out"
    })
}
