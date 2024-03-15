import express from "express";
import { createUser, getUserByEmail } from "../db/users";
import { random, authentification } from "../services/index";

// req and res need a type
export const register = async (req:express.Request, res:express.Response) => {
    try {
        // Destructuring email, password, and username from request body
        const {email, password, username} = req.body;
         // Checking if any of the required fields are missing, if is true => error message
        if(!email|| !password ||!username ) {
            return res.status(400).send("You are missing an email or a password or an username");
        }
        // Checking if user with provided email already exists, if is true => error message
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).send("This account already exists");
        }
        // Generating a random salt for password hashing
        const salt =random();
        const user = await createUser({
            email,
            username,
            authentification: {
                salt,
                password:authentification(salt, password),
            },
        });
        // Sending a 200 status with the created user as JSON
        return res.status(200).json({ user, message: "Welldone, your profil is now available! 🥩" }).end();
    } catch (error) {
        console.log(error);
        return res.status(400).send("Something wrong happens");
        
    }
}