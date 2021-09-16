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
			if (t.attributes.name === "id") {
				pathParts.push(t.name + "-" + t.attributes.name);
				pathPartsString = pathParts.join(".");
			} else {
				pathParts = [];
				currentObj = {};
			}			
		} else {
			if (accepting) {
				// console.log("ttt")
				// console.log({...t})
				// pathParts.push(t.attributes.name ? t.name + "-" + t.attributes.name : t.name);
				// pathParts.push("entities")
				// pathParts.push("entity")
				pathParts.push(t.attributes.name ? t.name + "_" + t.attributes.name : t.name);
				pathPartsString = pathParts.join(".");
				// console.log(pathPartsString)
				// console.log("vvv")
			}
		}
	});

	saxStream.on("text", function (text) {
		// console.log("ddd")
		// console.log(text);
		if (accepting) {
			if (text.trim() !== "\n" && text.trim() !== "") {
				dottie.set(currentObj, pathPartsString, text);
				// console.log(pathPartsString);
				// console.log({...currentObj})
			}
		}
	});

	saxStream.on("closetag", (tagName) => {
		// console.log(tagName);
		if (tagName === input.rootXMLElement) {
			// console.log("jjj")
			// console.log({...currentObj})
			output.push(writeRecordToStream(currentObj, input.headerMap, comma));
			// console.log("jjj")
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
	var nameList = [];
	var dob = [];
	var addressList = [];
	var listCode;
	var identificationNumList = [];
	var id;
	// console.log("version " + version);
	for (let [idx, header] of headerMap.entries()) {
		if (header[0] === "name" && record[header[0]] != undefined) {
			nameList.push(record[header[0]].replace(/,/g, " "));
			console.log(record[header[0]])
		} else if (header[0] === "sdf_Aliases" && record[header[0]] != undefined) {
			if (record[header[0]].indexOf(';') != -1) {
				nameList.push(record[header[0]].replace(/,/g, " ").split(';'));
			} else {
				nameList.push(record[header[0]].replace(/,/g, " "));
			}
			// console.log(nameList)
		} else if (header[0] === "dob" && record[header[0]] != undefined) {
				dob.push(record[header[0]]);
		} else if (header[0] === "sdf_AltDOB" && record[header[0]] != undefined) {
			if (record[header[0]].indexOf(';') != -1) {
				dob.push(record[header[0]].split(';'));
			} else {
				dob.push(record[header[0]]);
			}		
		} else if ((header[0] === "address1" || header[0] === "address2" ||
			header[0] === "Iso2_AltAddress") && record[header[0]] != undefined ) {
			if (record[header[0]] != "" || record[header[0]] != null) {
				addressList.push(record[header[0]].replace(/,/g, " "));
				console.log(addressList)
			}
		} else if (header[0] === "listCode" && record[header[0]] != undefined) {
			listCode = record[header[0]];

		} else if ((header[0] === "passportNum" || header[0] === "sdf_AltPassport2" ||
			header[0] === "sdf_AltPassport" || header[0] === "sdf_NATIONAL NO") && record[header[0]] != undefined) {
			// console.log("sss " + record[header[0]])
			identificationNumList.push(record[header[0]].replace(/,/g, " "));
			// console.log("qqq " + identificationNumList.length)
			console.log(identificationNumList)
		} else if (header[0] === "entity_id" && record[header[0]] != undefined) {
			id = record[header[0]];
		}
		let row = '';
		if (idx === headerMap.length - 1) {
			
			row += (listCode ? listCode: '') + ',';
			row += (id ? id: '') + ',';
			for (let i = 0; i <=9; i++) {
				row += nameList[i] ? nameList[i] :'';
				row += ',';
			}			
			for (let i = 0; i <=3; i++) {
				row += identificationNumList[i] ? identificationNumList[i] :'';
				row += ',';
				// console.log("row " + identificationNumList[i])
				// console.log("ddd " + row)
			}
			row += (dob ? dob: '') + ',';
			row += (addressList[0] ? addressList[0] : '') + ',';

			recordString += writeField(row, endOfLine);
			
			row = ''
			nameList = []
			dob = undefined
			listCode = undefined
			id = undefined
			addressList = []
			identificationNumList = []
		}
	}

	return recordString;
}

function writeField(field, separator) {
	if (!field) return separator;

	const quote = "";

	return `${quote}${field}${quote}${separator}`;
}