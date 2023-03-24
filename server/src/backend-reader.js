const path = require("path");
const fs = require("fs");

const { updatesDir ,vapidKeysFile} = require("../config");

function findMax(array) {
  if (array.length === 0) {
    return null;
  }

  let max = array[0];
  for (const e of array.slice(1)) {
    if (e > max) {
      max = e;
    }
  }

  return max;
}

function getLatestVacancies() {
  const filenames = fs.readdirSync(updatesDir);
  const latestFilename = findMax(filenames);
  let latestVacancies = [];
  if (latestFilename) {
    const fileContentsRaw = fs.readFileSync(
      path.join(updatesDir, latestFilename),
      {
        encoding: "utf-8",
      }
    );
    latestVacancies = fileContentsRaw
      .split(/\s+/)
      .filter((str) => str.length > 0);
  }
  return {
    checkDate: latestFilename,
    latestVacancies,
  };
}

function getVapidPublicKey() {
  const { publicKey } = JSON.parse(
    fs.readFileSync(vapidKeysFile, { encoding: "utf8" })
  );

  return { publicKey };
}

module.exports = { getLatestVacancies , getVapidPublicKey};
