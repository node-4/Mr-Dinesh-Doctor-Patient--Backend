const User = require("../models/user.model");
const Product = require("../models/medicine.model");
const Cart = require("../models/cartModel");
const orderModel = require("../models/orderModel");

exports.getCart = async (req, res) => {
        try {
                let userData = await User.findOne({ _id: req.user.id, userType: "USER" });
                if (!userData) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                } else {
                        let findCart = await Cart.findOne({ userId: userData._id }).populate("userId")
                                .populate("medicines.vendorId")
                                .populate("medicines.category")
                                .populate("medicines.medicineId")
                        if (!findCart) {
                                return res.status(404).json({ status: 404, message: "Cart is empty.", data: {} });
                        } else {
                                res.status(200).json({ message: "cart data found.", status: 200, data: findCart });
                        }
                }
        } catch (error) {
                console.log(error);
                res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.addToCart = async (req, res) => {
        try {
                let userData = await User.findOne({ _id: req.user.id, userType: "USER" });
                if (!userData) {
                        return res.status(404).json({ message: "No data found", data: {} });
                } else {
                        let findCart = await Cart.findOne({ userId: userData._id });
                        if (findCart) {
                                if (findCart.medicines.length == 0) {
                                        let findProduct = await Product.findById({ _id: req.body.productId });
                                        if (findProduct) {
                                                let totalAmount = 0, total = findProduct.price * req.body.quantity;
                                                let medicine = {
                                                        vendorId: findProduct.vendorId,
                                                        category: findProduct.categoryId,
                                                        medicineId: findProduct._id,
                                                        medicinePrice: findProduct.price,
                                                        quantity: req.body.quantity,
                                                        total: total,
                                                };
                                                let update = await Cart.findByIdAndUpdate({ _id: findCart._id }, { $push: { medicines: medicine } }, { new: true })
                                                for (let i = 0; i < update.medicines.length; i++) {
                                                        totalAmount = totalAmount + update.medicines[i].total;
                                                }
                                                let obj = {
                                                        totalAmount: totalAmount,
                                                        paidAmount: totalAmount,
                                                        totalItem: update.medicines.length,
                                                }
                                                let update1 = await Cart.findByIdAndUpdate({ _id: findCart._id }, { $set: obj }, { new: true })
                                                res.status(200).json({ status: 200, message: "Product successfully add to cart. ", data: update1 })
                                        } else {
                                                return res.status(404).json({ message: "No data found", data: {} });
                                        }
                                } else {
                                        for (let i = 0; i < findCart.medicines.length; i++) {
                                                let findProduct = await Product.findById({ _id: req.body.productId });
                                                if (findProduct) {
                                                        if (((findCart.medicines[i].medicineId).toString() == findProduct._id) == true) {
                                                                console.log("-----------------------------5555-");
                                                                let obj = {
                                                                        vendorId: findProduct.vendorId,
                                                                        category: findProduct.categoryId,
                                                                        medicineId: findProduct._id,
                                                                        medicinePrice: findProduct.price,
                                                                        quantity: req.body.quantity,
                                                                        total: findProduct.price * req.body.quantity,
                                                                }
                                                                let update = await Cart.findByIdAndUpdate({ _id: findCart._id, 'medicines.medicineId': req.body._id }, { $set: { medicines: obj } }, { new: true });
                                                                if (update) {
                                                                        let totals = 0;
                                                                        for (let j = 0; j < update.medicines.length; j++) {
                                                                                totals = totals + update.medicines[j].total
                                                                        }
                                                                        let update1 = await Cart.findByIdAndUpdate({ _id: update._id }, { $set: { totalAmount: totals, totalItem: update.medicines.length } }, { new: true });
                                                                        return res.status(200).json({ status: 200, message: "Medicine add to cart Successfully.", data: update1 })
                                                                }
                                                        } else {
                                                                let total = findProduct.price * req.body.quantity;
                                                                let obj = {
                                                                        vendorId: findProduct.vendorId,
                                                                        category: findProduct.categoryId,
                                                                        medicineId: findProduct._id,
                                                                        medicinePrice: findProduct.price,
                                                                        quantity: req.body.quantity,
                                                                        total: findProduct.price * req.body.quantity,
                                                                }
                                                                let update = await Cart.findByIdAndUpdate({ _id: findCart._id }, { $push: { medicines: obj }, $set: { totalAmount: findCart.totalAmount + total, totalItem: findCart.totalItem + 1 } }, { new: true });
                                                                if (update) {
                                                                        return res.status(200).json({ status: 200, message: "Medicine add to cart Successfully.", data: update })
                                                                }
                                                        }
                                                } else {
                                                        return res.status(404).send({ status: 404, message: "Medicine not found" });
                                                }
                                        }
                                }
                        } else {
                                let findProduct = await Product.findById({ _id: req.body.productId });
                                if (findProduct) {
                                        let totalAmount = 0, medicines = [], total = findProduct.price * req.body.quantity;
                                        let product = { vendorId: findProduct.vendorId, category: findProduct.categoryId, medicineId: findProduct._id, medicinePrice: findProduct.price, quantity: req.body.quantity, total: total, };
                                        medicines.push(product);
                                        for (let i = 0; i < medicines.length; i++) {
                                                totalAmount = totalAmount + medicines[i].total
                                        }
                                        let obj = {
                                                userId: userData._id,
                                                medicines: medicines,
                                                totalAmount: totalAmount,
                                                totalItem: medicines.length,
                                        }
                                        console.log(obj);
                                        const Data = await Cart.create(obj);
                                        res.status(200).json({ status: 200, message: "Product successfully add to cart. ", data: Data })
                                } else {
                                        return res.status(404).json({ message: "No data found", data: {} });
                                }
                        }
                }
        } catch (error) {
                console.log(error);
                res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.checkout = async (req, res) => {
        try {
                let findOrder = await orderModel.find({ user: req.user.id, orderStatus: "unconfirmed" });
                if (findOrder.length > 0) {
                        for (let i = 0; i < findOrder.length; i++) {
                                let findOrders = await orderModel.find({ orderId: findOrder[i].orderId });
                                if (findOrders.length > 0) {
                                        for (let i = 0; i < findOrders.length; i++) {
                                                await orderModel.findByIdAndDelete({ _id: findOrders[i]._id });
                                        }
                                }
                        }
                        let findCart = await Cart.findOne({ userId: req.user.id });
                        if (findCart) {
                                let orderId = await reffralCode();
                                for (let i = 0; i < findCart.medicines.length; i++) {
                                        let obj = {
                                                orderId: orderId,
                                                userId: findCart.userId,
                                                vendorId: findCart.medicines[i].vendorId,
                                                medicines: [{
                                                        category: findCart.medicines[i].category,
                                                        medicineId: findCart.medicines[i].medicineId,
                                                        medicinePrice: findCart.medicines[i].medicinePrice,
                                                        quantity: findCart.medicines[i].quantity,
                                                        total: findCart.medicines[i].total,
                                                }],
                                                address: {
                                                        street1: req.body.street1,
                                                        street2: req.body.street2,
                                                        city: req.body.city,
                                                        state: req.body.state,
                                                        country: req.body.country
                                                },
                                        }
                                        const Data = await orderModel.create(obj);
                                        res.status(200).json({ status: 200, message: "Order create successfully. ", data: findUserOrder })
                                }
                        }
                } else {
                        let findCart = await Cart.findOne({ userId: req.user.id });
                        if (findCart) {
                                let vendor = [], order = [];
                                let orderId = await reffralCode();
                                for (let i = 0; i < findCart.medicines.length; i++) {
                                        if (vendor.length == 0) {
                                                let obj = {
                                                        vendorId: findCart.medicines[i].vendorId,
                                                        data: [{
                                                                category: findCart.medicines[i].category,
                                                                medicineId: findCart.medicines[i].medicineId,
                                                                medicinePrice: findCart.medicines[i].medicinePrice,
                                                                quantity: findCart.medicines[i].quantity,
                                                                total: findCart.medicines[i].total,
                                                        }]
                                                }
                                                vendor.push(obj)
                                        } else {
                                                for (let k = 0; k < vendor.length; k++) {
                                                        if (((findCart.medicines[i].vendorId).toString() == vendor[k].vendorId) == true) {
                                                                let ka = {
                                                                        category: findCart.medicines[i].category,
                                                                        medicineId: findCart.medicines[i].medicineId,
                                                                        medicinePrice: findCart.medicines[i].medicinePrice,
                                                                        quantity: findCart.medicines[i].quantity,
                                                                        total: findCart.medicines[i].total,
                                                                }
                                                                vendor[k].data.push(ka)
                                                        } else {
                                                                let obj = {
                                                                        vendorId: findCart.medicines[i].vendorId,
                                                                        data: [{
                                                                                category: findCart.medicines[i].category,
                                                                                medicineId: findCart.medicines[i].medicineId,
                                                                                medicinePrice: findCart.medicines[i].medicinePrice,
                                                                                quantity: findCart.medicines[i].quantity,
                                                                                total: findCart.medicines[i].total,
                                                                        }]
                                                                }
                                                                vendor.push(obj)
                                                        }
                                                }
                                        }
                                }
                                let TotalOrderAmount = 0;
                                for (let j = 0; j < vendor.length; j++) {
                                        let totalAmount = 0;
                                        for (let k = 0; k < vendor[j].data.length; k++) {
                                                totalAmount = totalAmount + vendor[j].data[k].total
                                        }
                                        let obj = {
                                                orderId: orderId,
                                                userId: findCart.userId,
                                                vendorId: vendor[j].vendorId,
                                                medicines: vendor[j].data,
                                                totalAmount: totalAmount,
                                                totalItem: vendor[j].data.length,
                                                address: {
                                                        street1: req.body.street1,
                                                        street2: req.body.street2,
                                                        city: req.body.city,
                                                        state: req.body.state,
                                                        country: req.body.country
                                                },
                                        }
                                        TotalOrderAmount = TotalOrderAmount + totalAmount
                                        const Data = await orderModel.create(obj);
                                        order.push(Data)
                                }
                                res.status(200).json({ status: 200, message: "Order create successfully. ", data: order, TotalOrderAmount: TotalOrderAmount, orderId: orderId })
                        }
                }
        } catch (error) {
                console.log(error);
                res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.placeOrder = async (req, res) => {
        try {
                let findUserOrder = await orderModel.find({ orderId: req.params.orderId });
                if (findUserOrder.length > 0) {
                        if (req.body.paymentStatus == "paid") {
                                for (let i = 0; i < findUserOrder.length; i++) {
                                        let update = await orderModel.findByIdAndUpdate({ _id: findUserOrder[i]._id }, { $set: { orderStatus: "confirmed", paymentStatus: "paid" } }, { new: true });
                                }
                                res.status(200).json({ message: "Payment success.", status: 200, data: {} });
                        }
                        if (req.body.paymentStatus == "failed") {
                                res.status(201).json({ message: "Payment failed.", status: 201, orderId: orderId });
                        }

                } else {
                        return res.status(404).json({ message: "No data found", data: {} });
                }
        } catch (error) {
                res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getAllOrder = async (req, res) => {
        try {
                const data = await orderModel.find({ userId: req.user.id }).populate("vendorId").populate("medicines.category").populate("medicines.medicineId");
                if (data.length > 0) {
                        return res.status(200).json({ message: "All order", data: data });
                } else {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
        } catch (error) {
                console.log(error);
                res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.acceptRejectOrder = async (req, res) => {
        try {
                const data = await orderModel.findById({ _id: req.params.id });
                if (data) {
                        let update = await orderModel.findByIdAndUpdate({ _id: data._id }, { $set: { vendorStatus: req.body.status } }, { new: true })
                        return res.status(200).json({ message: `order has been ${req.body.status} `, data: update });
                } else {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
        } catch (error) {
                console.log(error);
                res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getAllvendorPendingOrder = async (req, res) => {
        try {
                const data = await orderModel.find({ vendorId: req.user.id, vendorStatus: "Pending" }).populate("vendorId").populate("medicines.category").populate("medicines.medicineId");
                if (data.length > 0) {
                        return res.status(200).json({ message: "All order", data: data });
                } else {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
        } catch (error) {
                console.log(error);
                res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getAllvendorAcceptOrder = async (req, res) => {
        try {
                const data = await orderModel.find({ vendorId: req.user.id, vendorStatus: "Accept" }).populate("vendorId").populate("medicines.category").populate("medicines.medicineId");
                if (data.length > 0) {
                        return res.status(200).json({ message: "All order", data: data });
                } else {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
        } catch (error) {
                console.log(error);
                res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getAllvendorRejectOrder = async (req, res) => {
        try {
                const data = await orderModel.find({ vendorId: req.user.id, vendorStatus: "Reject" }).populate("vendorId").populate("medicines.category").populate("medicines.medicineId");
                if (data.length > 0) {
                        return res.status(200).json({ message: "All order", data: data });
                } else {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
        } catch (error) {
                console.log(error);
                res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
const reffralCode = async () => {
        var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let OTP = '';
        for (let i = 0; i < 9; i++) {
                OTP += digits[Math.floor(Math.random() * 36)];
        }
        return OTP;
}
