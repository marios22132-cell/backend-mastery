import mongoose, { Schema }from "mongoose";
import bcrypt from "bcrypt";
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
   , timestamps: true 
})

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    
    this.password = await bcrypt.hash(this.password, 10); // Το 10 είναι το "cost factor"
    next();
})

export const User = mongoose.model("User", userSchema);