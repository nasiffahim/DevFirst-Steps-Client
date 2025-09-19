import { loginUser } from "../app/action/auth/loginUser";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";


import dbConnect, { collectionNamesObj } from "../lib/dbConnect";
export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",       
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Enter Email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                console.log(credentials)
                // Add logic here to look up the user from the credentials supplied
                const user = await loginUser(credentials)
                if (user) {
                    // Any object returned will be saved in `user` property of the JWT
                    return user
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null

                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        })


    ],
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async signIn({ user, account, }) {
            // Console these to check necessary properites
            //console.log({ user, account, profile, email, credentials })
            if (account) {
                const { providerAccountId, provider } = account
                const { email: user_email, image, name } = user
                const userCollection = dbConnect(collectionNamesObj.user)
                const isExisted = await userCollection.findOne({ providerAccountId })
                if (!isExisted) {
                    const payload = { providerAccountId, provider, email: user_email, image, name, }
                    await userCollection.insertOne(payload)
                }
            }
            return true
        },
    }
}