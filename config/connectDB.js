import mongoose from "mongoose";
import 'dotenv/config'
export async function configDB(){
    try {
        mongoose.set('strictQuery',true);
        await mongoose.connect(process.env.DB);
        console.log("Database Connected!"); 
    } catch (error) {
        console.log(error);
    }
}