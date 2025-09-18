"use server";
import bcrypt from 'bcrypt'

import dbConnect, { collectionNamesOb } from "../../../lib/dbConnect";
// import dbConnect from "../../../lib/dbConnect"

export const registerUsers = async (payload) => {
  const userCollection = dbConnect(collectionNamesOb.usersCollection);

  const user = await userCollection.findOne({ email: payload.email });

  const { email, password, confirmPassword } = payload;

  if (!email || !password) return null;

  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 10)
    payload.password = hashedPassword;
    const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 10)
    payload.confirmPassword = hashedConfirmPassword;
    const result = await userCollection.insertOne(payload);
    result.insertedId = result.insertedId.toString()

    return result;
  }
  return null;
};
