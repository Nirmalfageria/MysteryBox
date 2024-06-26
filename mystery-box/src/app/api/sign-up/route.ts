import dbConnect from "@/lib/dbConnection";
import bcrypt from "bcrypt";

import {sendVerificationEmail} from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/User";

export async function POST(request :Request) {
    try {
        const {username ,email, password} = await request.json();
        const existingUserVerificationByUsername = await UserModel.findOne({
            username ,isVerified :true
        })
      
        if(existingUserVerificationByUsername){
            return Response.json({
                success :false,
                message : "Username already taken"
            },{
                status:400
            }
        )
        }
     const existingUserByEmail = await UserModel.findOne({email});
const verifyCode = Math.floor(100000 +Math.random()*800000).toString();
     if(existingUserByEmail){
           
        if(existingUserByEmail.isVerified){
            return Response.json({
                success :false,
                message : "Email already taken"
            },{
                status:400
            }
        )
        }
        else{
            const hasPassword = await bcrypt.hash(password ,10);
             existingUserByEmail.password = hasPassword;
           existingUserByEmail.verifyCode = verifyCode;
           existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
           await existingUserByEmail.save();
        }
     }
     else{
             const hasPassword = await bcrypt.hash(password ,10);
             const expiryDate = new Date();
             expiryDate.setHours(expiryDate.getHours()+1);
             const newUser= new UserModel({
                username,
                email ,
                password :hasPassword,
                verifyCode:verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessages:true,
                messages:[]
              })
             await newUser.save();
     }
     // send verification email
  const emailResponse =   await sendVerificationEmail(email,username ,verifyCode);
   if(!emailResponse.success){
       return Response.json({
           success:false,
           message:"Error sending verification email"
       },{
           status:500
       })
    }
    return Response.json({
        success:true,
        message:"User registered successfully ,Please verify your email to login"
    })

    } catch (error) {
        console.error("error registering user", error);
        return Response.json(
            {
                 success: false,
            message: "Error registering user",
            },
            { status: 500 }
        );
    }
}