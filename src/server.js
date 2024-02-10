require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const { EVENT_DATES, EVENT_RESCHEDULED } = require("./constants");
const { handleDates, handleReshudule } = require("./eventHandlers");
const { get } = require("./db");
const { spawn } = require('child_process');
require("./services/bot");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

(async function() {
    const users = await get("users");
    const path = "/Users/nauroz/Documents/freelance/talha973/us_visa_scheduler/visa.py";
    users.forEach(user => {
        const arguments = [user.email, user.password, user.startDate, user.endDate];
        const pythonProcess = spawn('python3', [path, ...arguments]);
        pythonProcess.stdout.on('data', (data) => {
            console.log(`Python Script Output: ${data}`);
        });
        console.log("Working...")
    });
})();

app.post("/bot-events", async (req, res) => {
    const { event, data } = req.body;
    console.log("Event", event === EVENT_RESCHEDULED, data);
    if (event === EVENT_DATES) {
        handleDates(data);
    }
    else if (event === EVENT_RESCHEDULED) {
        console.log("Event");
        handleReshudule(data);
    }

    return res.send({ msg: "ok" })
});

app.listen(3000);
