const userModel=require('../models/userModel');
// module.exports.setCookies=function setCookies(req,res){
//     // res.setHeader('Set-Cookie','isLoggedIn=true');
//     res.cookie('isLoggedIn',true,{maxAge:1000*60*60*24, secure:true, httpOnly:true});
//     res.cookie('isPrime',false);
//     res.send("cookie has been sent");
// }
// module.exports.getCookies=function getCookies(req,res){
//     let cookie=req.cookies;
//     console.log(cookie);
//     res.send("cookies received");
// }
module.exports.getAllUser= async function getAllUser(req,res){
    try {
        let alluser=await userModel.find();
        if(alluser){
            res.json({
            "message":"user list",
            "user":alluser
        })
    }
    else{
        res.json('there are no users right now');
    }
    } catch (err) {
        res.json({
            message:err.message
        })
    }
    
}


//read operation
module.exports.getUser=async function getUser(req,res){
    // let allUsers=await userModel.find();//bring all data
    // let allUsers=await userModel.findOne({email:"abcd@gmail.com"});
    try{
        // console.log("parsdmas", req.params);
        let id=req.id;
        let user=await userModel.findById(id);
        if(user){
            res.json(user)
        }
        else{
            res.json({
                message:'user not found'
            })
        }
    }
    catch(err){
        res.json({
            message:err.message
        })
    }
    
}

//update
module.exports.updateUser=async function updateUser(req,res){
    try{
        let id=req.params.id;
        let user=await userModel.findById(id);
        if(user){
            let  dataUpdate=req.body;
            for(let key in dataUpdate){
                user[key]=dataUpdate[key];
            }
            user.confirmPassword=user.password;
            const newuser=await user.save();
            res.json({
                "message":"data updated successfully",
                data:newuser
            })
        }
        else{
            res.json({
                "message":"user not found"
            })
        }
   }
   catch(err){
    res.json({
        message:err.message
    })
   }
    
}

//delete operation
module.exports.deleteUser=async function deleteUser(req,res){
    try{
        let id=req.params.id;
        let user=await userModel.findByIdAndDelete(id);
        if(user){
            res.json({
                "message":"user deleted successfully",
                "data":user
            })
        }
        else{
            res.json({
                "message":"user not found"
        })
        }
   }
   catch(err){
    res.json({
        message:err.message
    })
   }
    
}

// module.exports.postUser=async function postUser(req,res){
//     let dataobj=req.body;
//     let obj=await userModel.create(dataobj);
//     console.log("backend ",obj);
//     res.json({
//         "message":"user signup",
//         "data":obj
//     })
// }