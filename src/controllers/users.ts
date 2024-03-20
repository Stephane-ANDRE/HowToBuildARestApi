import express from "express";

// Importing the getUsers function from the users database module
import { deleteUserById, getUsers, updateUserById } from "../db/users";

// Controller function to handle the route for fetching all users
export const getAllUsers = async (req: express.Request, res: express.Response) => {
  try {
    // Fetching all users from the database
    const users = await getUsers();

    // Sending a successful response with the list of users as JSON
    return res.status(200).json(users);
  } catch (error) {
    // Logging any errors that occur
    console.log(error);
    // Sending a generic error response with status code 400
    return res.status(400).send("Something wrong happens");
  }
};

//Controller function to delete an user
export const deleteUser = async (req:express.Request, res: express.Response) => {
  try {
    const {id} = req.params;
   
    const deletedUser = await deleteUserById(id);
    return res.status(200).json({ message: `User with id ${id} has been successfully deleted`, deletedUser });
    
  } catch (error) {
    // Delete  errors that occur
    console.log(error);
    // Sending a generic error response with status code 400
    return res.status(400).send("Something wrong happens");
  }
};

//controller function to update an user
export const updateUser = async(req:express.Request, res: express.Response) => {
  try {
    const {id}= req.params;
    const {username}= req.body;
    if(!username) {
      return res.status(400).send("Something wrong happens");
    }
const updatedUser = await updateUserById(id, username);

updatedUser.username = username;
await updatedUser.save();
return res.status(200).json({ message: `User with id ${id} has been successfully `, updatedUser });

  } catch (error) {
    // Delete  errors that occur
    console.log(error);
    // Sending a generic error response with status code 400
    return res.status(400).send("Something wrong happens");
  }
};