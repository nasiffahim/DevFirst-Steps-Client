"use server";

import dbConnect, { collectionNamesObj } from "../../../lib/dbConnect";
import bcrypt from "bcryptjs";

export const registerUsers = async (payload) => {
  try {
    const { email, password } = payload;

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    const userCollection = await dbConnect(collectionNamesObj.user);

    // 1️ Find user by email
    let userDoc = await userCollection.findOne({ email });

    // If not found → create new user with role
    if (!userDoc) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        email,
        password: hashedPassword,
        name: email.split("@")[0], // default name
        role: "user",              // default role
        createdAt: new Date(),
      };

      const result = await userCollection.insertOne(newUser);
      userDoc = { ...newUser, _id: result.insertedId };

      return {
        success: true,
        message: "User created successfully",
        user: {
          id: userDoc._id,
          email: userDoc.email,
          name: userDoc.name,
          role: userDoc.role,
        },
      };
    }

    //  If user already exists
    return { error: "User already exists" };
  } catch (err) {
    console.error("Register error:", err);
    return { error: "An error occurred during registration" };
  }
};
