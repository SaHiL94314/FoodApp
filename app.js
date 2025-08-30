const express=require('express');
const cookieParser=require('cookie-parser');
const app=express();
app.listen(3000);

app.use(express.json());
app.use(cookieParser());

const userRouter=require('./Routers/userRouter');
app.use('/user',userRouter);

const planRouter=require('./Routers/planRouter');
app.use('/plans',planRouter);

const reviewRouter=require('./Routers/reviewRouter');
app.use('/review',reviewRouter);