const express=require('express');

const userRouter=express.Router();
const {getAllUser,updateUser,deleteUser,getUser} = require('../controller/userController.js');
const {signup,login,protectRoute,isAuthorise,forgetpassword,resetpassword,logout}=require('../controller/authController.js');
const multer=require('multer');


userRouter
.route('/:id')
.patch(updateUser)
.delete(deleteUser)

userRouter
.route('/signup')
.post(signup);

userRouter
.route('/login')
.post(login);

userRouter
.route('/forgetpassword')
.post(forgetpassword);

userRouter
.route('/resetpassword/:token')
.post(resetpassword);

userRouter
.route('/logout')
.get(logout);

const multerStorage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/img')
    },
    filename:function(req,file,cb){
        cb(null,`user-${Date.now()}.jpeg`);
    }
})
const multerFilter=function(req,file,cb){
    if(file.mimetype.startsWith('image')){
        cb(null,true);
    }else{
        cb(new Error('Not an image! Please upload only images'),false);
    }
}

const upload=multer({
    storage:multerStorage,
    fileFilter:multerFilter
});

userRouter
.get('/profileImage',function(req,res){
    res.sendFile('D:/backend_sahil/food_app2/multer.html');
})
.post('/profileImage',upload.single('photo'),function(req,res){
    // console.log(req.file);
    res.json({
        message:'success'
    })
});

userRouter.use(protectRoute);
userRouter
.route('/userProfile')
.get(getUser);




//admin work
userRouter.use(isAuthorise(['admin']));
userRouter
.route('/')
.get(getAllUser);




module.exports=userRouter;