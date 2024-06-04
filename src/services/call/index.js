exports.callMobile = function () {
    const accountSid = process.env.T_SID;
    const authToken = process.env.T_SECRET;
    const client = require("twilio")(accountSid, authToken);

    client.calls.create({
      url: "http://demo.twilio.com/docs/voice.xml",
      to: "+971502022535",
      from: "+17076750767",
    })
    .then(call => console.log(call.sid));
}