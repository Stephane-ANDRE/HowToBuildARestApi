import express  from "express";

import authentification from "./authentification";

// TypeScript of const router = require("express").Router() from JS
const router = express.Router();
//TypeScript of module.exports = router from JS
export default(): express.Router => {
    authentification(router);
    return router;
};