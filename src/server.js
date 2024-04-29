require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const { EVENT_DATES, EVENT_RESCHEDULED } = require("./constants");
const { handleDates, handleReshudule } = require("./eventHandlers");
const { get } = require("./db");
const { spawn } = require('child_process');
const cron = require("node-cron");
require("./services/bot");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
let embassy = "en-ae-abd";

async function callService () {
    const users = await get("users");
    const bookerPath = process.env.BOOKER_PATH;
    console.log("Path", bookerPath);
    users.forEach(user => {
        const arguments = [user.email, user.password, user.startDate, user.endDate, user.scheduleId, embassy];
        const pythonProcess = spawn('python3', [bookerPath, ...arguments]);
        pythonProcess.stdout.on('data', (data) => {
            console.log(`Python Script Output: ${data}`);
        });
        console.log("Working...");
    });
    embassy = embassy === "en-ae-abd" ? "en-ae-dbu" : "en-ae-abd";
}
callService();
const cronJob = cron.schedule('*/1 * * * *', callService);

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
