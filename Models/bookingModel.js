const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
var mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = new mongoose.Schema(
    {
        Patientname: { type: String },
        dob: { type: String },
        mobile: { type: String },
        email: { type: String },
        streetno: { type: String },
        zipno: { type: String },
        landmark: { type: String },
        lng: { type: String },
        lat: { type: String },
        city: { type: String },
        state: { type: String },
        slot: {
            type: String,
            enum: ["Morning", "Afternoon", "Evening"],
        },
        status: {
            type: String,
            default: "Upcoming",
            enum: ["Upcoming", "Completed", "Cancelled"],
        },
        available: {
            type: String,
            enum: ["1:00pm", "2:00pm", "4:00pm"],
        },
        preferenceID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Testpreference",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        fees: { type: Number },
    },
    { timestamps: true }
);
schema.plugin(mongoosePaginate);
schema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("Booking", schema);
