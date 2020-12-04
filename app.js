const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public")); // Path of the static files
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us7.api.mailchimp.com/3.0/lists/2152b3f87b"; //-------- Hide this code on gitHub

  const options = {
    method: "POST",
    auth: "rishi:91a9423ff83d0eb0af01e5c6a90a91eb-us7", //------- API key, hide this in gitHub
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

//Dynamic port declaration to work for Heroku and local system.
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});

//api Key
//91a9423ff83d0eb0af01e5c6a90a91eb-us7

// list ID
// 2152b3f87b
