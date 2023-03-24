const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const liveReload = require("livereload");
const connectLiveReload = require("connect-livereload");

const { webDir, vapidKeysFile } = require("../config");
const { saveSubscription, notifySubscribers } = require("./backend-service");
const { getLatestVacancies, getVapidPublicKey } = require("./backend-reader");

console.log("from the server js");

process.on("SIGUSR2", async () => {
  console.log("notifying subscribers...");
  await notifySubscribers();
  console.log("subscribers has been notified!");
});

const SERVER_PORT = 8080;

console.log({ webDir });
const liveReloadServer = liveReload.createServer();
liveReloadServer.watch(webDir);
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

const server = express();
server.use(connectLiveReload());
server.use(express.static(webDir));
server.use(bodyParser.json());

server.get("/health", (res) => res.type("json").send({ health: "ok" }));

server.post("/save-subscription", async (req, res) => {
  const subscription = req.body;
  saveSubscription(subscription);

  return res.type("json").send({ success: true });
});

server.get("/latest-vacancies", async (req, res) => {
  return res.type("json").send(getLatestVacancies());
});

server.get("/vapid-key", async (req, res) => {
  return res.type("json").send(getVapidPublicKey());
});

server.listen(SERVER_PORT, () =>
  console.log(`The server is listening on port ${SERVER_PORT} ...`)
);
