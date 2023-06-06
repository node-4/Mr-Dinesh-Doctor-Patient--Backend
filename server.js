const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const http = require("http");
const server = http.createServer(app);
const bodyparser = require("body-parser");
const serverless = require("serverless-http");
require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 9006;
mongoose
    .connect(process.env.DB_URL)
    .then(() => {
        console.log("Db conneted succesfully", process.env.DB_URL);
    })
    .catch((err) => {
        console.log(err);
    });
app.get("/", (req, res) => {
    res.status(200).send({ msg: "Working App" });
});
const address =require("./routes/address.route")
const admin =require("./routes/admin.route")
const docter =require("./routes/docter.route")
const document =require("./routes/document.route")
const healthCategory =require("./routes/healthCategory.route");
const testhealth =require("./routes/heathtest.router")
const paitent = require("./routes/paitent.route")
const preferenceRouter =require("./routes/preference.router")
const product =require("./routes/product.route")
const booking =require("./routes/booking.router")
const chat =require("./routes/chat.router")
app.use("/api/v1/admin", admin);
app.use("/api/v1/paitents", paitent);
app.use("/api/v1/address", address);
app.use("/api/v1/docter", docter);
app.use("/api/v1/document", document);
app.use("/api/v1/testhealth", testhealth);
app.use("/api/v1/healthCategory", healthCategory);
app.use("/api/v1/preferenceRouter", preferenceRouter);
app.use("/api/v1/product", product);
app.use("/api/v1/booking", booking);
app.use("/api/v1/chat", chat);

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

module.exports = {
    handler: serverless(app),
};
