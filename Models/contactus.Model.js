const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const ContactSchema = new mongoose.Schema({
    companyname: {
        type: String,
    },
    email: {
        type: String,
    },
    contactnumber: {
        type: String,
    },
    address: {
        type: String,
    },
});

module.exports = mongoose.model("Contact", ContactSchema);
