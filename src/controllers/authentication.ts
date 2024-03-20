import express from "express";
import { getUserByEmail, createUser } from "../db/users";
import { random, authentication } from "../services/index";

// LOGIN METHOD
export const login = async (req: express.Request, res: express.Response) => {
    try {
        // Extracting email and password from the request body
        const { email, password } = req.body;

        // Checking if any of the required fields are missing, if true => error message
        if (!email || !password) {
            return res.status(400).send("You are missing a field");
        }

        // Checking if the email is already used, if not => error message
        const user = await getUserByEmail(email).select("+authentication.salt +authentication.password");
        if (!user) {
            return res.status(400).send("There is no account with this email");
        }

        // Hashing the provided password to compare with stored password
        const expectedHash = authentication(user.authentication.salt, password);

        // If passwords don't match, deny access
        if (user.authentication.password != expectedHash) {
            return res.status(403).send("Sorry, access denied!");
        }

        // Generating a session token and saving it to the user
        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());
        await user.save();

        // Setting a cookie with the session token
        res.cookie("STEPHANE-AUTH", user.authentication.sessionToken, { domain: "localhost", path: "/" });

        // Sending a success response with the user details and a message
        return res.status(200).json({ user, message: "Welldone, enjoy yourself 🥩" }).end();
    } catch (error) {
        // Logging any errors that occur
        console.log(error);
        // Sending a generic error response with status code 400
        return res.status(400).send("Something wrong happens");
    }
};


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
            authentication: {
                salt,
                password:authentication(salt, password),
            },
        });
        // Sending a 200 status with the created user as JSON
        return res.status(200).json({ user, message: "Welldone, your profil is now available! 🥩" }).end();
    } catch (error) {
        console.log(error);
        return res.status(400).send("Something wrong happens");
        
    }
}

