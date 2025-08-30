const express=require('express');
const { protectRoute ,isAuthorise} = require('../controller/authController');
const planRouter=express.Router();
const {getAllPlans,getPlan,createPlan,updatePlan,deletePlan, top3plans}=require('../controller/planController.js');

planRouter
.route('/allPlans')
.get(getAllPlans);

//check user is logged in or not, then display own plan
planRouter.use(protectRoute);
planRouter
.route('/plan/:id')
.get(getPlan);


//only admin and restaurant owner can create,update,delete plan
planRouter.use(isAuthorise(['admin','restaurantowner']));
planRouter
.route('/crudPlan')
.post(createPlan)

planRouter
.route('/crudPlan/:id')
.patch(updatePlan)
.delete(deletePlan);

planRouter
.route('/top3plans')
.get(top3plans);
module.exports=planRouter;