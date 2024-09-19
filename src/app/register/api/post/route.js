
import { ConnectDB } from "@/lib/ConnectDB";
import bcrypt from "bcrypt";

export const POST = async(request) => {
const newUser = await request.json();
try {
    const db = await ConnectDB();
    const usersCollection = await db.collection("users");
    const existingUsers = await usersCollection.findOne({email: newUser.email});
    if (existingUsers) {
        return Response.json({ message: "User already exists" }, {status: 400});
    }
    const hashPassword = bcrypt.hashSync(newUser.password, 14);
    const res = await usersCollection.insertOne({...newUser, password: hashPassword});
    return Response.json({ message: "User added successfully" }, {status: 200});
} catch (error) {
    return Response.json({ message: "Something In Wrong" }, {status: 500});
}
}