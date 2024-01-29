const { get, update } = require("./db");

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
    console.log(availableDates.length, requiredDates);
}

exports.handleReshudule = async (response) => {
    const data = JSON.parse(response);
    console.log(data);
    const users = await get("users");
    const user = users.find(user => user.email === data.email);
    console.log(user);
    if (user) {
        user.endDate = data.date;
        await update("users", users);
    }
}
