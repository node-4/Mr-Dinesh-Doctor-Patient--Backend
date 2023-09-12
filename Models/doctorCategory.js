const mongoose = require("mongoose");
const schema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
    },
    { timeseries: true }
);
module.exports = mongoose.model("doctorCategory", schema);
