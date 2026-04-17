import mongoose, { Schema }from "mongoose";
import bcrypt from "bcrypt";
import jwd from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new Schema({
    avatar: {
        type:{
            url: String,
            localPath: String
        },
        default: {
            url: "",
            localPath:""
        }
    },
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    forgotPasswordToken: {
        type: String
    },
    forgotPasswordExpiry: {
        type: Date
    },
    emailVerificationToken: {
        type: String
    },
    emailVerificationExpiry: {
        type: Date
    }
   
},
  {
    timestamps: true
})

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) ;
    
    this.password = await bcrypt.hash(this.password, 10); // Το 10 είναι το "cost factor"
   
})

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateJWT = function() {
   return jwd.sign({
        id: this._id,
        username: this.username,
        email: this.email
    }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN})
}

userSchema.methods.generateRefreshToken = function()
{
    return jwd.sign({
        id: this._id,
        username: this.username,
        email: this.email
    }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN})
}

userSchema.methods.generateTemporaryToken = function(){
    const unhashedToken = crypto.randomBytes(20).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(unhashedToken).digest("hex");
    const expiry = Date.now() + 10 * 60 * 1000; // 10 λεπτά από τώρα
    
    return { unhashedToken, hashedToken, expiry };

}



export const User = mongoose.model("User", userSchema);

