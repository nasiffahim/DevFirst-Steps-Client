
// import dbConnect, { collectionNamesObj } from "../../../lib/dbConnect";


// export async function    loginUser({ email, password }){
//   try {
//     if (!email || !password) return { error: "Email and password are required" };
// console.log(email,password,"login user");

//     const userCollection = await dbConnect(collectionNamesObj.user);


//     const userDoc = await userCollection.findOne({ 
// email
//  });
//     console.log(userDoc,"dfewrwrwrwrwr");
    
//     if (!userDoc) return { error: "User not found" };

  

//     return { success: true, user: { email: userDoc.email } };

//   } catch (err) {
//     console.error("Login error:", err);
//     return { error: "An error occurred during login" };
//   }
// };
import dbConnect, { collectionNamesObj } from "../../../lib/dbConnect";
import bcrypt from "bcryptjs";

export async function loginUser({ email, password }) {
  try {
    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    const userCollection = await dbConnect(collectionNamesObj.user);

    // 1️⃣ Find user by email
    let userDoc = await userCollection.findOne({ email });

    // 2️⃣ If not found → create new user
    if (!userDoc) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        email,
        password: hashedPassword,
        name: email.split("@")[0], // default name
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
        },
      };
    }

    // 3️⃣ If user exists → check password
    const isMatch = await bcrypt.compare(password, userDoc.password);
    if (!isMatch) {
      return { error: "Invalid password" };
    }

    // 4️⃣ Login success
    return {
      success: true,
      message: "Login successful",
      user: {
        id: userDoc._id,
        email: userDoc.email,
        name: userDoc.name,
      },
    };
  } catch (err) {
    console.error("Login error:", err);
    return { error: "An error occurred during login" };
  }
}
