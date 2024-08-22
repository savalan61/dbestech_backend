const User = require('../models/user');
const Address = require('../models/address');

module.exports = {

    // Add New Address
    addAddress: async (req, res) => {
        const newAddress = new Address({
            userId: req.user.id,
            addressLine1: req.body.addressLine1,
            postalCode: req.body.postalCode,
            default: req.body.default,
            deliveryInstructions: req.body.deliveryInstructions,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        });

        try {
            if (req.body.default === true) {
                await Address.updateMany({ userId: req.user.id }, { default: false });
            }
            await newAddress.save();
            res.status(200).json({ status: true, message: "Address added successfully." });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });

        }



    },

    //Get All Addresses
    getAddresses: async (req, res) => {
        try {
            const addresses = await Address.find({ userId: req.user.id });
            res.status(200).json(addresses);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    //Delete Address
    deleteAddress: async (req, res) => {
        try {
            await Address.findByIdAndDelete(req.params.id);
            res.status(200).json({ status: true, message: "Address Removed successfully." });

        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    //My Delete Address dont allow to delete default address.
    myDeleteAddress: async (req, res) => {
        const userId = req.user.id;
        try {
            const defaultAddress = await Address.findOne({ userId: userId, default: true });
            const selectedAddress = await Address.findById(req.params.id);

            if (!selectedAddress) {
                return res.status(404).json({ status: false, message: "Address not found." });
            }

            if (defaultAddress && defaultAddress._id.toString() === selectedAddress._id.toString()) {
                console.log("You are deleting the default address");
                return res.status(400).json({ status: false, message: "You can not delete the default address." });
            } else {
                await Address.findByIdAndDelete(req.params.id);
                return res.status(200).json({ status: true, message: "Address removed successfully." });
            }


        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    //setAddressDefault
    setAddressDefault: async (req, res) => {
        const userId = req.user.id;
        const addressId = req.params.id;

        try {
            await Address.updateMany({ userId: userId }, { default: false })
            const updateAddress = await Address.findByIdAndUpdate(addressId, { default: true })
            if (updateAddress) {
                await User.findByIdAndUpdate(userId, { address: addressId });
                return res.status(200).json({ status: true, message: "Address successfully set as Default." })
            } else {
                return res.status(400).json({ status: false, message: "Address Not found. " })
            }
        } catch (error) {
            return res.status(500).json({ status: false, message: error.message })

        }

    },

    //Get Default Address of auser
    getDefaultAddress: async (req, res) => {
        const userId = req.user.id;

        try {
            const defAddress = await Address.findOne({ userId: userId, default: true });
            if (defAddress) {
                res.status(200).json(defAddress);
            } else {
                res.status(404).json({ status: false, message: "Default addres did not found" });

            }
        } catch (error) {
            return res.status(500).json({ status: false, message: error.message })

        }
    }


}