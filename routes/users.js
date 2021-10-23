
// const index = require('../views/index.html');

const express = require("express");
const router = express.Router();

const cleanBody = require("../middlewares/cleanbody");
const AuthController = require("../src/users/user.controller");

router.post("/signup", cleanBody, AuthController.Signup);

router.post("/login", cleanBody, AuthController.Login);

router.post("/cadastrar", cleanBody, AuthController.Login);

// router.get("/add", (req, res) => {
//     res.render("add_content", { title: "Add content"});
// });






module.exports = router;