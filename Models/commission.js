const mongoose = require("mongoose");
const schema = mongoose.Schema;
const couponSchema = new mongoose.Schema({
        minOrder: {
                type: Number,
        },
        maxOrder: {
                type: Number,
        },
        commission: {
                type: Number,
        },
        status: {
                type: Boolean,
                default: false,
        },
}, { timestamps: true });
module.exports = mongoose.model("commission", couponSchema);
