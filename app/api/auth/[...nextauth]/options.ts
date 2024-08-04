import type { NextAuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

// export options type being NextAuthOptions set with object p,
export const options : NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId : process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,

        }),

        CredentialsProvider({
            name : "Credentials",
            credentials : {
                username: {
                    label: "Username: ",
                    type: "text",
                    placeholder: "your-name"
                },
                password: {
                    label: "Password: ",
                    type: "password",
                    placeholder: "your password"
                }

                
            },

            // async function to authorize/retrieve credentials that we recieved
            async authorize(credentials){
                // hard coded
                const user = {id: "22", name: "kl", password:"passed"}

                if(credentials?.username === user.name && credentials?.password === user.password){
                    return user
                } else{
                    return null
                }

            }
        })
    ]
}