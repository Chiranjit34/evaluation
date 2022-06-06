const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// aap.use("/user", userRouter);

app.post("/user/create", (req, res) => {
  fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
    const parsed = JSON.parse(data);
    parsed.users = [...parsed.users, req.body];
    fs.writeFile(
      "./db.json",
      JSON.stringify(parsed),
      { encoding: "utf-8" },
      () => {
        res.status(201).send("user created");
      }
    );
  });
});

app.post("/user/login", (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res
      .status(400)
      .send(`{status: "please provide username and password"}`);
  }
  fs.readFile("./db.json", "utf-8", (err, data) => {
    const parsed = JSON.parse(data);
    parsed.users = parsed.users.map((el) =>
      req.body.username == el.username && req.body.password == el.password
        ? { ...el, token: Math.random() }
        : el
    );
    fs.writeFile(
      "./db.json",
      JSON.stringify(parsed),
      { encoding: "utf-8" },
      () => {
        res.status(201).send("log in successful");
      }
    );
  });
});

app.post("/user/logout", (req, res) => {
  res.send("user logged out successful");
});

app.get("votes/party/:party", (req, res) => {
  const { party } = req.params;
  fs.writeFile("./db.json", { encoding: "utf-8" }, (err, data) => {
    const parsed = JSON.parse(data);
    parsed.users = parsed.users.filter((el) => el.party === party);
    res.send(JSON.stringify(parsed.users));
  });
});

app.get("votes/party/:party", (req, res) => {
  fs.writeFile("./db.json", { encoding: "utf-8" }, (err, data) => {
    const parsed = JSON.parse(data);
    parsed.users = parsed.users.filter((el) => el.role === voter);
    res.send(JSON.stringify(parsed.users));
  });
});

app.post("./db.json", (req, res) => {
  fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
    const parsed = JSON.parse(data);
    parsed.users = [...parsed.users, req.body];

    fs.writeFile("./db.json", JSON.stringify(parsed), "utf-8", () => {
      res.send("user added");
    });
  });
});

app.get("/db", (req, res) => {
  fs.readFile("./db.json", "utf-8", (err, data));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT);
