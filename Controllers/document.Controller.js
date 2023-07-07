const User = require("../models/userModel");
const doctorDocument = require("../models/doctor.Document");
exports.createDocument = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id });
        if (!user) {
            return res.status(400).json({ status: 400, message: "Invalid or expired token" });
        } else {
            req.body.user = req.params.id;
            const document = await doctorDocument.create(req.body);
            if (document) {
                const FindUser = await User.findByIdAndUpdate({ _id: user._id }, { $set: { completeProfile: true } }, { new: true });
                if (FindUser) {
                    res.status(200).json({ status: 200, message: "Document add successfully", userId: FindUser._id, complete: FindUser.completeProfile, });
                }
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred. Please try again later.",
        });
    }
};

exports.getDocument = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.user.id });
        if (!user) {
            return res.status(400).json({ status: 400, message: "Invalid or expired token" });
        } else {
            console.log(user);
            const allDocument = await doctorDocument.find({ user: req.user.id });
            if (allDocument.length == 0) {
                res.status(404).json({ status: 404, message: "Data not found." });
            } else {
                res.status(200).json({ status: 200, data: allDocument });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred. Please try again later.",
        });
    }
};

exports.updateDocument = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.user.id });
        if (!user) {
            return res.status(400).json({ status: 400, message: "Invalid or expired token" });
        } else {
            const findDocument = await doctorDocument.findById({ _id: req.params.id, });
            if (!findDocument) {
                res.status(404).json({ status: 404, message: "Data not found.", });
            } else {
                findDocument.idProof = req.body.idProof || findDocument.idProof;
                findDocument.photo = req.body.photo || findDocument.photo;
                findDocument.signature = req.body.signature || findDocument.signature;
                findDocument.clinicPhoto = req.body.clinicPhoto || findDocument.clinicPhoto;
                findDocument.letterHead = req.body.letterHead || findDocument.letterHead;
                findDocument.registrationCertificate = req.body.registrationCertificate || findDocument.registrationCertificate;
                findDocument.medicalDegree = req.body.medicalDegree || findDocument.medicalDegree;
                const updated = await findDocument.save();
                res.status(200).send({ message: "updated", data: updated });
            }
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred. Please try again later.",
        });
    }
};

exports.getDocumentbyId = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.user.id });
        if (!user) {
            return res.status(400).json({ status: 400, message: "Invalid or expired token" });
        } else {
            const findDocument = await doctorDocument.findById({ _id: req.params.id, });
            if (!findDocument) {
                res.status(404).json({ status: 404, message: "Data not found.", });
            } else {
                res.status(200).send({ message: "get Data", data: findDocument, });
            }
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred. Please try again later.",
        });
    }
};

exports.deleteDocument = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.user.id });
        if (!user) {
            return res.status(400).json({ status: 400, message: "Invalid or expired token" });
        } else {
            const findDocument = await doctorDocument.findById({ _id: req.params.id, });
            if (!findDocument) {
                res.status(404).json({ status: 404, message: "Data not found.", });
            } else {
                let deleteData = await doctorDocument.findByIdAndDelete({ _id: findDocument._id, });
                res.status(200).json({ status: 200, message: "Data Delete." });
            }
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred. Please try again later.",
        });
    }
};
