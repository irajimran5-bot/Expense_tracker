const errorHandler=(err,req,res,next)=>{
    console.error("ERROR detected",err.stack||err.message);
    const statusCode=res.statusCode==200?500:res.statusCode;
    res.status(statusCode).json({
        success:false,
        message:err.message||"Something went wrong on the backend. ",
        stack:process.env.NODE_ENV==="production"?null:err.stack,
    });
};
export{errorHandler};