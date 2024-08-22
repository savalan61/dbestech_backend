const User = require('../models/user')

module.exports = {

    //Get User By Id
    getUser: async (req, res) => {

        try {
            const user = await User.findById(req.user.id);
            const { password, __v, createdAt, ...userData } = user._doc;
            res.status(200).json({ ...userData });
        } catch (error) {
            res.status(500).json({ status: false, mesage: error.mesage });
        }
    },

    // Verify Account
    verifyAccount: async (req, res) => {
        const userOtp = req.params.otp;

        try {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(400).json({ status: false, mesage: "User not found." });
            }

            if (user.otp === userOtp) {
                user.verification = true;
                user.otp == "none";
                user.save();
                const { password, __v, createdAt, otp, ...userData } = user._doc;
                return res.status(200).json({ ...userData });
            } else {
                return res.status(400).json({ status: false, mesage: "User not found." });
            }
        } catch (error) {
            res.status(500).json({ status: false, mesage: error.mesage });

        }
    },

    // Verify Phone
    verifyPhone: async (req, res) => {
        const userPhone = req.params.phone;

        try {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(400).json({ status: false, mesage: "User not found." });
            }
            user.phoneVerification = true;
            user.phone = userPhone;
            user.save();
            const { password, __v, createdAt, otp, ...userData } = user._doc;
            return res.status(200).json({ ...userData });

        } catch (error) {
            res.status(500).json({ status: false, mesage: error.mesage });

        }
    },

    //Delete User By Id
    deleteUser: async (req, res) => {

        try {
            await User.findByIdAndDeleted(req.user.id);
            res.status(200).json({ status: true, message: "User deleted successfully." });
        } catch (error) {
            res.status(500).json({ status: false, mesage: error.mesage });
        }
    },
}