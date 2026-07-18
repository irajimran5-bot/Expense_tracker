const validateExpense=(req,res,next)=>{
    const{title,amount,category}=req.body;
    if(!title||!amount||!category){
        return res.status(400).json({
            success:false,
            message: "All fields are required!",
        });
    }
    if(typeof title!=="string"||title.trim()===""){
        return res.status(400).json({
            success:false,
            message:"Title must be a non-empty string",
        })
    }
    if(typeof amount!=="number"||amount<=0){
        return res.status(400).json({
            success:false,
            message: "Amount must be positive number greater than 0!",
        })
    }
    if(date&&isNaN(Date.parse(date))){
        return res.status(400).json({
            success:false,
            message:"Provide a valid date format",
        })
    }
    next();//if still something else is invalid, pass it on to controller
};
module.exports={validateExpense};