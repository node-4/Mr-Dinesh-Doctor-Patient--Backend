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
// require("./routes/addressroute")(app);
// require("./routes/adminroute")(app);
// require("./routes/docterroute")(app);
// require("./routes/documentroute")(app);
// require("./routes/healthCategoryroute")(app);
// require("./routes/heathtestrouter")(app);
// require("./routes/paitentroute")(app);
// require("./routes/preferencerouter")(app);
// require("./routes/productroute")(app);
// require("./routes/bookingrouter")(app);
// require("./routes/chatrouter")(app);


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
