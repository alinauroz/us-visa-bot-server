const express = require("express");
const bodyParser = require("body-parser");
const { EVENT_DATES, EVENT_RESCHEDULED } = require("./constants");
const { handleDates } = require("./eventHandlers");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/bot-events", async (req, res) => {
    const { event, data } = req.body;
    console.log("Event", event, data);
    if (event === EVENT_DATES) {
        handleDates(data);
    }
    else if (event === EVENT_RESCHEDULED) {
        console.log("Event");
    }

    return res.send({ msg: "ok" })
});

app.listen(3000);
