const { Message } = require('../models/Auth')
const ObjectId = require('mongodb').ObjectId;

const addMessage = async (req, res, next) => {
    try {
       
        const { message, from, to } = req.body;
        const getUser = onlineUsers.get(to);

        if (message && from && to) {
            // const fromRel=await Auth.findById(from);
            const newMessage = new Message({
                message,
                senderId: from,
                receiverId: to,
                messageStatus: getUser ? "delivered" : "send",
            });
            await newMessage.save();
            return res.status(201).send({ message: newMessage });

        } else {
            return res.status(400).send("From, to and Message is required.");
        }

    } catch (err) {
        next(err);
    }
}

const getMessages = async (req, res, next) => {
    try {
        const { from, to } = req.params;
        // console.log(from, to);

        const messages = await Message.find({
            $or: [
                {
                    senderId: from,
                    receiverId: to,
                },
                {
                    senderId: to,
                    receiverId: from
                }
            ]
        });

        
        const unreadMessages = [];
        
        messages.forEach((element, index) => {

            if (
                element.messageStatus !== "read" &&
                element.senderId.toString() === to
            ) {
                
                messages[index].messageStatus = "read";
                unreadMessages.push(element.id);
            }

        })

        

        unreadMessages.forEach(async element => {
            const query = { _id: new ObjectId(element) };
            const update = { $set: { messageStatus: 'read' } };
            await Message.findOneAndUpdate(query, update)

        });


        res.status(200).json({ messages })



    } catch (err) {
        next(err);
    }

}
module.exports = { addMessage, getMessages }