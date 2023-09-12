const mongoose = require("mongoose");
const documentSchema = new mongoose.Schema({
    idProof: {
        type: String,
    },
    photo: {
        type: String,
    },
    signature: {
        type: String,
    },
    clinicPhoto: {
        type: String,
    },
    letterHead: {
        type: String,
    },
    registrationCertificate: {
        type: String,
    },
    medicalDegree: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
});
module.exports = mongoose.model("doctorDocument", documentSchema);
