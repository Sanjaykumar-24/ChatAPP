let {Auth} = require("../models/Auth")


const checkUser = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.json({ msg: "Email is required", status: false })
        }
        const user = await Auth.findOne({ email: email });
        // console.log(user);
        if (!user) {
            return res.json({ msg: "User not found", status: false });
        }
        else {
            return res.json({ msg: "User Found", status: true, data: user })
        }

    } catch (err) {
        console.log("ERROR! ", err);
    }
}

const onBoardUser = async (req, res, next) => {
    console.log("Onboarding");
    try {
        const { email, name, image: profilePicture } = req.body;
        if (!email || !name || !profilePicture) {
            return res.send("Email, Name and Image are required");
        }
        let newUser = new Auth({
            email: email,
            user_name: name,
            profilePicture: profilePicture,
        })
        await newUser.save();
        return res.json({ msg: "Success", status: true });

    } catch (err) {
        console.log(err)
    }
}

const getAllUsers = async (req, res, next) => {
    console.log("Hello")
    try {
        const users = await Auth.find().sort({ user_name: 1 });
        const usersGroupedByInitial = {};
        users.forEach(element => {
            const initialLetter = element.user_name.charAt(0).toUpperCase();
            if (!usersGroupedByInitial[initialLetter]) {
                usersGroupedByInitial[initialLetter] = [];
            }
            usersGroupedByInitial[initialLetter].push(element);
        });

        return res.status(200).send({ users: usersGroupedByInitial })

    } catch (err) {
        console.log(err)

    }
}

module.exports = { checkUser, onBoardUser, getAllUsers }