const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
var mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        slot: { type: String, },
        available: { type: String, },
        dateOfVisit: { type: String, },
        reason: { type: String },
        preferenceID: { type: mongoose.Schema.Types.ObjectId, ref: "Testpreference", },
        status: { type: String, default: "Upcoming", enum: ["Upcoming", "Completed", "Cancelled"], },
        paymentStatus: { type: String, default: "Pending", enum: ["Pending", "Success", "Failed"], },
        fees: { type: Number },
    },
    { timestamps: true }
);
schema.plugin(mongoosePaginate);
schema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("Booking", schema);
