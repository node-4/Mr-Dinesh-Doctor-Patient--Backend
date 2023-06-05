const mongoose = require("mongoose");
const schema = new mongoose.Schema(
    {
        testtitle: {
            type: String,
        },
        testcontent: {
            type: String,
        },
        testimage: {
            type: String,
        },
        hour: {
            type: String,
        },
        collections: {
            type: String,
        },
        testprice: {
            type: Number,
        },
        status: {
            type: String,
            enum: ["Limited Time", "Not Limited Time"],
            default: "Not Limited Time",
        },
        healthtestcategoryid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "healthCategory",
        },
    },
    { timeseries: true }
);
module.exports = mongoose.model("Testhealth", schema);
