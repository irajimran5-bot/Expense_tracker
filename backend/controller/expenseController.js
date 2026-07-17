import mongoose from "mongoose";
import Expense from "../models/Expense.js";
export const getExpenses=async(req,res)=>{
    try{
        const expenses=await Expense.find();
        res.status(200).json(expenses);

    }catch(error){
        res.status(500).json({message:error.message});
    }
}
export const addExpense=async(req,res)=>{
    try{
        const{title,amount,category}=req.body;
        const newExpense=await Expense.create({title,amount,category});
        res.status(201).json(newExpense);
    }catch(error){
        res.status(400).json({message:error.message});
        
    }
}
export const deleteExpense=async(req,res)=>{
    try{
        const id=req.params.id;
        const deleteexpense=await Expense.findByIdAndDelete(id);
        res.status(200).json(deleteexpense);
    }catch(error){
        res.status(404).json({message:error.message});
    }
}
export const updateExpense=async(req,res)=>{
    try{
        const id=req.params.id;
        const{title,amount,category}=req.body;
        const updateexpense=await Expense.findByIdAndUpdate(id,{title,amount,category},{new:true});
        res.status(200).json(updateexpense)
    }catch(error){
        res.status(404).json({message:error.message});
    }
}