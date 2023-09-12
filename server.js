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

app.get("/", (req, res) => {
    res.status(200).send({ msg: "Working App" });
});
require("./routes/address.route")(app);
require("./routes/admin.route")(app);
require("./routes/docter.route")(app);
require("./routes/document.route")(app);
require("./routes/healthCategory.route")(app);
require("./routes/heathtest.router")(app);
require("./routes/paitent.route")(app);
require("./routes/preference.router")(app);
require("./routes/product.route")(app);
require("./routes/booking.router")(app);
require("./routes/chat.router")(app);
require("./routes/pharmacy.route")(app);
require("./routes/order.route")(app);

const static = require('./routes/static.route');
app.use('/api/v1/static', static);

// app.use("/api/v1/admin", admin);
// app.use("/api/v1/paitents", paitent);
// app.use("/api/v1/address", address);
// app.use("/api/v1/docter", docter);
// app.use("/api/v1/document", document);
// app.use("/api/v1/testhealth", testhealth);
// app.use("/api/v1/healthCategory", healthCategory);
// app.use("/api/v1/preferenceRouter", preferenceRouter);
// app.use("/api/v1/product", product);
// app.use("/api/v1/booking", booking);
// app.use("/api/v1/chat", chat);



mongoose.Promise = global.Promise;
mongoose.set("strictQuery", true);
mongoose
    .connect(process.env.DB_URL)
    .then(() => {
        console.log("Db conneted succesfully", process.env.DB_URL);
    })
    .catch((err) => {
        console.log(err);
    });





app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

module.exports = {
    handler: serverless(app),
};
