const express = require('express')
const router = express.Router()


const { checkUser, onBoardUser, getAllUsers } = require("../controllers/AuthController.js")

router.post("/check-user", checkUser);
router.post("/onboard-user", onBoardUser);
router.get("/get-contacts",getAllUsers)

module.exports = { router };