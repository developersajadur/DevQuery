import { ConnectDB } from "@/lib/ConnectDB";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const PATCH = async (request) => {
    try {
        const req = await request.json();
        const {
            existsEmail,
            name,
            email,
            image,
            password,
            country,
            city,
            phone,
            gender,
            website,
            facebook,
            github,
            linkedin,
            bio,
        } = req;

        // Connect to the database
        const db = await ConnectDB();
        const usersCollections = db.collection('users');

        // Check if the user exists by email
        const exists = await usersCollections.findOne({ email: existsEmail });
        if (!exists) {
            return NextResponse.json({ message: "User does not exist" }, { status: 404 });
        }

        // Create an object for fields to update
        const updateFields = {
            name: name || exists.name,
            image: image || exists.image,
            country: country || exists.country,
            city: city || exists.city,
            phone: phone || exists.phone,
            gender: gender || exists.gender,
            website: website || exists.website,
            facebook: facebook || exists.facebook,
            github: github || exists.github,
            linkedin: linkedin || exists.linkedin,
            bio: bio || exists.bio,
        };

        // Hash the password if a new one is provided
        if (password) {
            const salt = await bcrypt.genSalt(10); // Generate a salt
            updateFields.password = await bcrypt.hash(password, salt);
        }

        // Update the user in the database
        const updatedUser = await usersCollections.updateOne(
            { email: existsEmail },
            { $set: updateFields }
        );

        // Check if any changes were made
        if (updatedUser.modifiedCount > 0) {
            return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
        } else {
            return NextResponse.json({ message: "No changes made" }, { status: 200 });
        }
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ message: "Something went wrong", error: error.message }, { status: 500 });
    }
};
