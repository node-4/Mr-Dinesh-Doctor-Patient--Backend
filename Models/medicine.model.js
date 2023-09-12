const mongoose = require("mongoose");
const schema = new mongoose.Schema(
    {
        categoryId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "category",
        },
        subcategoryId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "subcategory",
        },
        vendorId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "user",
            required: true,
        },
        name: {
            type: String,
        },
        description: {
            type: Array,
        },
        companyName: {
            type: String,
        },
        quantity: {
            type: Number,
            default: 0
        },
        batchNumber: {
            type: String,
        },
        price: {
            type: Number,
            default: 0
        },
        image: {
            type: String,
        },
    },
    { timeseries: true }
);
module.exports = mongoose.model("medicine", schema);
