"use strict";

const _ = require("lodash");
const sax = require("sax");
const dottie = require("dottie");
const stream = require("stream");
const endOfLine = require("os").EOL;
const util = require("util");

module.exports = function (input) {
	const comma = input.delimiter || ",";
	const saxStream = sax.createStream(true);
	const output = new stream.PassThrough();

	saxStream.on("error", err => {
		throw err;
	});

	let count = 0;
	let accepting = false;
	let currentObj;
	let pathParts = [];
	let pathPartsString;

	output.push(writeHeadersToStream(input.headerMap, comma));

	saxStream.on("opentag", function (t) {
		// console.log({...t})
		// console.log(input.rootXMLElement[0])
		if (t.name === input.rootXMLElement) {
			accepting = true;
			pathParts = [];
			currentObj = {};
		} else {
			if (accepting) {
				console.log("ttt")
				console.log({...t})
				// pathParts.push(t.attributes.name ? t.name + "-" + t.attributes.name : t.name);
				// pathParts.push("entities")
				// pathParts.push("entity")
				pathParts.push(t.name);
				pathPartsString = pathParts.join(".");
				console.log(pathPartsString)
				console.log("vvv")
			}
		}
	});

	saxStream.on("text", function (text) {
		console.log("ddd")
		console.log(text);
		if (accepting) {
			if (text.trim() !== "\n" && text.trim() !== "") {
				dottie.set(currentObj, pathPartsString, text);
				// console.log(pathPartsString);
				console.log({...currentObj})
			}
		}
	});

	saxStream.on("closetag", (tagName) => {
		console.log(tagName);
		if (tagName === input.rootXMLElement) {
			console.log("jjj")
			console.log({...currentObj})
			output.push(writeRecordToStream(currentObj, input.headerMap, comma));
			console.log("jjj")
			count++;
			accepting = false;
			currentObj = {};
		} else {
			pathParts.pop();
		}
	});

	saxStream.on("end", () => {
		output.push(null);
		const msg = `Finished writing records: ${count}`
		console.log(msg);

		return msg;
	});

	input.source.pipe(saxStream);

	return output;
};

function writeHeadersToStream(headerMap, comma) {
	let headerString = "";
	for (let [idx, header] of headerMap.entries()) {
		const separator = idx === headerMap.length - 1 ? endOfLine : comma;
		headerString += header[1] + separator;
	}
	return headerString;
}

function writeRecordToStream(record, headerMap, comma) {
	let recordString = "";
	// console.log({...record})
	for (let [idx, header] of headerMap.entries()) {
		// const field = _.isObject(record[header[3]]) ?
		// 	record[header[3]][header[0]] :
		// 	record[header[0]];
		const field = record[header[0]];
		const separator = idx === headerMap.length - 1 ? endOfLine : comma;
        // console.log("sss " + field);
		// console.log(header[3])
		// console.log(header[0])
		// console.log(idx + " | " + headerMap.length)
		recordString += writeField(field, separator);
	}

	return recordString;
}

function writeField(field, separator) {
	if (!field) return separator;

	const quote = "";

	return `${quote}${field}${quote}${separator}`;
}