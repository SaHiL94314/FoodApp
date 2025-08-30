const mongoose=require('mongoose');

//mongoose part


const dblink='mongodb+srv://sahilsinha:DPxTnNfimgJbNRYb@cluster0.sdvgp.mongodb.net/';
mongoose.connect(dblink)
.then(function(db){
    console.log("plan db is connected");
})
.catch(function (err){
    console.log(err);
})

const planSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        maxlength:[20,'name should not exceed 20 characters']
    },
    duration:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:[true,'price not entered']
    },
    ratingAverage:{
        type:Number
    },
    discount:{
        type:Number,
        validate:[function(){
            this.discount<100;
        },'discount should not exceed price']
    },
    reviewcount:{
        type:Number,
        default:0
    }


});
const planModel=mongoose.model('planModel',planSchema);
// (async function createPlan(){
//     let planobj={
//         name:'prime',
//         duration:30,
//         price:300,
//         ratingAverage:4,
//         discount:20
//     }
//     const data=await planModel.create(planobj);

// })();


module.exports=planModel;