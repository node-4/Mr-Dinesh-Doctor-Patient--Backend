const mongoose = require("mongoose");
const schema = mongoose.Schema;
const couponSchema = new mongoose.Schema({
        couponCode: {
                type: String,
        },
        description: {
                type: String,
        },
        minOrder: {
                type: Number,
        },
        discount: {
                type: Number,
        },
        couponType: {
                type: String,
        },
        expirationDate: {
                type: Date,
        },
        activationDate: {
                type: Date,
        },
        status: {
                type: Boolean,
                default: false,
        },
}, { timestamps: true });
module.exports = mongoose.model("coupons", couponSchema);
