const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const liveReload = require("livereload");
const connectLiveReload = require("connect-livereload");

const { saveSubscription, notifySubscribers } = require("./backend-service");
const { getLatestVacancies } = require("./backend-reader");

console.log("from the server js");

process.on("SIGUSR2", async () => {
  console.log("notifying subscribers...");
  await notifySubscribers();
  console.log("subscribers has been notified!");
});

const SERVER_PORT = 8080;

const liveReloadServer = liveReload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

const server = express();
server.use(connectLiveReload());
server.use(express.static(path.join(__dirname, "public")));
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

server.listen(SERVER_PORT, () =>
  console.log(`The server is listening on port ${SERVER_PORT} ...`)
);
