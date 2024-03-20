// set up for express with those imports, then we npm i those and we npm i their types
// for example: npm i -D @types/express, etc.
// in TypeScript we "import X from "X"

import dotenv from 'dotenv';
dotenv.config();


// Express framework
import express from "express";
// HTTP module
import http from "http";
//middleware to parse request body
import bodyParser from "body-parser";
// middleware to parse cookies
import cookieParser from "cookie-parser";
//middleware for compressing HTTP responses
import compression from "compression";
//middleware for enabling Cross-Origin- Ressource - Sharing
import cors from "cors";

//use mongo
import mongoose from "mongoose";

import router from "./router"

//Iniate the app
const app = express();

//set up app for CORS
app.use(cors({
    credentials:true,
}));

//set up app for compression
app.use(compression());

//set up app for cookiesParser
app.use(cookieParser());

//set up app for bodyParser in a form json
app.use(bodyParser.json());

//create the server
const server = http.createServer(app);

//set up a listener
server.listen(8080, ()=>{
    console.log("Server running on https://localhost:8080/");
});

//set up Mongo_URL:
const MONGO_URL = process.env.MONGO_URL;
//set up moogoose connexion
mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
//if we have some connection error
mongoose.connection.on("error", (error:Error) => console.log(error));

app.use("/",router());