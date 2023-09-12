const mongoose = require("mongoose");
const schema = new mongoose.Schema(
    {
        vendorId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "user",
            required: true,
        },
        name: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    { timeseries: true }
);
module.exports = mongoose.model("category", schema);
