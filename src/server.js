const express = require("express");

const invoiceRoute = require("./routes/invoice.route");

const app = express();

app.use(express.json());

app.use("/api", invoiceRoute);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});