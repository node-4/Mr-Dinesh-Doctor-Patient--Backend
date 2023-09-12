const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Address = require("../models/address.Model");
const helpandSupport = require("../models/helpandsupport.Model");
const jwt = require("jsonwebtoken");
const authConfig = require("../configs/auth.config");
var newOTP = require("otp-generators");
const nodemailer = require("nodemailer");
const Category = require("../models/category.model");
const subCategory = require("../models/subcategory.model");
const Medicine = require("../models/medicine.model");
exports.loginWithPhone = async (req, res) => {
    const { phone } = req.body;
    try {
        const user = await User.findOne({ phone: phone, role: "pharmacy" });
        if (!user) {
            return res.status(400).send({ msg: "not found" });
        }
        const userObj = {};
        userObj.otp = newOTP.generate(4, {
            alphabets: false,
            upperCase: false,
            specialChar: false,
        });
        userObj.otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
        userObj.accountVerification = false;
        const updated = await User.findOneAndUpdate(
            { phone: phone, role: "pharmacy" },
            userObj,
            { new: true }
        );
        res.status(200).send({ userId: updated._id, otp: updated.otp });
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
        const admin = await User.findOne({ email: req.body.email, role: "pharmacy", });
        if (!admin) {
            return res.status(400).send({ message: "Failed! pharmacy passed doesn't exist" });
        }
        const passwordIsValid = bcrypt.compareSync(req.body.password, admin.password);
        if (!passwordIsValid) {
            return res.status(401).send({ message: "Wrong password" });
        }
        const accessToken = jwt.sign({ id: admin._id }, authConfig.secret, {
            expiresIn: "24h",
        });
        res.status(200).send({
            msg: "Pharmacy logged in successfully",
            accessToken: accessToken,
        });
    } catch (err) {
        console.log("#### Error while Admin signing in ##### ", err.message);
        res.status(500).send({
            message: "Internal server error while Admin signing in",
        });
    }
};
exports.registration = async (req, res) => {
    const { phone, email } = req.body;
    try {
        req.body.email = email.split(" ").join("").toLowerCase();
        let user = await User.findOne({ $and: [{ $or: [{ email: req.body.email }, { phone: phone }] }], role: "pharmacy", });
        if (!user) {
            req.body.password = bcrypt.hashSync(req.body.password, 8);
            req.body.role = "pharmacy";
            req.body.otp = newOTP.generate(4, { alphabets: false, upperCase: false, specialChar: false, });
            req.body.otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
            req.body.accountVerification = false;
            const userCreate = await User.create(req.body);
            res.status(200).send({
                message: "registered successfully ", data: userCreate,
            });
        } else {
            res.status(409).send({ message: "Alrady Exist", data: [] });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: "user not found" });
        }
        if (user.otp !== otp || user.otpExpiration < Date.now()) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        const updated = await User.findByIdAndUpdate(
            { _id: user._id },
            { accountVerification: true },
            { new: true }
        );
        const accessToken = jwt.sign({ id: user._id }, authConfig.secret, {
            expiresIn: authConfig.accessTokenTime,
        });
        res.status(200).send({
            message: "logged in successfully",
            accessToken: accessToken,
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ error: "internal server error" + err.message });
    }
};
exports.update = async (req, res) => {
    try {
        const { firstName, lastName, email, age, weight, height } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send({ message: "not found" });
        }
        user.fullName = user.fullName;
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
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
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res
                .status(404)
                .send({ message: "user not found ! not registered" });
        } else {
            const otp = newOTP.generate(4, {
                alphabets: false,
                upperCase: false,
                specialChar: false,
            });
            const user1 = await User.findByIdAndUpdate(
                { _id: user._id },
                {
                    otp: otp,
                    accountVerification: false,
                    otpExpiration: Date.now() + 3600000,
                },
                { new: true }
            );
            const transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                auth: {
                    user: "frieda.smitham40@ethereal.email",
                    pass: "TURy68KCpFSsFyNfjs",
                },
            });
            // Define the email options
            const mailOptions = {
                to: req.body.email,
                from: "node2@flyweis.technology",
                subject: "Password reset request",
                text:
                    `OTP ${otp}\n` +
                    `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                    `your otp is ${otp} ` +
                    `for reset password\n\n` +
                    `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            };

            // Send the email with nodemailer
            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({
                        message:
                            "Could not send email. Please try again later.",
                    });
                }
                res.status(200).json({
                    message: "Password reset email sent successfully",
                    otp: otp,
                    userId: user._id,
                });
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred. Please try again later.",
        });
    }
};
exports.forgotPasswordOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: "user not found" });
        }
        if (user.otp !== otp || user.otpExpiration < Date.now()) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        const updated = await User.findByIdAndUpdate(
            { _id: user._id },
            { accountVerification: true },
            { new: true }
        );
        res.status(200).send({
            message: "otp verified successfull update your passpword.",
            userId: updated._id,
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ error: "internal server error" + err.message });
    }
};
exports.resetPassword = async (req, res) => {
    try {
        // Extract password and confirm password from request body
        const { password, confirmPassword } = req.body;
        const user = await User.findOne({ _id: req.params.id });
        if (!user) {
            return res
                .status(400)
                .json({ status: 400, message: "Invalid or expired token" });
        } else {
            if (user.accountVerification == true) {
                if (password !== confirmPassword) {
                    return res.status(400).json({
                        status: 400,
                        message: "Passwords do not match",
                    });
                } else {
                    user.password = bcrypt.hashSync(password, 10);
                    await user.save();
                    res.status(200).json({
                        status: 200,
                        message: "Password reset successful",
                    });
                }
            } else {
                return res.status(400).json({
                    status: 400,
                    message: "Please first verify your account.",
                });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred. Please try again later.",
        });
    }
};
exports.resendOTP = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(400).send({ message: "User not found" });
        }
        const otp = newOTP.generate(4, {
            alphabets: false,
            upperCase: false,
            specialChar: false,
        });
        const otpExpiration = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
        const accountVerification = false;
        const updated = await User.findOneAndUpdate(
            { _id: id },
            { otp, otpExpiration, accountVerification },
            { new: true }
        );
        res.status(200).send({ message: "OTP resent", otp: otp });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" + error.message });
    }
};
exports.changePassword = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(400).json({ status: 400, message: "Invalid or expired token" });
        } else {
            if (password !== confirmPassword) {
                return res.status(400).json({ status: 400, message: "Passwords do not match", });
            } else {
                user.password = bcrypt.hashSync(password, 10);
                await user.save();
                res.status(200).json({ status: 200, message: "Password Changed successful" });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred. Please try again later.",
        });
    }
};
exports.AddQuery = async (req, res) => {
    try {
        req.body.user = req.user._id;
        const Data = await helpandSupport.create(req.body);
        res.status(200).json({
            message: Data,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message, });
    }
};
exports.createCategory = async (req, res) => {
    try {
        const category = {
            name: req.body.name,
            image: req.body.image,
            vendorId: req.user._id
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
        const data = await Category.find({ vendorId: req.user._id });
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
            vendorId: req.user._id
        };
        const subcategoryCreated = await subCategory.create(subcategory);
        res.status(201).send({ message: "Sub Category add successfully", data: subcategoryCreated, });
    } catch (err) {
        console.log("#### error while sub Category create #### ", err.message);
        res.status(500).send({
            message: "Internal server error while creating sub category",
        });
    }
};
exports.getSubCategory = async (req, res) => {
    try {
        const data = await subCategory.find({ vendorId: req.user._id }).populate('categoryId');
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
exports.createMedicine = async (req, res) => {
    try {
        const data = await Category.findById(req.body.categoryId);
        if (!data || data.length === 0) {
            return res.status(400).send({ msg: "not found" });
        } else {
            const data2 = await subCategory.findById(req.body.subcategoryId);
            if (!data2 || data2.length === 0) {
                return res.status(400).send({ msg: "not found" });
            } else {
                const medicine = {
                    name: req.body.name,
                    price: req.body.price,
                    batchNumber: req.body.batchNumber,
                    quantity: req.body.quantity,
                    companyName: req.body.companyName,
                    description: req.body.description,
                    image: req.body.image,
                    categoryId: data._id,
                    subcategoryId: data2._id,
                    vendorId: req.user._id
                };
                const medicineCreated = await Medicine.create(medicine);
                res.status(201).send({ message: "Medicine add successfully", data: medicineCreated, });
            }
        }
    } catch (err) {
        res.status(500).send({ message: "Internal server error while creating Medicine", });
    }
};
exports.getMedicine = async (req, res) => {
    try {
        const data = await Medicine.find({ vendorId: req.user._id }).populate('categoryId subcategoryId');
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
exports.getIdMedicine = async (req, res) => {
    try {
        const data = await Medicine.findById(req.params.id);
        if (!data || data.length === 0) {
            return res.status(400).send({ msg: "not found" });
        }
        res.status(200).send({ data: data });
    } catch (err) {
        res.status(500).send({ msg: "internal server error ", error: err.message, });
    }
};
exports.updateMedicine = async (req, res) => {
    try {
        const findData = await Medicine.findById(req.params.id);
        if (!findData || findData.length === 0) {
            return res.status(400).send({ msg: "Medicine not found" });
        }
        const data = await Category.findById(req.body.categoryId);
        if (!data || data.length === 0) {
            return res.status(400).send({ msg: "Category not found" });
        }
        const data2 = await subCategory.findById(req.body.subcategoryId);
        if (!data2 || data2.length === 0) {
            return res.status(400).send({ msg: "subCategory not found" });
        }
        const medicine = {
            name: req.body.name || findData.name,
            price: req.body.price || findData.price,
            batchNumber: req.body.batchNumber || findData.batchNumber,
            quantity: req.body.quantity || findData.quantity,
            companyName: req.body.companyName || findData.companyName,
            description: req.body.description || findData.description,
            image: req.body.image || findData.image,
            categoryId: data._id || findData.categoryId,
            subcategoryId: data2._id || findData.subcategoryId,
            vendorId: findData.vendorId
        };
        const data3 = await Medicine.findByIdAndUpdate(findData._id, medicine, { new: true });
        if (data3) {
            res.status(200).send({ msg: "updated", data: data3 });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ msg: "internal server error ", error: err.message, });
    }
};
exports.deleteMedicine = async (req, res) => {
    try {
        const data = await Medicine.findByIdAndDelete(req.params.id);
        res.status(200).send({ msg: "deleted", data: {} });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            msg: "internal server error",
            error: err.message,
        });
    }
};