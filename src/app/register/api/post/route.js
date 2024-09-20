
import { ConnectDB } from "@/lib/ConnectDB";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const POST = async(request) => {
const newUser = await request.json();
try {
    const db = await ConnectDB();
    const usersCollection = await db.collection("users");
    const existingUsers = await usersCollection.findOne({email: newUser.email});
    if (existingUsers) {
        return NextResponse.json({ message: "User already exists" }, {status: 400});
    }
    const hashPassword = bcrypt.hashSync(newUser.password, 14);
    const res = await usersCollection.insertOne({...newUser, password: hashPassword});
    return NextResponse.json({ message: "User added successfully" }, {status: 200});
} catch (error) {
    return NextResponse.json({ message: "Something In Wrong" }, {status: 500});
}
}