const Testhealth = require("../Models/testhealthModel");
exports.addhealthtest = async (req, res) => {
    try {
        const { testtitle, testcontent, hour, collections, categoryid, testprice } = req.body;
        if (testtitle == '' || testcontent == '' || hour == '' || collections == '' || categoryid == '' || testprice == '') {
            res.status(201).json({ status: 201, message: "Empty Field Not Accepted" })
        } else {
            const healthcarefind = await Testhealth.findOne({ testtitle })
            if (healthcarefind) {
                res.status(409).json({ status: 409, message: "Health Test Detail Exist" })
            } else {
                const data = await Testhealth({
                    testimage: req.body.image,
                    testcontent: req.body.testcontent,
                    testtitle: req.body.testtitle,
                    hour: req.body.hour,
                    collections: req.body.collections,
                    testprice: req.body.testprice,
                    healthtestcategoryid: req.body.categoryid,
                })
                const dataentered = await data.save()
                if (dataentered) {
                    res.status(200).json({ status: "Success", dataentered })
                } else {
                    res.status(501).json({ status: "Failed", message: "Opps!!! Something Went Wrong, Please Try again", })
                }
            }
        }
    } catch (error) {
        res.status(501).json({ status: "Failed", message: "Oops!!! Error Occurs" })
    }
};
exports.editTestProduct = async (req, res) => {
    try {
        let updateid = await Testhealth.findById(req.params.id);
        if (updateid) {
            const data = {
                testimage: req.body.image || updateid.testimage,
                testcontent: req.body.testcontent || updateid.testcontent,
                testtitle: req.body.testtitle || updateid.testtitle,
                hour: req.body.hour || updateid.hour,
                collections: req.body.collections || updateid.collections,
                testprice: req.body.testprice || updateid.testprice,
                categoryid: req.body.categoryid || updateid.categoryid,
            };
            categorydetails = await Testhealth.findByIdAndUpdate(req.params.id, data, { new: true })
            if (categorydetails) {
                res.status(StatusCodes.OK).json({ message: "Sub Category updated successfuly", code: StatusCodes.OK, data: categorydetails })
            } else {
                res.status(501).json({
                    message: "Opps!!! Something Went Wrong, Please Try Again later", status: "Failed"
                })
            }
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({
                code: 404, status: "failed", message: "Invalid Sub Category ID",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
};
exports.updatestate = async (req, res) => {

    try {
        let updateid = await Testhealth.findById(req.params.id);
        if (updateid) {
            const data = {
                status: req.body.status || updateid.status,
            };
            categorydetails = await Testhealth.findByIdAndUpdate(req.params.id, data, { new: true })
            if (categorydetails) {
                res.status(StatusCodes.OK).json({
                    message: "Status Updated",
                    code: StatusCodes.OK,
                    data: categorydetails
                })
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Opps!!! Something Went Wrong, Please Try Again later",
                    status: "Failed"
                })
            }

        } else {
            res.status(StatusCodes.BAD_REQUEST).json({
                code: StatusCodes.BAD_REQUEST,
                status: "failed",
                message: "Invalid Sub Category ID",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
};
exports.deletetesthealth = async (req, res) => {
    try {
        const testID = await Testhealth.findByIdAndDelete(req.params.id)
        if (testID) {
            res.status(StatusCodes.OK).json({ message: "Health Test Deleted Successfully" })
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid Health Test ID" })
        }

    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Something Went Wrong" })
    }
};
exports.gethealthtestbyid = async (req, res) => {
    try {
        const singlehealthtest = await Testhealth.findById(req.params.id)
            .populate("healthtestcategoryid")
        if (singlehealthtest) {
            res.status(StatusCodes.OK).json({
                message: "success",
                data: singlehealthtest
            })
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({
                status: "Failed",
                message: "Invalid Health test ID"
            })
        }


    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
};
exports.gethealthtestbyheathcategoryid = async (req, res) => {
    const ids = req.params.healthtestcategoryid
    try {
        const singleHealth = await Testhealth.find({ healthtestcategoryid: ids }).populate("healthtestcategoryid")
        if (singleHealth) {
            res.status(StatusCodes.OK).json({ message: "success", count: singleHealth.length, data: singleHealth })
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({ status: "Failed", message: "Invalid Health Test ID" })
        }


    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
};
exports.getallhealthtest = async (req, res) => {
    try {
        const data = await Testhealth.find()
            .populate({ path: "healthtestcategoryid" })
        if (data) {
            res.status(StatusCodes.OK).json({
                message: "success",
                count: data.length,
                data: data
            });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Opps!!! Something Went wrong",
                status: "Failed"
            });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
};
exports.getallhealthtestbystatus = async (req, res) => {
    try {
        const data = await Testhealth.find({ status: "Limited Time" })
            .populate({ path: "healthtestcategoryid" })
        if (data) {
            res.status(StatusCodes.OK).json({
                message: "success",
                count: data.length,
                data: data
            });
        } else {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Opps!!! Something Went wrong",
                status: "Failed"
            });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
};
