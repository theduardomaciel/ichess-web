const { readFileSync, writeFileSync } = require("fs");
const path = require("path");

const CSS_ROOT = "/app";

const file = readFileSync(path.join(__dirname, CSS_ROOT, "globals-edit.css"), {
	encoding: "utf-8",
});

const fixed = file.replaceAll(/(.*--.+:).*hsl\((.+)\);/g, "$1 $2;");

writeFileSync(path.join(__dirname, CSS_ROOT, "globals.css"), fixed);
