import { ConnectDB } from "@/lib/ConnectDB"
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const PATCH = async (request) => {
    const req = await request.json();
    const { existsEmail, name, image, password, email } = req;
    const db = await ConnectDB();
    const usersCollections = await db.collection('users');
    try {
        const exists = await usersCollections.findOne({ email: existsEmail });
        if (!exists) {
            return NextResponse.json({ message: "User not exists" })
        }
        else {
            const updateFields = {
                name: name || exists.name,
                email: email || exists.email,
                image: image || exists.image
            }
            if (password) {
                const passwordHashing = await bcrypt.hash(password, 14);
                updateFields.password = passwordHashing
            }
            else {
                updateFields.password = exists.password
            }
            const updatedUser = await usersCollections.updateOne(
                { email: existsEmail },
                { $set: updateFields }
            )
            if (updatedUser.modifiedCount > 0) {
                return NextResponse.json({ message: "User updated successfully" }, { status: 200 })
            }
            else {
                return NextResponse.json({ message: "No changes made" }, { status: 200 })
            }
        }
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong", error }, { status: 501 });
    }
}