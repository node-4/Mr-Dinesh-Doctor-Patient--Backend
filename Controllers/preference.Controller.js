const Testhealth = require("../models/testhealth.Model");
const Testpreference = require("../models/testpreference.Model");
exports.addpreference = async (req, res) => {
    try {
        const { preferencename, preferenceprice, testID } = req.body
        if (preferencename == '' || testID == '' || preferenceprice == '') {
            res.status(401).json({ status: "Failed", message: "Empty Field Not Accepted" })
        } else {
            const check = await Testpreference.findOne({ preferencename })
            if (check) {
                res.status(404).json({ status: "Failed", message: "Preference Exist" })
            } else {
                const idcheck = await Testhealth.findOne({ _id: testID })
                const data = await new Testpreference({
                    preferenceimage: req.body.image,
                    preferencename: req.body.preferencename,
                    preferenceprice: idcheck.testprice,
                    testID: req.body.testID,
                })
                await data.save()
                res.status(200).json({ status: "Success", data, })
            }
        }
    } catch (error) {
        console.log(error)
        res.status(501).json({
            status: "Failed",
            message: "Oops!!! Error Occurs"
        })
    }
}
exports.editpreference = async (req, res) => {
    try {
        let updateid = await Testpreference.findById(req.params.id);
        const { testID } = req.body
        const idcheck = await Testhealth.findOne({ _id: testID })
        if (updateid) {
            const data = {
                preferenceimage: req.body.image || updateid.preferenceimage,
                testID: req.body.testID || updateid.testID,
                preferenceprice: idcheck.testprice || updateid.preferenceprice,
                preferencename: req.body.preferencename || updateid.preferencename,
            };
            datas = await Testpreference.findByIdAndUpdate(req.params.id, data, { new: true })
            res.status(200).json({
                message: "Preference updated successfuly",
                code: 200,
                data: datas
            })
        } else {
            res.status(401).json({
                code: 401,
                status: "failed",
                message: "Invalid preference ID",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}
exports.deletepreference = async (req, res) => {
    try {
        const preferenceid = await Testpreference.findByIdAndDelete(req.params.id)
        if (preferenceid) {
            res.status(200).json({ message: "preference Deleted Successfully" })
        } else {
            res.status(401).json({ message: "Invalid Preference ID" })
        }

    } catch (err) {
        res.status(501).json({ error: "Something Went Wrong" })
    }
};
exports.getpreferencebyid = async (req, res) => {
    try {
        const singleprefrence = await Testpreference.findById(req.params.id)
            .populate("testID")
        if (singleprefrence) {
            res.status(200).json({
                message: "success",
                data: singleprefrence
            })
        } else {
            res.status(401).json({
                status: "Failed",
                message: "Invalid Preference ID"
            })
        }


    } catch (error) {
        res.status(501).json(error)
    }
}
exports.getpreferencebytestid = async (req, res) => {
    const ids = req.params.testID
    //const params=req.params.id
    try {
        const singlepreference = await Testpreference.find({ testID: ids })
            .populate("testID")
        if (singlepreference) {
            res.status(200).json({
                message: "success",
                data: singlepreference
            })
        } else {
            res.status(401).json({
                status: "Failed",
                message: "Invalid Preference ID"
            })
        }


    } catch (error) {
        res.status(501).json(error)
    }
}
exports.getallpreference = async (req, res) => {
    try {
        const data = await Testpreference.find()
            .populate({ path: "testID" })
        res.status(200).json({
            message: "success",
            count: data.length,
            data: data
        });

    } catch (error) {
        res.status(501).json(error)
    }
}