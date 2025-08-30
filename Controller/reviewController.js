const reviewModel=require('../models/reviewModel');
const planModel=require('../models/planModel');

module.exports.getAllReviews=async function getAllReviews(req,res){
    try{
        const reviews=await reviewModel.find();
        if(reviews){
            res.json({
                "message":"list of all reviews",
                data:reviews
            })
        }
        else{
            res.json({
                "message":"no review found"
            })
        }
    }
    catch(err){
        res.status(500).json({
            err:err.message
        })
    }
}
module.exports.top3Reviews=async function top3Reviews(req,res){
    try{
        const reviews=await reviewModel.find().sort({rating:-1}).limit(3);
        if(reviews){
            res.json({
                "message":"list of all reviews",
                data:reviews
            })
        }
        else{
            res.json({
                "message":"no review found"
            })
        }
    }
    catch(err){
        res.status(500).json({
            err:err.message
        })
    }
}
module.exports.getPlanReviews=async function getPlanReviews(req,res){
    try{
        const id=req.params.id;
        let reviews=await reviewModel.find();
        reviews=reviews.filter((review)=>{
            return review.plan._id==id;
        })
        if(reviews){
            res.json({
                "message":"list of all reviews",
                data:reviews
            })
        }
        else{
            res.json({
                "message":"no review found"
            })
        }
    }
    catch(err){
        res.status(500).json({
            err:err.message
        })
    }
}

module.exports.createReview=async function createReview(req,res){
    try{
        const planid=req.params.planid;
        const plan=await planModel.findById(planid);
        const newreview=await reviewModel.create(req.body);
        plan.ratingAverage=(((plan.ratingAverage*plan.reviewcount)+newreview.rating)/(plan.reviewcount+1));
        plan.reviewcount+=1;
        await plan.save();
        return res.json({
            "message":"review created successfully",
            data:newreview
        })
    }
    catch(err){
        res.status(500).json({
            err:err.message
        })
    }
    
}
module.exports.updateReview=async function updateReview(req,res){
    try{
        const planid=req.params.id;
        const id=req.body.id;
        const review=await reviewModel.findById(id);
        if(review){
            const datatobeupdate=req.body;
            for(let key in datatobeupdate){
                if(key=='id'){
                    continue;
                }
                review[key]=datatobeupdate[key];
            }
            await review.save();
            res.json({
                "message":"review updated successfully",
                data:review
            })
        }
        else{
            res.json({
                "message":"review not found"
            })
        }
    }
    catch(err){
        res.status(500).json({
            "err":err.message
        })
    }
}
module.exports.deleteReview=async function deleteReview(req,res){
    try{
        const planid=req.params.id;
        const id=req.body.id;
        const review=await reviewModel.findByIdAndDelete(id);
        if(review){
            res.json({
                "message":"review deleted successfully",
                data:review
            })
        }
        else{
            res.json({
                "message":"deletion failed"
            })
        }
    }
    catch(err){
        res.status(500).json({
            err:err.message
        })
    }
}
