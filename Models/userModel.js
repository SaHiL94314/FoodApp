
const mongoose=require('mongoose');
const emailValidator=require('email-validator');
const bcyrptjs=require('bcryptjs');
const crypto=require('crypto');
//mongoose part


const dblink='mongodb+srv://sahilsinha:DPxTnNfimgJbNRYb@cluster0.sdvgp.mongodb.net/';
mongoose.connect(dblink)
.then(function(db){
    console.log("db is connected");
})
.catch(function (err){
    console.log(err);
})

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:function(){
            return emailValidator.validate(this.email);
        }
    },
    password:{
        type:String,
        required:true,
        minLength:8
    },
    confirmPassword:{
        type:String,
        required:true,
        minLength:8,
        validate:function(){
            return this.password==this.confirmPassword;
        }
    },
    role:{
        type:String,
        enum:['user','admin','deliveryboy','restaurantowner'],
        default:'user'
    },
    profileImage:{
        type:String,
        default:'img/users/default.jpeg'
    },
    resetToken:String

})
//pre and post hooks
//after the save event occurs in db
// userSchema.post('save',function(doc){
//     console.log("after saving in db", doc);
// });

// //before the save event occurs in db
// userSchema.pre('save',function(){
//     console.log("before saving in db ",this);
// });
userSchema.pre('save',function(){
    this.confirmPassword=undefined;
})

userSchema.methods.createResetToken=function createResetToken(){
    const resetToken=crypto.randomBytes(32).toString('hex');
    this.resetToken=resetToken;
    return resetToken;
}
userSchema.methods.resetPasswordHandler=function(password,confirmPassword){
    this.password=password;
    this.confirmPassword=confirmPassword;
    this.resetToken=undefined;
}

//hashed password
// userSchema.pre('save',async function(){
//     let salt=await bcyrptjs.genSalt();
//     let hashedstring=await bcyrptjs.hash(this.password,salt);
//     // console.log("hashedstring is ",hashestring);
//     this.password=hashedstring;
// })

const userModel=mongoose.model('userModel',userSchema);

//create operation
async function createUser(){
    let user={
        name:"sahil",
        email:"abced@gmail.com",
        password:12345678,
        confirmPassword:12345678
    }
    let data=await userModel.create(user);
    console.log(data);
}


// createUser();
module.exports=userModel;
