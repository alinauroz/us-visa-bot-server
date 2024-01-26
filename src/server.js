const express = require("express");
const bodyParser = require("body-parser");
const { EVENT_DATES } = require("./constants");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/bot-events", async (req, res) => {
    const { event, data } = req.body;
    console.log("Event", event, data);
    if (event === EVENT_DATES) {

    }
});

app.listen(3000);
