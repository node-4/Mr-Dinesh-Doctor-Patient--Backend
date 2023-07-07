const mongoose = require("mongoose");
const schema = new mongoose.Schema(
    {
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
