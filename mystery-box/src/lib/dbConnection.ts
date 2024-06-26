import mongoose from "mongoose";

type ConnectionObject = {
    isConnected ? : number;
};

const connection : ConnectionObject = {};
async function dbConnect() :Promise<void>{
if(connection.isConnected){
    return;
    console.log("Using existing connection");
}
try{
const db = await mongoose.connect(process.env.MONGODB_URI ?? '');
connection.isConnected = db.connections[0].readyState;
console.log("New connection created") }

catch{
process.exit(1);
console.log("Error connecting to database")
}
}

export default dbConnect;