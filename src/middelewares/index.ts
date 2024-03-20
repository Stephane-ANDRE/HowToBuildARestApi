import express from "express";
// Lodash is a module that provides utility functions to manipulate data, arrays, strings, and objects.
// It is used here for its `get` and `merge` functions.
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";

// Middleware to check if the user is an admin/owner or not
export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        // Extracting the user ID from the request parameters
        const { id } = req.params;
        
        // Getting the current user's ID from the request's identity
        const currentUserId = get(req, "identity._id") as string;

        // If there is no current user ID, deny access
        if (!currentUserId) {
            return res.status(403).send("Sorry, access denied!");
        }

        // If the current user is not the owner of the resource, deny access
        if (currentUserId.toString() !== id) {
            return res.status(403).send("Sorry, access denied!");
        }
    
        // Calling the `next` function to move on to the next middleware in the request chain
        return next();
    } catch (error) {
        // Handling potential errors
        console.log(error);
        return res.status(400).send("Something wrong happens");
    }
}



// Middleware to check user authentication
export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        // Retrieving the session token from the request cookies
        const sessionToken = req.cookies["STEPHANE-AUTH"];

        // Checking if the session token exists
        if (!sessionToken) {
            // If the session token does not exist, send a 403 error (access denied)
            return res.status(403).send("Sorry, access denied!");
        }

        // Finding the existing user by the session token
        const existingUser = await getUserBySessionToken(sessionToken);

        // Checking if a user exists with the provided session token
        if (!existingUser) {
            // If no user is found with the provided session token, send a 403 error (access denied)
            return res.status(403).send("Sorry, access denied!");
        }

        // Merging the existing user data into the request under the 'identity' key
        merge(req, { identity: existingUser });

        // Calling the `next` function to move on to the next middleware in the request chain
        return next();
    } catch (error) {
        // Handling potential errors
        console.log(error);
        return res.status(400).send("Something wrong happens");
    }
}
