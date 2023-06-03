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

const paitent = require("./routes/paitent.route")
const address =require("./routes/address.route")
const docter =require("./routes/docter.route")
const document =require("./routes/document.route")
app.use("/api/v1/paitents", paitent);
app.use("/api/v1/address", address);
app.use("/api/v1/docter", docter);
app.use("/api/v1/document", document);

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

module.exports = {
    handler: serverless(app),
};
