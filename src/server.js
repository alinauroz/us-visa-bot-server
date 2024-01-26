const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/bot-events", async (req, res) => {
    const { event, data } = req.body;
    console.log("Event", event, data);
});

app.listen(3000);
