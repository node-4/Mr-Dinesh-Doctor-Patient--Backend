const mongoose = require("mongoose");
const schema = mongoose.Schema;
var userSchema = new schema(
    {
        fullName: {
            type: String,
        },
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        age: {
            type: String,
        },
        dob: {
            type: String,
        },
        registrationNumber: {
            type: String,
        },
        weight: {
            type: String,
        },
        height: {
            type: String,
        },
        email: {
            type: String,
        },
        password: {
            type: String,
        },
        phone: {
            type: String,
        },
        otp: {
            type: String,
        },
        otpExpiration: {
            type: Date,
        },
        accountVerification: {
            type: Boolean,
            default: false,
        },
        completeProfile: {
            type: Boolean,
            default: false,
        },
        role:{
            type: String,
        }
    },
    { timestamps: true }
);
module.exports = mongoose.model("user", userSchema);
