import { ConnectDB } from "@/lib/ConnectDB";
import { NextResponse } from "next/server";

export const POST = async (req) => {
    try {
        // Parse the incoming JSON request body
    const { user } = await req.json();  // Extract 'user' from the body
    console.log("user from make", user);  // Log the received 'user'
            
    const db = await ConnectDB();

        try {
            const userCollection = await db.collection('users');
            const newUser =await userCollection.findOne({email: user});
             console.log("newUser", newUser)
            return NextResponse.json({messege:"newuser get successfully", newUser}, {status:201})
        
        } catch (error) {
             
            return NextResponse.json({messege:"somethngs went wrong to get user"}, {status:500})
        }
    } catch (error) {
        return NextResponse.json({messege:"somethng went wrorn server"}, {status:500})
    }

    
};
