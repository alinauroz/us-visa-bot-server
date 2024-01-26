const fs = require("fs");
const db = JSON.parse(fs.readFileSync("./db.dat", "utf-8"));

exports.get = (field) => {
    return db[field];
}

exports.update = (field, value) => {
    db[field] = value;
    fs.writeFileSync("./db.dat", JSON.stringify(db));
}