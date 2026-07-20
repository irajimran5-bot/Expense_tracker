import mongoose from "mongoose";
import Expense from "../models/Expense.js";
export const getExpenses=async(req,res,next)=>{
    try{
        const {category,title,minAmount,maxAmount}=req.query;
        const queryObj={}
        
        if(title){
            queryObj.title={
                $regex:title,
                $options:"i"//i means case insensitive
            };
        }
        if(category){
            queryObj.category=category;
        }
        if(minAmount||maxAmount){
            queryObj.amount={};
            if(minAmount){
                queryObj.amount.$gte=Number(minAmount);
            }
            if(maxAmount){
                queryObj.amount.$lte=Number(maxAmount);
            }
        }
        const expenses=await Expense.find(queryObj);
        res.status(200).json(expenses);
        const{page,limit,sort}=req.query;
        const page=Number(req.query.page)||1;
        const limit=Number(req.query.limit)||10;
        const skip=(page-1)*limit;
        const sortBy=sort ||"-createdAt";
        const expense=await Expense.find(queryObj)
        .sort(sortBy).skip(skip).limit(limit);
        const totalExpenses=await Expense.countDocuments(queryObj);
        const totalPages=Math.ceil(totalExpenses/limit);
        res.status(200).json({
            success:true,
            totalExpenses,
            totalPages,
            currentPage: page,
            expenses
        });

    }catch(error){
        next(error);
    }
}
export const addExpense=async(req,res,next)=>{
    try{
        const{title,amount,category}=req.body;
        const newExpense=await Expense.create({title,amount,category});
        res.status(201).json(newExpense);
    }catch(error){
        next(error);
        
    }
}
export const deleteExpense=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const deleteexpense=await Expense.findByIdAndDelete(id);
        res.status(200).json(deleteexpense);
    }catch(error){
        next(error);
    }
}
export const updateExpense=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const{title,amount,category}=req.body;
        const updateexpense=await Expense.findByIdAndUpdate(id,{title,amount,category},{new:true});
        res.status(200).json(updateexpense)
    }catch(error){
        next(error);
    }
}
export const getExpenseStats=async(req,res,next)=>{
    try{
       const stats=await Expense.aggregate([
            {
                $group:{
                    _id:"$category",
                    totalAmount:{$sum:"$amount"},
                    count:{$sum:1}
                }
                
            },
            
           {
             $sort:{
                totalAmount:-1
            
              }
            }
        


        ]);
    res.status(200).json(stats);
    }catch(error){
        next(error);
    }
}