const { get, update } = require("./db");

exports.handleDates = async (dates) => {
    const availableDates = (dates.split(",").map(date => date.trim()));
    const dbDates = get("dates");
    const existingDates = dbDates.flat();

    const newDates = availableDates.filter(d => {
        return existingDates.indexOf(d) === -1;
    });

    const updatedDates = dbDates.slice(-100);
    updatedDates.push(availableDates);
    update("dates", updatedDates);
    console.log(newDates);
    console.log("UpdatedDates", updatedDates);
}