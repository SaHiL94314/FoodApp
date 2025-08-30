const express=require('express');
const reviewRouter=express.Router();
const { protectRoute ,isAuthorise} = require('../controller/authController');
const {getAllReviews,top3Reviews,getPlanReviews,createReview,updateReview,deleteReview}=require('../controller/reviewController')


reviewRouter
.route('/allReviews')
.get(getAllReviews);

reviewRouter
.route('/top3reviews')
.get(top3Reviews);

reviewRouter
.route('/:id')
.get(getPlanReviews);

reviewRouter.use(protectRoute);
reviewRouter.use(isAuthorise(['user']));

reviewRouter
.route('/crud/:planid')
.post(createReview)
.patch(updateReview)
.delete(deleteReview);




module.exports=reviewRouter;
