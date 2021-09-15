const fs = require("fs");
const xmlcsv = require('./src/index');
 
xmlcsv({
    source: fs.createReadStream("./sample.xml"),
    rootXMLElement: "Route",
    headerMap: [
        ["Iso2-name1", "ISO2-name1", "string", "name1"],
        ["Iso2-name2", "ISO2-name2", "string", "name2"],
        ["Iso2-name3", "ISO2-name3", "string", "name3"],
        ["ZipFrom", "ZIP", "string"],
        ["Agent", "AgentCode", "string"],
        ["Ruta", "Route", "string"],
        ["Color", "Color", "string"],
        ["AvailableService", "AvailableService", "string"],
        ["Airport", "GatewayAirport", "string"]
    ]
}).pipe(fs.createWriteStream("./sample_3.csv"));