var FCM = require("fcm-node");

exports.notiSender = function (registrationToken) {
  var serverKey = "o9rsKN6lACKMAyaEauCxzvfxd_GFpA43p-qB9As4MF8"; //put your server key here
  var fcm = new FCM(serverKey);

  var message = {
    //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: registrationToken,

    notification: {
      title: "Title of your push notification",
      body: "Body of your push notification",
    },

    data: {
      //you can send only notification or only data(or include both)
      my_key: "my value",
      my_another_key: "my another value",
    },
    topic: "Testing",
  };

  fcm.send(message, function (err, response) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
};
