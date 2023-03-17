import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fName:{
            type: String
        },
        lName:{
            type: String
        },
        phone:{
            type: String
        },
        email:{
            type: String
        },
        password:{
            type: String
        },
        role:{
            type: String,
            default: 'user'
        }
    },
    { timestamps: true}
);

export default mongoose.model('User', userSchema);