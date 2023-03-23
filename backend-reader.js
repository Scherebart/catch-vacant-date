const path = require("path");
const fs = require("fs");

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
  const filenames = fs.readdirSync(path.join(__dirname, "updates"));
  const latestFilename = findMax(filenames);
  let latestVacancies = [];
  if (latestFilename) {
    const fileContentsRaw = fs.readFileSync(
      path.join(__dirname, "updates", latestFilename),
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

module.exports = { getLatestVacancies };
