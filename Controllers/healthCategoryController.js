const healthCategory = require("../Models/healthCategory.model");
exports.createCategory = async (req, res) => {
    try {
        const category = {
            name: req.body.name,
            image: req.body.image,
        };
        const categoryCreated = await healthCategory.create(category);
        console.log(`#### Category add successfully #### /n ${categoryCreated} `);
        res.status(201).send({message: "Category add successfully",data: categoryCreated,});
    } catch (err) {
        console.log("#### error while Category create #### ", err.message);
        res.status(500).send({message: "Internal server error while creating category",});
    }
};
exports.getCategory = async (req, res) => {
    try {
        const data = await healthCategory.find();
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
        const data = await healthCategory.findById(req.params.id);
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
        const data = await healthCategory.findById(req.params.id);
        if (!data || data.length === 0) {
            return res.status(400).send({ msg: "not found" });
        }else{

        }
        const update = await healthCategory.findByIdAndUpdate(req.params.id, req.body, {new: true,});
        if (!update) {
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
exports.deleteCategory = async (req, res) => {
    try {
        const data = await healthCategory.findByIdAndDelete(req.params.id);
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