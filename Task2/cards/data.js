const fs = require("fs");

function readFromFile() {
	const filePath = "./Task2/cards/assets/myJson.json";

	fs.readFile(filePath, "utf-8", (err, jsonString) => {
		if (err) {
			console.error("Error reading file:", err);
			return;
		}
		console.log("File content:", jsonString);
	});
}
function writeToFile(filePath, data) {
	// Convert data to a JSON string
	const jsonString = JSON.stringify(data);

	fs.writeFile(filePath, jsonString, "utf-8", (err) => {
		if (err) {
			console.error("Error writing file:", err);
			return;
		}
		console.log("File successfully written to", filePath);
	});
}
module.exports = { readFromFile, writeToFile };
