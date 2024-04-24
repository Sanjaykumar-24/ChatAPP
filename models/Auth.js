let mongoose = require("mongoose");

let authSchemea = mongoose.Schema({
    email: { type: String },
    user_name: { type: String },
    profilePicture: { type: String },
    about: { type: String }
});

let messageSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth'
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth'
    },
    message: { type: String },
    messageStatus: { type: String, default: "offline" },
    createdAt: { type: Date, default: Date.now, timestamps: true },

})

const Auth = mongoose.model("Auth", authSchemea);
const Message = mongoose.model("message", messageSchema);

module.exports = { Auth, Message }
// module.exports = mongoose.model("Messages", messageSchema);