const express=require("express");
const mongoose = require("mongoose");
const cors=require("cors");
mongoose.connect('mongodb://127.0.0.1:27017/Gym')
.then(()=>{
    console.log("connected database succesfully");
}).catch((err)=>{
    console.log(err);
})

const userSchema=mongoose.Schema({
    fullName:{
        type :String ,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    phone:{
        type:String,
        required:true,
        unique:true,
        min:"10",
        max:"10",
    }
})

const user=mongoose.model("user",userSchema);
const app=express();
const option={
    "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}
app.use(cors(option))
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.post("/registor",async (req,res)=>{
    const {fullName,email,phone}=req.body;
    if(!fullName || !email || !phone){
        return res.status(401).send({
            success:false,
            message:"please provide complete data",
        })

    }
    else{
        const data=await user.findOne({email:email});
        if(data){
            return res.status(401).send({
                success:false,
                message:"this email already exist"
            });
        }
        try{
        const response=await user.create({
            fullName:fullName,
            email:email,
            phone:phone,
        });
        res.status(201).send({
            success:true,
            message:"successfully registor we can join"
        })
    }catch(err){
        console.log(err);
    }
    }
})

app.listen(4000,()=>{
    console.log("server start at port 4000");
})