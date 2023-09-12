const mongoose = require('mongoose');
const schema = mongoose.Schema;
const DocumentSchema = schema({
        userId: {
                type: schema.Types.ObjectId,
                ref: "user"
        },
        medicines: [{
                vendorId: {
                        type: schema.Types.ObjectId,
                        ref: "user",
                },
                category: {
                        type: schema.Types.ObjectId,
                        ref: "category",
                },
                medicineId: {
                        type: schema.Types.ObjectId,
                        ref: "medicine"
                },
                medicinePrice: {
                        type: Number
                },
                quantity: {
                        type: Number,
                        default: 1
                },
                total: {
                        type: Number,
                        default: 0
                },
        }],
        totalAmount: {
                type: Number,
                default: 0
        },
        paidAmount: {
                type: Number,
                default: 0
        },
        totalItem: {
                type: Number
        },
}, { timestamps: true })
module.exports = mongoose.model("cart", DocumentSchema);