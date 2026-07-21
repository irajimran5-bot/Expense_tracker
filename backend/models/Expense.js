import mongoose, { Schema } from "mongoose";
const expenseSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    title:{
        type:String,
        required:true,
        
    },
    amount:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    }
});
const Expense=mongoose.model("Expense",expenseSchema);
export default Expense;