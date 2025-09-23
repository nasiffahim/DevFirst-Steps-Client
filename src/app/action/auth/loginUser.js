import dbConnect, { collectionNamesObj } from "../../../lib/dbConnect";

export async function loginUser(payload) {
  try {
    const {
      email,
      displayName,
      photoURL,
      role = "user",
      work = null,
    } = payload;

    if (!email || !uid) {
      return { error: "Email  are required" };
    }

    const userCollection = await dbConnect(collectionNamesObj.user);

    // 1. Try to find existing user
    let userDoc = await userCollection.findOne({ email });

    if (userDoc) {
      //  Found → return user
      return {
        success: true,
        message: "User already exists",
        user: {
          id: userDoc._id.toString(),
          email: userDoc.email,
          username: userDoc.username,
          name: userDoc.name,
          image: userDoc.image,
          role: userDoc.role,
          work: userDoc.work,
          
        }
      };
    }

    // Not found → create new user
    const username =
      displayName?.replace(/\s+/g, "").toLowerCase() || email.split("@")[0];

    const newUser = {
      uid,
      email,
      name: displayName || "",
      username,
      image: photoURL || null,
      role,
      work,
      createdAt: new Date()
    };

    const result = await userCollection.insertOne(newUser);
    userDoc = { ...newUser, _id: result.insertedId };

    return {
      success: true,
      message: "User profile created successfully",
      user: {
        id: userDoc._id.toString(),
        email: userDoc.email,
        username: userDoc.username,
        name: userDoc.name,
        image: userDoc.image,
        role: userDoc.role,
        work: userDoc.work,
      }
    };
  } catch (error) {
    console.error("findOrCreateUser error:", error);
    return { error: "An error occurred while processing user data" };
  }
}
