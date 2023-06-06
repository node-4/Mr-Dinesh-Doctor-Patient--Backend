const mongoose = require("mongoose");

const TestPreferenceSchema = mongoose.Schema(
    {
        preferencename: {
            type: String,
        },
        preferenceimage: {
            type: String,
        },
        preferenceprice: {
            type: Number,
        },
        testID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Testhealth",
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model("Testpreference", TestPreferenceSchema);
