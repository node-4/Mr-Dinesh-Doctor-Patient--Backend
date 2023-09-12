const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Address = require("../models/address.Model");
const doctorDocument = require("../models/doctor.Document");
const contactusModel = require("../models/contactus.Model");
const Category = require("../models/category.model");
const subCategory = require("../models/subcategory.model");
const doctorCategory = require("../models/doctorCategory");
const helpandSupport = require("../models/helpandsupport.Model");
const FAQ = require("../models/faq.model");
const jwt = require("jsonwebtoken");
const authConfig = require("../configs/auth.config");
var newOTP = require("otp-generators");
const Coupan = require('../models/Coupan')
const Commission = require('../models/commission')
const nodemailer = require("nodemailer");
const blog = require("../models/blogModel");
exports.registration = async (req, res) => {
    const { phone, email } = req.body;
    try {
        req.body.email = email.split(" ").join("").toLowerCase();
        let user = await User.findOne({
            $and: [{ $or: [{ email: req.body.email }, { phone: phone }] }],
            role: "admin",
        });
        if (!user) {
            if (req.body.password == req.body.confirmPassword) {
                req.body.password = bcrypt.hashSync(req.body.password, 8);
                req.body.role = "admin";
                req.body.otp = newOTP.generate(4, {
                    alphabets: false,
                    upperCase: false,
                    specialChar: false,
                });
                req.body.otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
                req.body.accountVerification = false;
                const userCreate = await User.create(req.body);
                res.status(200).send({
                    message: "registered successfully ",
                    data: userCreate,
                });
            } else {
                res.status(501).send({
                    status: 501,
                    message: "Password Not matched.",
                    data: {},
                });
            }
        } else {
            res.status(409).send({ message: "Alrady Exist", data: [] });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.signIn = async (req, res) => {
    try {
        if (!req.body.email) {
            return res.status(400).send({ message: "email is required" });
        }
        if (!req.body.password) {
            return res.status(400).send({ message: "password is required" });
        }
        const admin = await User.findOne({
            email: req.body.email,
            role: "admin",
        });
        if (!admin) {
            return res
                .status(400)
                .send({ message: "Failed! AdminId passed doesn't exist" });
        }
        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            admin.password
        );
        if (!passwordIsValid) {
            return res.status(401).send({ message: "Wrong password" });
        }

        const accessToken = jwt.sign({ id: admin._id }, authConfig.secret, {
            expiresIn: "24h",
        });
        res.status(200).send({
            msg: "Admin logged in successfully",
            accessToken: accessToken,
        });
    } catch (err) {
        console.log("#### Error while Admin signing in ##### ", err.message);
        res.status(500).send({
            message: "Internal server error while Admin signing in",
        });
    }
};
exports.update = async (req, res) => {
    try {
        const { firstName, lastName, age, weight, height } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send({ message: "not found" });
        }
        user.fullName = user.fullName;
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = user.email;
        user.age = age || user.age;
        user.weight = weight || user.weight;
        user.height = height || user.height;
        user.password = user.password;
        user.phone = user.phone;
        const updated = await user.save();
        res.status(200).send({ message: "updated", data: updated });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "internal server error " + err.message,
        });
    }
};
exports.getDoctor = async (req, res) => {
    try {
        const findDoctor = await User.find({ role: "doctor" }).sort({ "createdAt": -1 });
        if (findDoctor.length === 0) {
            return res.status(404).json({ message: "doctor not found" });
        }
        return res.status(200).json(findDoctor);
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            message: "server error while getting doctor",
            error: err.message,
        });
    }
};
exports.getPatients = async (req, res) => {
    try {
        const findPatient = await User.find({ role: "patient" }).sort({ "createdAt": -1 });;
        if (findPatient.length === 0) {
            return res.status(404).json({ message: "patient not found" });
        }
        return res.status(200).json(findPatient);
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            message: "server error while getting patient",
            error: err.message,
        });
    }
};
exports.getPharmacys = async (req, res) => {
    try {
        const findPatient = await User.find({ role: "pharmacy" }).sort({ "createdAt": -1 });;
        if (findPatient.length === 0) {
            return res.status(404).json({ message: "Pharmacy not found" });
        }
        return res.status(200).json(findPatient);
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            message: "server error while getting patient",
            error: err.message,
        });
    }
};
exports.deleteUser = async (req, res) => {
    try {
        const contactid = await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" });
    }
};
exports.getApprovedDoctor = async (req, res) => {
    try {
        const findDoctor = await User.find({
            role: "doctor",
            verifiedDoctor: true,
        });
        if (findDoctor.length === 0) {
            return res.status(404).json({ message: "doctor not found" });
        }
        return res.status(200).json(findDoctor);
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            message: "server error while getting doctor",
            error: err.message,
        });
    }
};
exports.getDocument = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.user.id });
        if (!user) {
            return res
                .status(400)
                .json({ status: 400, message: "Invalid or expired token" });
        } else {
            const allDocument = await doctorDocument.find();
            if (allDocument.length == 0) {
                res.status(404).json({
                    status: 404,
                    message: "Data not found.",
                });
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
exports.getDocumentbyId = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.user.id });
        if (!user) {
            return res
                .status(400)
                .json({ status: 400, message: "Invalid or expired token" });
        } else {
            const findDocument = await doctorDocument.findById({
                _id: req.params.id,
            });
            if (!findDocument) {
                res.status(404).json({
                    status: 404,
                    message: "Data not found.",
                });
            } else {
                res.status(200).send({
                    message: "get Data",
                    data: findDocument,
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred. Please try again later.",
        });
    }
};
exports.documentApprovedreject = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.user.id });
        if (!user) {
            return res
                .status(400)
                .json({ status: 400, message: "Invalid or expired token" });
        } else {
            const findDocument = await doctorDocument.findById({
                _id: req.params.id,
            });
            if (!findDocument) {
                res.status(404).json({
                    status: 404,
                    message: "Data not found.",
                });
            } else {
                if (req.body.status == "Approved") {
                    const updated = await doctorDocument.findByIdAndUpdate(
                        { _id: findDocument._id },
                        { $set: { verified: true } },
                        { new: true }
                    );
                    if (updated) {
                        const Check = await User.findByIdAndUpdate(
                            { _id: findDocument.user },
                            { $set: { verifiedDoctor: true } },
                            { new: true }
                        );
                        if (Check) {
                            res.status(200).send({
                                message: "Document approved successfully.",
                                data: updated,
                            });
                        }
                    }
                }
                if (req.body.status == "Reject") {
                    const updated = await doctorDocument.findByIdAndUpdate(
                        { _id: findDocument._id },
                        { $set: { verified: false } },
                        { new: true }
                    );
                    if (updated) {
                        const Check = await User.findByIdAndUpdate(
                            { _id: findDocument.user },
                            { $set: { verifiedDoctor: false } },
                            { new: true }
                        );
                        if (Check) {
                            res.status(200).send({
                                message: "Document approved successfully.",
                                data: updated,
                            });
                        }
                    }
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred. Please try again later.",
        });
    }
};
exports.addContact = async (req, res) => {
    const { companyname, email, contactnumber, address } = req.body;
    if (companyname == "" || email == "" || contactnumber == "" || address == "") {
        res.status(500).json({ status: "Failed", message: "Empty Field Not Accepted", });
    } else {
        const Companyfind = await contactusModel.find();
        if (Companyfind.length > 0) {
            res.status(500).json({ status: "Failed", message: "Contact Exist", });
        } else {
            try {
                const data = await contactusModel.create({ companyname: companyname, email: email, contactnumber: contactnumber, address: address, });
                res.status(200).json({ status: 200, message: "contact add successfully", data: data });
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: "An error occurred. Please try again later.", });
            }
        }
    }
};
exports.editContact = async (req, res) => {
    try {
        let updateid = await contactusModel.findById(req.params.id);
        if (updateid) {
            const data = {
                companyname: req.body.companyname || updateid.companyname,
                email: req.body.email || updateid.email,
                contactnumber: req.body.contactnumber || updateid.contactnumber,
                address: req.body.address || updateid.address,
            };
            let Contactdetails = await contactusModel.findByIdAndUpdate(req.params.id, data, { new: true });
            res.status(200).json({ message: "Contact updated successfuly", code: 200, data: Contactdetails, });
        } else {
            res.status(400).json({ code: 400, status: "failed", message: "Invalid Contact ID" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
exports.deleteContact = async (req, res) => {
    try {
        const contactid = await contactusModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Contact Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ error: "Something Went Wrong" });
    }
};
exports.getcontact = async (req, res) => {
    try {
        const data = await contactusModel.find();
        res.status(200).json({ message: "Contact data fetch.", code: 200, data: data, });
    } catch (error) {
        res.status(500).json(error);
    }
};
exports.createFaq = async (req, res) => {
    try {
        if (!req.body.question) {
            return res.status(400).send("please enter question");
        }
        if (!req.body.answer) {
            return res.status(400).send("please enter answer");
        }
        const result = await FAQ.create({
            question: req.body.question,
            answer: req.body.answer,
        });
        res.status(200).send({ msg: "FAQ added", data: result });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ msg: "internal server error ", error: err.message });
    }
};
exports.updateFaq = async (req, res) => {
    try {
        const data = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!data) {
            return res.status(400).send({ msg: "not found" });
        }
        res.status(200).send({ msg: "updated", data: data });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ msg: "internal server error ", error: err.message });
    }
};
exports.getFaq = async (req, res) => {
    try {
        const data = await FAQ.find();
        if (!data || data.length === 0) {
            return res.status(400).send({ msg: "not found" });
        }
        res.status(200).send({ data: data });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ msg: "internal server error ", error: err.message });
    }
};
exports.getIdFaq = async (req, res) => {
    try {
        console.log(req.params.id);
        const data = await FAQ.findById({ _id: req.params.id });
        if (!data || data.length === 0) {
            return res.status(400).send({ msg: "not found" });
        }
        res.status(200).send({ data: data });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ msg: "internal server error ", error: err.message });
    }
};
exports.deleteFaq = async (req, res) => {
    try {
        const data = await FAQ.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(400).send({ msg: "not found" });
        }
        res.status(200).send({ msg: "deleted", data: data });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ msg: "internal server error", error: err.message });
    }
};
exports.createCategory = async (req, res) => {
    try {
        const category = {
            name: req.body.name,
            image: req.body.image,
        };
        const categoryCreated = await Category.create(category);
        console.log(`#### Category add successfully #### /n ${categoryCreated} `);
        res.status(201).send({ message: "Category add successfully", data: categoryCreated, });
    } catch (err) {
        console.log("#### error while Category create #### ", err.message);
        res.status(500).send({ message: "Internal server error while creating category", });
    }
};
exports.getCategory = async (req, res) => {
    try {
        const data = await Category.find();
        if (!data || data.length === 0) {
            return res.status(400).send({ msg: "not found" });
        }
        res.status(200).send({ data: data });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            msg: "internal server error ",
            error: err.message,
        });
    }
};
exports.getIdCategory = async (req, res) => {
    try {
        const data = await Category.findById(req.params.id);
        if (!data || data.length === 0) {
            return res.status(400).send({ msg: "not found" });
        }
        res.status(200).send({ data: data });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            msg: "internal server error ",
            error: err.message,
        });
    }
};
exports.updateCategory = async (req, res) => {
    try {
        const data = await Category.findById(req.params.id);
        if (!data || data.length === 0) {
            return res.status(400).send({ msg: "not found" });
        } else {
            let obj = {
                name: req.body.name || data.name,
                image: req.body.image || data.image,
            }
            const update = await Category.findByIdAndUpdate(req.params.id, obj, { new: true, });
            if (!update) {
                return res.status(400).send({ msg: "not found" });
            }
            res.status(200).send({ msg: "updated", data: data });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            msg: "internal server error ",
            error: err.message,
        });
    }
};
exports.deleteCategory = async (req, res) => {
    try {
        const data = await Category.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(400).send({ msg: "not found" });
        }
        res.status(200).send({ msg: "deleted", data: data });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            msg: "internal server error",
            error: err.message,
        });
    }
};
exports.createSubCategory = async (req, res) => {
    try {
        const data = await Category.findById(req.body.categoryId);
        if (!data || data.length === 0) {
            return res.status(400).send({ msg: "not found" });
        }
        const subcategory = {
            name: req.body.name,
            image: req.body.image,
            categoryId: data._id,
        };
        const subcategoryCreated = await subCategory.create(subcategory);
        console.log(
            `#### Sub Category add successfully #### /n ${subcategoryCreated} `
        );
        res.status(201).send({
            message: "Sub Category add successfully",
            data: subcategoryCreated,
        });
    } catch (err) {
        console.log("#### error while sub Category create #### ", err.message);
        res.status(500).send({
            message: "Internal server error while creating sub category",
        });
    }
};
exports.getSubCategory = async (req, res) => {
    try {
        const data = await subCategory.find().populate('categoryId');
        if (!data || data.length === 0) {
            return res.status(400).send({ msg: "not found" });
        }
        res.status(200).send({ data: data });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            msg: "internal server error ",
            error: err.message,
        });
    }
};
exports.getIdSubCategory = async (req, res) => {
    try {
        const data = await subCategory.findById(req.params.id);
        if (!data || data.length === 0) {
            return res.status(400).send({ msg: "not found" });
        }
        res.status(200).send({ data: data });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            msg: "internal server error ",
            error: err.message,
        });
    }
};
exports.updateSubCategory = async (req, res) => {
    try {
        const findCategory = await Category.findById(req.body.categoryId);
        if (!findCategory || findCategory.length === 0) {
            return res.status(400).send({ msg: "not found" });
        }
        if (req.file) {
            req.body.image = req.file.filename;
        }
        const data = await subCategory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!data) {
            return res.status(400).send({ msg: "not found" });
        }
        res.status(200).send({ msg: "updated", data: data });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            msg: "internal server error ",
            error: err.message,
        });
    }
};
exports.deleteSubCategory = async (req, res) => {
    try {
        const data = await subCategory.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(400).send({ msg: "not found" });
        }
        res.status(200).send({ msg: "deleted", data: data });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            msg: "internal server error",
            error: err.message,
        });
    }
};
exports.getByIdhelpandSupport = async (req, res) => {
    try {
        const data = await helpandSupport.findById(req.params.id);
        if (!data || data.length === 0) {
            return res.status(400).send({ msg: "not found" });
        }
        res.status(200).send({ data: data });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            msg: "internal server error ",
            error: err.message,
        });
    }
};
exports.getAllHelpandSupport = async (req, res) => {
    try {
        const data = await helpandSupport.find();
        res.status(200).json({
            message: data,
        });
    } catch (err) {
        console.log(err);
        res.status(200).json({ message: err.message, });
    }
};
exports.DeleteHelpandSupport = async (req, res) => {
    try {
        await helpandSupport.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted", });
    } catch (err) {
        res.status(400).json({ message: err.message, });
    }
};
exports.addCoupan = async (req, res) => {
    try {
        let vendorData = await User.findOne({ _id: req.user._id });
        if (!vendorData) {
            return res.status(404).send({ status: 404, message: "User not found" });
        } else {
            const d = new Date(req.body.expirationDate);
            req.body.expirationDate = d.toISOString();
            const de = new Date(req.body.activationDate);
            req.body.activationDate = de.toISOString();
            req.body.couponCode = await reffralCode();
            let saveStore = await Coupan(req.body).save();
            if (saveStore) {
                res.json({ status: 200, message: 'Coupan add successfully.', data: saveStore });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 500, message: "Server error" + error.message });
    }
};
exports.getIdCoupan = async (req, res) => {
    try {
        const data = await Coupan.findById(req.params.id);
        if (!data || data.length === 0) {
            return res.status(400).send({ msg: "not found" });
        }
        res.status(200).send({ data: data });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            msg: "internal server error ",
            error: err.message,
        });
    }
};
exports.updateCoupan = async (req, res) => {
    try {
        const data = await Coupan.findById(req.params.id);
        if (!data || data.length === 0) {
            return res.status(400).send({ msg: "not found" });
        } else {
            if (req.body.expirationDate != (null || undefined)) {
                const d = new Date(req.body.expirationDate);
                req.body.expirationDate = d.toISOString();
            }
            if (req.body.activationDate != (null || undefined)) {
                const de = new Date(req.body.activationDate);
                req.body.activationDate = de.toISOString();
            }
            let obj = {
                couponCode: data.couponCode,
                description: req.body.description || data.description,
                minOrder: req.body.minOrder || data.minOrder,
                discount: req.body.discount || data.discount,
                couponType: req.body.couponType || data.couponType,
                expirationDate: req.body.expirationDate || data.expirationDate,
                activationDate: req.body.activationDate || data.activationDate,
            }
            const data1 = await Coupan.findByIdAndUpdate(req.params.id, obj, { new: true });
            res.json({ status: 200, message: 'Coupan update successfully.', data: data1 });

        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            msg: "internal server error ",
            error: err.message,
        });
    }
};
exports.deleteCoupan = async (req, res) => {
    try {
        const data = await Coupan.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(400).send({ msg: "not found" });
        }
        res.status(200).send({ msg: "deleted", data: data });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            msg: "internal server error",
            error: err.message,
        });
    }
}
exports.listCoupan = async (req, res) => {
    try {
        let vendorData = await User.findOne({ _id: req.user._id });
        if (!vendorData) {
            return res.status(404).send({ status: 404, message: "User not found" });
        } else {
            let findService = await Coupan.find({});
            if (findService.length == 0) {
                return res.status(404).send({ status: 404, message: "Data not found" });
            } else {
                res.json({ status: 200, message: 'Coupan Data found successfully.', service: findService });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 500, message: "Server error" + error.message });
    }
};
exports.addCommission = async (req, res) => {
    try {
        let vendorData = await User.findOne({ _id: req.user._id });
        if (!vendorData) {
            return res.status(404).send({ status: 404, message: "User not found" });
        } else {
            let saveStore = await Commission(req.body).save();
            if (saveStore) {
                res.json({ status: 200, message: 'Commission add successfully.', data: saveStore });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 500, message: "Server error" + error.message });
    }
};
exports.getIdCommission = async (req, res) => {
    try {
        const data = await Commission.findById(req.params.id);
        if (!data || data.length === 0) {
            return res.status(400).send({ msg: "not found" });
        }
        res.status(200).send({ data: data });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            msg: "internal server error ",
            error: err.message,
        });
    }
};
exports.updateCommission = async (req, res) => {
    try {
        const data = await Commission.findById(req.params.id);
        if (!data || data.length === 0) {
            return res.status(400).send({ msg: "not found" });
        } else {
            let obj = {
                minOrder: req.body.minOrder || data.minOrder,
                maxOrder: req.body.maxOrder || data.maxOrder,
                commission: req.body.commission || data.commission,
            }
            const data1 = await Commission.findByIdAndUpdate(req.params.id, obj, { new: true });
            res.json({ status: 200, message: 'Coupan update successfully.', data: data1 });

        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            msg: "internal server error ",
            error: err.message,
        });
    }
};
exports.deleteCommission = async (req, res) => {
    try {
        const data = await Commission.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(400).send({ msg: "not found" });
        }
        res.status(200).send({ msg: "deleted", data: data });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            msg: "internal server error",
            error: err.message,
        });
    }
}
exports.listCommission = async (req, res) => {
    try {
        let vendorData = await User.findOne({ _id: req.user._id });
        if (!vendorData) {
            return res.status(404).send({ status: 404, message: "User not found" });
        } else {
            let findService = await Commission.find({});
            if (findService.length == 0) {
                return res.status(404).send({ status: 404, message: "Data not found" });
            } else {
                res.json({ status: 200, message: 'Coupan Data found successfully.', service: findService });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 500, message: "Server error" + error.message });
    }
};
exports.createDoctorCategory = async (req, res) => {
    try {
        const category = {
            name: req.body.name,
        };
        const categoryCreated = await doctorCategory.create(category);
        return res.status(201).send({ message: "Doctor category add successfully", data: categoryCreated, });
    } catch (err) {
        return res.status(500).send({ message: "Internal server error while creating category", });
    }
};
exports.getDoctorCategory = async (req, res) => {
    try {
        const data = await doctorCategory.find();
        if (!data || data.length === 0) {
            return res.status(400).send({ msg: "not found" });
        }
        return res.status(200).send({ data: data });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({
            msg: "internal server error ",
            error: err.message,
        });
    }
};
exports.getIdDoctorCategory = async (req, res) => {
    try {
        const data = await doctorCategory.findById(req.params.id);
        if (!data || data.length === 0) {
            return res.status(400).send({ msg: "not found" });
        }
        return res.status(200).send({ data: data });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({
            msg: "internal server error ",
            error: err.message,
        });
    }
};
exports.updateDoctorCategory = async (req, res) => {
    try {
        const data = await doctorCategory.findById(req.params.id);
        if (!data || data.length === 0) {
            return res.status(400).send({ msg: "not found" });
        } else {

        }
        const update = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, });
        if (!update) {
            return res.status(400).send({ msg: "not found" });
        }
        return res.status(200).send({ msg: "updated", data: data });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({
            msg: "internal server error ",
            error: err.message,
        });
    }
};
exports.deleteDoctorCategory = async (req, res) => {
    try {
        const data = await doctorCategory.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(400).send({ msg: "not found" });
        }
        return res.status(200).send({ msg: "deleted", data: data });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({
            msg: "internal server error",
            error: err.message,
        });
    }
};

