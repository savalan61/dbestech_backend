const User = require('../models/user');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const generateOpt = require('../utils/otp_generator');
const generatOtp = require('../utils/otp_generator');
const sendEmail = require('../utils/smtp_function')


module.exports = {

    // Create New User
    createUser: async (req, res) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ status: false, message: "Email is not valid!" })
        }

        const minPassLenght = 8;
        if (req.body.password < 8) {
            return res.status(400).json({ status: false, message: "Password should be at least " + minPassLenght + "charachter." });
        }

        try {
            const emailExists = await User.findOne({ email: req.body.email });
            if (emailExists) {
                return res.status(400).json({ status: false, message: "This Email already exists." });
            }

            const otp = generatOtp();
            const newUser = new User({
                userName: req.body.username,
                email: req.body.email,
                userType: "Client",
                password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET).toString(),
                otp: otp
            });
            //Save new user
            await newUser.save();

            // Send otp message to user
            sendEmail(newUser.email, otp);

            res.status(200).json({ status: true, message: "New User Created Successfully." });

        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });

        }
    },


    /// Login User
    loginUser: async (req, res) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ status: false, message: "Email is not valid!" });
        }

        const minPassLength = 8;
        if (req.body.password.length < minPassLength) {
            return res.status(400).json({ status: false, message: `Password should be at least ${minPassLength} characters.` });
        }

        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(400).json({ status: false, message: "Account not found." });
            }

            const decryptedPass = CryptoJS.AES.decrypt(user.password, process.env.SECRET);
            const dePassword = decryptedPass.toString(CryptoJS.enc.Utf8);

            if (dePassword !== req.body.password) {
                return res.status(400).json({ status: false, message: "Password is wrong!" });
            }

            const userToken = jwt.sign({
                id: user._id,
                userType: user.userType,
                email: user.email,
            }, process.env.JWT_SECRET, { expiresIn: "21d" });

            const { password, otp, createdAt, updatedAt, __v, ...others } = user._doc;
            res.status(200).json({
                status: true,
                message: "Entered successfully",
                ...others,
                userToken
            });


        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    }

}