import dbConnect, { collectionNamesObj } from "../../../lib/dbConnect";

export async function registerUser(payload) {
  try {
    const {
      uid,
      email,
      fullName,      
      image,
      role = "user",
      work = null,
    } = payload;

    if (!uid || !email || !fullName) {
      return { error: "UID, email, and fullName are required" };
    }

    const userCollection = await dbConnect(collectionNamesObj.user);

    // Check if user already exists
    const existingUser = await userCollection.findOne({ email });

    if (existingUser) {
      return {
        error: "User already registered",
        user: {
          id: existingUser._id.toString(),
          email: existingUser.email,
          username: existingUser.username,
          image: existingUser.image,
          role: existingUser.role,
          work: existingUser.work,
        }
      };
    }

    // Use fullName as username here
    const newUser = {
      uid,
      email,
      username: fullName,  // <--- assign fullName to username
      image: image || null,
      role,
      work,
      createdAt: new Date(),
    };

    const result = await userCollection.insertOne(newUser);

    return {
      success: true,
      message: "User registered successfully",
      user: {
        id: result.insertedId.toString(),
        email,
        uid,
        username: fullName,
        image,
        role,
        work,
      },
    };
  } catch (error) {
    console.error("Register error:", error);
    return { error: "An error occurred during registration" };
  }
}
