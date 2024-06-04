const TelegramBot = require("node-telegram-bot-api");
const { get, update } = require("../../db");
const { callMobile } = require("../call");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

let command = "";

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    console.log("Chad Id", chatId);

    const keyboard = [
        ['👤 View Users'],
        ['➕ Add User'],
        ['🗑️ Delete User']
    ];
    const replyMarkup = {
        keyboard: keyboard,
        resize_keyboard: true,
    };

    bot.sendMessage(chatId, '⚡ Bot is running', { reply_markup: replyMarkup });
});

bot.onText(/👤 View Users/, (msg) => {
    const users = get("users");
    bot.sendMessage(
        msg.chat.id, 
        `List of users:\n`
        + users.map(user => `${user.email} _(${user.startDate} - ${user.endDate}) - ${user.scheduleId || "No schedule id"}_`).join("\n\n"),
        {
        parse_mode: "Markdown"
        });
});

bot.onText(/.*/, (msg) => {
    const currentCommand = command;
    command = "";

    if (currentCommand === "ADD_USER") {
        const input = msg.text.split(" ");
        if (input.length !== 5) {
            command = currentCommand;
            return bot.sendMessage(msg.chat.id, "Invalid User Input");
        }
        const [email, password, startDate, endDate, scheduleId] = input;
        const users = get("users");
        users.push({
            email,
            password,
            startDate,
            endDate,
            scheduleId,
        });
        update("users", users);
        bot.sendMessage(msg.chat.id, "User added");
    }
    else if (currentCommand === "DELETE_USER") {
        const [email, scheduleId] = msg.text.split(" ");
        if (typeof email === "undefined" || typeof scheduleId === "undefined") {
            command = currentCommand;
            bot.sendMessage(msg.chat.id, "Please enter email and schedule id");
            return;
        }
        const users = get("users");
        const newUsers = users.filter(user => !(user.email === email && user.scheduleId === scheduleId));
        update("users", newUsers);
        bot.sendMessage(msg.chat.id, "User deleted");
    }
});

bot.onText(/➕ Add User/, (msg) => {
    bot.sendMessage(msg.chat.id, "Send user info");
    command = "ADD_USER"
});

bot.onText(/🗑️ Delete User/, (msg) => {
    bot.sendMessage(msg.chat.id, "Enter email and schedule id of the user who you want to remove:");
    command = "DELETE_USER"
});

const sendAlert = (msg) => {
    console.log("Sending Alert", parseInt(process.env.CHANNEL_CHAT_ID), msg);
    callMobile();
    bot.sendMessage(parseInt(process.env.CHANNEL_CHAT_ID), msg, 
    { parse_mode: 'Markdown' });
}

exports.sendAlert = sendAlert;