const { readFileSync, writeFileSync } = require("fs");
const path = require("path");

const CSS_ROOT = "/app";

const file = readFileSync(path.join(__dirname, CSS_ROOT, "globals.css"), {
	encoding: "utf-8",
});

const fixed = file.replaceAll(
	/(.*--.+:)[ ]*(.+[ ]+.+%[ ]+.+%);/g,
	"$1 hsl($2);"
);

writeFileSync(path.join(__dirname, CSS_ROOT, "globals-edit.css"), fixed);
