import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSignUpSchema= new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase: true,
        trim: true
    },
    avatar:{
        type:String,
    },
    refreshToken:{
        type:String
    }
},
{
    timestamps:true
})

userSignUpSchema.pre('save',async function (next) {
    if(!this.isModified("password")) return next();
    try {
        this.password=await bcrypt.hash(this.password,10);
        next();
    } catch (error) {
        console.log("Error in hasshing: "+ error)
        next();
    }
})
// Access Token
userSignUpSchema.methods.generateAccessToken=async function (params) {
    return jwt.sign({
        _id:this._id,
        email:this.email
    },process.env.ACCESS_TOKEN_SECRET,
    {
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}
// Refresh Token
userSignUpSchema.methods.generateRefreshToken=async function (params) {
    return jwt.sign({
        _id:this._id,
    },process.env.REFRESH_TOKEN_SECRET,
    {
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}
userSignUpSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password);
}


const userSignUp= mongoose.model("userSignUp",userSignUpSchema);

export default userSignUp;