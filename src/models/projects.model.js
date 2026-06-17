import  Mongoose, { Schema }  from "mongoose";

const projectSchema = new Schema ({
    name: {
        type:String,
        required: true,
        trim: true,
        unique: true
     },
     description:{
        type: String,
     },
     createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
     }
    
},{timestamps: true})

const Project = Mongoose.model("Project", projectSchema);
 