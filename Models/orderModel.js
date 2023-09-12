const mongoose = require('mongoose');
const schema = mongoose.Schema;
const DocumentSchema = schema({
        orderId: {
                type: String
        },
        userId: {
                type: schema.Types.ObjectId,
                ref: "user"
        },
        vendorId: {
                type: schema.Types.ObjectId,
                ref: "user"
        },
        medicines: [{
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
        totalItem: {
                type: Number
        },
        address: {
                street1: {
                        type: String,
                },
                street2: {
                        type: String
                },
                city: {
                        type: String,
                },
                state: {
                        type: String,
                },
                country: {
                        type: String
                }
        },
        orderStatus: {
                type: String,
                enum: ["unconfirmed", "confirmed", "cancel"],
                default: "unconfirmed",
        },
        vendorStatus: {
                type: String,
                enum: ["Pending", "Accept", "Reject"],
                default: "Pending",
        },
        deliveryStatus: {
                type: String,
                enum: ["Pending", "Assigned", "Deliverd"],
                default: "Pending",
        },
        paymentStatus: {
                type: String,
                enum: ["Pending", "Paid", "Failed"],
                default: "Pending"
        },
}, { timestamps: true })
module.exports = mongoose.model("order", DocumentSchema);