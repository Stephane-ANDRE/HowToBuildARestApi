import express from "express";
import { createUser, getUserByEmail } from "../db/users";
import { random, authentification } from "../services/index";



// REGISTER METHOD
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

//LOGIN METHOD
export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        // Checking if any of the required fields are missing, if is true => error message
        if (!email || !password) {
            return res.status(400).send("You are missing an email or a password");
        }

        // Checking if user exists, if not: error message
        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if (!user) {
            console.log("User not found for email:", email); // Debug log
            return res.status(400).send("This user doesn't exist");
        }

        // Checking if user entered the correct password, if not: error message
        const expectedHash = authentification(user.authentification.salt, user.authentification.password);
        console.log("Expected hash:", expectedHash);
        console.log("Stored hash:", user.authentification.password);
        
        if (user.authentification.password !== expectedHash) {
          console.log("Incorrect password for user:", user.email);
          return res.sendStatus(403);
        }
        

        // Generate and save session token
        const salt = random();
        user.authentification.sessionToken = authentification(salt, user._id.toString());
        await user.save();

        // Set cookie and send response
        res.cookie("STEPHANE-AUTH", user.authentification.sessionToken, { domain: "localhost", path: "/" });
        console.log("User logged in successfully:", user.email); // Debug log
        return res.status(200).json({ user, message: "Welldone, you are in now! 🥩" }).end();

    } catch (error) {
        console.error("An error occurred during login:", error); // Error log
        return res.status(400).send("Something wrong happens");
    }
}