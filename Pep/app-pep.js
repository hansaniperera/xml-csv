const fs = require("fs");
const xmlcsv = require('./src/index');
 
xmlcsv({
    source: fs.createReadStream("./test.xml"),
    rootXMLElement: "entity",
        
        headerMap: [
            // ["version", "Version", "string"],
            ["listCode", "Sanction list file name", "string"],
            ["entity_id", "Id", "string", "id"],
            ["name", "Name 1", "string"],
            ["sdf_Aliases", "Name 2", "string"],
            ["", "Name 3", "string"],
            ["", "Name 4", "string"],
            ["", "Name 5", "string"],
            ["", "Name 6", "string"],
            ["", "Name 7", "string"],
            ["", "Name 8", "string"],
            ["", "Name 9", "string"],
            ["", "Name 10", "string"],

            ["passportNum", "Identification number 1", "string"],
            ["sdf_AltPassport", "Identification number 2", "string", "AltPassport"],
            ["sdf_AltPassport2", "Identification number 3", "string", "AltPassport2"],
            ["sdf_NATIONAL NO", "Identification number 4", "string", "NATIONAL NO"],
            
            
            // ["listId", "listId", "string"],            
            // ["entityType", "entityType", "string"],
            
            // ["createdDate", "createdDate", "string"],
            // ["lastUpdateDate", "lastUpdateDate", "string"],
            ["dob", "dob", "string"],
            ["address1", "Address 1", "string"],
            ["address2", "", "string"],
            ["Iso2_AltAddress", "", "string", "AltAddress"],
    ]
}).pipe(fs.createWriteStream("./sample_3.csv"));