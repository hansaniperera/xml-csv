const fs = require("fs");
const xmlcsv = require('./src/index');
 
xmlcsv({
    source: fs.createReadStream("./sample.xml"),
    rootXMLElement: "Route",
    headerMap: [
        ["Iso2", "ISO2", "string", "name1"],
        ["Iso2", "ISO2", "string", "name2"],
        ["ZipFrom", "ZIP", "string"],
        ["Agent", "AgentCode", "string"],
        ["Ruta", "Route", "string"],
        ["Color", "Color", "string"],
        ["AvailableService", "AvailableService", "string"],
        ["Airport", "GatewayAirport", "string"]
    ]
}).pipe(fs.createWriteStream("./sample_1.csv"));