exports.createBlog = async (req, res) => {
    try {
        let image;
        if (req.file.path) {
            image = req.file.path
        }
        const data = {
            title: req.body.title,
            image: image,
            description: req.body.description,
            userId: req.user._id
        };
        const Blog = await blog.create(data);
        return res.status(200).json({ message: "Blog add successfully.", status: 200, data: Blog });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
    }
};
exports.updateBlog = async (req, res) => {
    try {
        const findData = await blog.findById(req.params.id);
        if (!findData) {
            return res.status(400).send({ msg: "not found" });
        }
        let image;
        if (req.file.path) {
            image = req.file.path
        }
        const data = {
            title: req.body.title || findData.title,
            image: image || findData.image,
            description: req.body.description || findData.description,
            userId: req.user._id
        };
        const Blog = await blog.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true })
        return res.status(200).json({ message: "Blog update successfully.", status: 200, data: Blog });
    } catch (error) {
        return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
    }
};
exports.getBlog = async (req, res) => {
    try {
        const data = await blog.find({}).populate({ path: "userId", select: 'fullName firstName lastName' });
        if (data.length === 0) {
            return res.status(400).send({ msg: "not found" });
        }
        return res.status(200).json({ status: 200, message: "blog data found.", data: data });
    } catch (err) {
        return res.status(500).send({ msg: "internal server error ", error: err.message, });
    }
};
exports.getBlogByToken = async (req, res) => {
    try {
        const data = await blog.find({ userId: req.user._id }).populate({ path: "userId", select: 'fullName firstName lastName' });
        if (data.length === 0) {
            return res.status(400).send({ msg: "not found" });
        }
        return res.status(200).json({ status: 200, message: "blog data found.", data: data });
    } catch (err) {
        return res.status(500).send({ msg: "internal server error ", error: err.message, });
    }
};
exports.getIdBlog = async (req, res) => {
    try {
        const data = await blog.findById(req.params.id).populate({ path: "userId", select: 'fullName firstName lastName' });
        if (!data) {
            return res.status(400).send({ msg: "not found" });
        }
        return res.status(200).json({ status: 200, message: "Blog data found.", data: data });
    } catch (err) {
        return res.status(500).send({ msg: "internal server error ", error: err.message, });
    }
}
exports.deleteBlog = async (req, res) => {
    try {
        const data = await blog.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(400).send({ msg: "not found" });
        }
        return res.status(200).send({ msg: "deleted", data: data });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ msg: "internal server error", error: err.message, });
    }
};
const reffralCode = async () => {
    var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 36)];
    }
    return OTP;
}