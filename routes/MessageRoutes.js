const express = require('express')
const router2 = express.Router()

const { addMessage, getMessages } = require("../controllers/MessageController")

router2.post("/add-message", addMessage);
router2.get("/get-messages/:from/:to", getMessages);

module.exports = { router2 }