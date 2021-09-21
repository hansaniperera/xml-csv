"use strict";

const _ = require("lodash");
const sax = require("../sax");
const dottie = require("dottie");
const stream = require("stream");
const endOfLine = require("os").EOL;
const util = require("util");
const { doesNotMatch } = require("assert");
const { version } = require("os");
const { count } = require("console");

let individualId;
let versionNumber;
let lineNo;

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
		if (t.name === input.rootXMLElement[0]) {
			accepting = true;
			if (t.attributes.hasOwnProperty("id")) {
				individualId = t.attributes["id"]
			}
				pathParts = [];
				// currentObj = {};		
		} else if (t.name === input.rootXMLElement[1]) {
			accepting = true;
			pathParts.push(t.name)
			pathPartsString = pathParts.join(".");
			currentObj = {};
		} else {
			if (accepting) {
				pathParts.push(t.attributes.name ? t.name + "_" + t.attributes.name : t.name);
				pathPartsString = pathParts.join(".");
			}
		}
	});

	saxStream.on("text", function (text) {
		if (accepting) {
			// console.log(text)
			if (text.trim() !== "\n" && text.trim() !== "") {
				dottie.set(currentObj, pathPartsString, text);
				// console.log(currentObj)
			}
		}
	});

	saxStream.on("closetag", (tagName) => {
		if (tagName === input.rootXMLElement[0]) {
			lineNo = count;
			console.log(count)
			output.push(writeRecordToStream(currentObj, input.headerMap, comma));
			count++;
			accepting = false;
			// currentObj = {};
		} else if (tagName === input.rootXMLElement[1]) {
			versionNumber = currentObj["version"]
			// console.log(currentObj)
			// console.log(versionNumber)
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
	var nameList = [];
	var dob = [];
	var addressList = [];
	var listCode;
	var identificationNumList = [];
	 
	for (let [idx, header] of headerMap.entries()) {
		if (header[0] === "name" && record[header[0]] != undefined) {
			nameList.push(record[header[0]].replace(/,/g, " "));
		} else if (header[0] === "sdf_Aliases" && record[header[0]] != undefined) {
			if (record[header[0]].indexOf(';') != -1) {
				nameList.push(...record[header[0]].replace(/,/g, " ").split(';'));
			} else {
				nameList.push(record[header[0]].replace(/,/g, " "));
			}
		} else if (header[0] === "dob" && record[header[0]] != undefined) {
				dob.push(record[header[0]].replace(/,/g, " "));
		} else if (header[0] === "sdf_AltDOB" && record[header[0]] != undefined) {
			if (record[header[0]].indexOf(';') != -1) {
				dob.push(...record[header[0]].replace(/,/g, " ").split(';'));
			} else {
				dob.push(record[header[0]].replace(/,/g, " "));
			}		
		} else if ((header[0] === "address1" || header[0] === "address2" ||
			header[0] === "Iso2_AltAddress") && record[header[0]] != undefined ) {
			if (record[header[0]] != "" || record[header[0]] != null) {
				addressList.push(record[header[0]].replace(/,/g, " "));
			}
		} else if (header[0] === "listCode" && record[header[0]] != undefined) {
			listCode = record[header[0]].replace(/,/g, " ");

		} else if ((header[0] === "passportNum" || header[0] === "sdf_AltPassport2" ||
			header[0] === "sdf_AltPassport" || header[0] === "sdf_NATIONAL NO") && record[header[0]] != undefined) {
			identificationNumList.push(record[header[0]].replace(/,/g, " "));
		} 
		let row = '';
		// console.log(dob)
		// console.log(nameList)
		if (idx === headerMap.length - 1) {
			if (lineNo == 0) {
				row += (versionNumber ? versionNumber: '') + ',';
			} else {
				row += ',';
			}
			row += (listCode ? listCode: '') + ',';
			row += (individualId ? individualId: '') + ',';
			for (let i = 0; i <=9; i++) {
				row += (nameList[i] ? nameList[i] :'') + ',';
				// row += ',';
			}			
			for (let i = 0; i <=3; i++) {
				row += (identificationNumList[i] ? identificationNumList[i] :'') + ',';
				// row += ',';
			}
			row += (dob[0] ? dob[0]: '') + ',';
			row += (addressList[0] ? addressList[0] : '') + ',';

			recordString += writeField(row, endOfLine);
			
			row = ''
			nameList = []
			dob = []
			listCode = undefined
			addressList = []
			identificationNumList = []
			individualId = undefined
			// versionNumber = undefined
		}
	}

	return recordString;
}

function writeField(field, separator) {
	if (!field) return separator;

	const quote = "";

	return `${quote}${field}${quote}${separator}`;
}