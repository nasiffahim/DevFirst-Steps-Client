import dbConnect, { collectionNamesObj } from "../../../lib/dbConnect";
import bcrypt from "bcryptjs";

export async function loginUser({ email, password }) {
  try {
    if (!email || !password) {
      return { error: "Email and password are required" };
    }
    
    const userCollection = await dbConnect(collectionNamesObj.user);

    //  Find user by email
    let userDoc = await userCollection.findOne({ email });

    //  If not found → create new user with role "user"
    if (!userDoc) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        email,
        password: hashedPassword,
        name: email.split("@")[0], // default name
        role: "user",              // 
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
          role: userDoc.role, // 
        },
      };
    }

    //  If user exists → check password
    const isMatch = await bcrypt.compare(password, userDoc.password);
    if (!isMatch) {
      return { error: "Invalid password" };
    }

    // 4 Login success
    return {
      success: true,
      message: "Login successful",
      user: {
        id: userDoc._id,
        email: userDoc.email,
        name: userDoc.name,
        role: userDoc.role || "user", // 
      },
    };
  } catch (err) {
    console.error("Login error:", err);
    return { error: "An error occurred during login" };
  }
}
