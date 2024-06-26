import mongoose ,{Schema ,Document} from "mongoose";

export interface Message extends Document{
    content: string,
    createdAt:Date,}

const MessageSchema : Schema<Message> = new Schema({
content :{
    type:String , required:true},
createdAt:{
    type:Date , required:true,default:Date.now }
});

export interface User  extends Document{
    username:string,
    email:string,
    password:string,
    verifyCode:string,
    verifyCodeExpiry:Date,
    isVerified:boolean,
    isAcceptingMessages:boolean,
    messages:Message[]
}

const UserSchema : Schema<User> = new Schema({
username :{
    type:String , required:true ,unique:true},
email:{ type:String , required:[true ,"please enter a valid email address"] ,unique:true ,match:[/.+\@.+\..+/ ,"please enter a valid email address"]},  
password:{ type:String , required:[true ,"password is required"] ,minlength:6},
verifyCode:{ type:String , required:[true ,"verify code is required"]},
verifyCodeExpiry:{ type:Date , required:[true ,"verify code expire is required"]},
isVerified:{ type:Boolean , required:[true ,"verify code expire is required"] ,default:false},    
isAcceptingMessages:{ type:Boolean , default:true},
messages:[MessageSchema]
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User',UserSchema);

export default UserModel;