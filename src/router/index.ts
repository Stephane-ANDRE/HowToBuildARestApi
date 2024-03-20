import express  from "express";

import authentication from "./authentication";
import users from "./users"
// TypeScript of const router = require("express").Router() from JS
const router = express.Router();
//TypeScript of module.exports = router from JS
export default(): express.Router => {
    authentication(router);
    users(router);
    
    return router;
};