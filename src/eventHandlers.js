const { get, update } = require("./db");
const { sendAlert } = require("./services/bot");

exports.handleDates = async (dates) => {
    const availableDates = (dates.split(",").map(date => date.trim()));
    const users = await get("users");

    const startDates = users.map(user => new Date(user.startDate).getTime());
    const endDates = users.map(user => new Date(user.endDate).getTime());

    const minStart = Math.min(...startDates);
    const maxEnd = Math.max(...endDates);

    const requiredDates = availableDates.filter(date => {
        const ts = (new Date(date)).getTime();
        return ts >= minStart && ts <= maxEnd;
    });

    if (requiredDates.length > 0) {
        sendAlert(
            `* 📆 Available Dates:\n\n*`
            + requiredDates.join("\n"),
        );
    }
    else {
        console.log("Not sending...")
    }
}

exports.handleReshudule = async (response) => {
    const data = JSON.parse(response);
    const users = await get("users");
    const user = users.find(user => user.email === data.email);
    const newUsers = users.filter(user => !(user.email === data.email && user.scheduleId === data.scheduleId));
    if (user) {
        await update("users", newUsers);
        sendAlert(
            `*✅ Appoint Rescheduled*\n`
            + `Email: _${data.email}_\n`
            + `Date: _${data.date}_`
        );
    }
}
