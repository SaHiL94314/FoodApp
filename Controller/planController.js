const planModel=require('../models/planModel');

module.exports.getAllPlans=async function getAllPlans(req,res){
    try{
    let allPlans = await planModel.find();
    if(allPlans){
        res.json({
            "message":'All Plans list',
            data:allPlans
        })
    }
    else{
        res.json({
            "message":'plans not found'
        })
    }
} catch(err){
        res.status(500).json({
            "message":err.message
        })
    }
}
module.exports.getPlan=async function getPlan(req,res){
    try{
    let planid=req.params.id;
    let Plan = await planModel.findById(planid);
    if(Plan){
        res.json({
            "message":'plan found',
            data:Plan
        })
    }
    else{
        res.json({
            "message":'plan not found'
        })
    }
} catch(err){
        res.status(500).json({
            "message":err.message
        })
    }
}

module.exports.createPlan=async function createPlan(req,res){
    try{
        let planData=req.body;
        let newplan=await planModel.create(planData);
        if(newplan){
            res.json({
                "message":"plan created successfully",
                data:newplan
            })
        }
        else{
            res.json({
                "message":"error occurs while creating plan"
            })
        }
    }
    catch(err){
        res.status(500).json({
            "message":err.message
        })
    }
}

module.exports.deletePlan=async function deletePlan(req,res){
    try{
        let planid=req.params.id;
        let deletePlan=await planModel.findByIdAndDelete(planid);
        if(deletePlan){
            res.json({
                "message":"plan deleted successfully",
                data:deletePlan
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
            "message":err.message
        })
    }
}

module.exports.updatePlan=async function updatePlan(req,res){
    try{
        let planid=req.params.id;
        let newdata=req.body;
        let plan=await planModel.findById(planid);
        if(plan){
            for(let key in newdata){
                plan[key]=newdata[key];
            }
            let updatedPlan=await plan.save();
            if(updatedPlan){
                res.json({
                    "message":"plan updated successfully",
                    data:updatedPlan
                })
            }
            else{
                res.json({
                    "message":"plan updation failed"
                })
            }
        }
        else{
            res.json({
                "message":"plan not found"
            })
        }
    }
    catch(err){
        res.staus(500).json({
            "message":err.message
        })
    }
}

module.exports.top3plans=async function top3plans(req,res){
    try{
        let planlist=await planModel.find().sort({ratingAverage:-1}).limit(3);
        if(planlist){
            res.json({
                "message":"top 3 plans",
                data:planlist
            })
        }
        else{
            res.json({
                "message":"plans not found"
            })
        }
    }
    catch(err){
        res.status(500).json({
            "message":err.message
        })
    }
}