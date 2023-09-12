const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
var userSchema = new schema(
    {
        doctorCategoryId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "doctorCategory"
        },
        fullName: {
            type: String,
        },
        pharmacyName: {
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
        completeProfile0: {
            type: Boolean,
            default: false,
        },
        verifiedDoctor: {
            type: Boolean,
            default: false,
        },
        address: {
            type: String,
        },
        city: {
            type: String,
        },
        Country: {
            type: String,
        },
        pinCode: {
            type: Number,
        },
        fee: {
            type: Number,
        },
        profilepic: {
            type: String,
        },
        role: {
            type: String,
            default: "patient"
        }
    },
    { timestamps: true }
);
userSchema.plugin(mongoosePaginate);
userSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("user", userSchema);
