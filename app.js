const fs = require("fs");
const xmlcsv = require('./src/index');
 
xmlcsv({
    source: fs.createReadStream("./test.xml"),
    rootXMLElement: "entity",
        
        headerMap: [
            // ["version", "Version", "string"],
            ["name", "Name 1", "string"],
            ["listCode", "Sanction list file name", "string"],
            ["passportNum", "Identification number 1", "string"],
            ["sdf_AltPassport2", "Identification number 2", "string", "AltPassport2"],
            ["sdf_NATIONAL NO", "Identification number 3", "string", "NATIONAL NO"],
            
            ["sdf_Aliases", "Name 2", "string"],
            ["sdf_Aliases", "Name 3", "string"],
            ["sdf_Aliases", "Name 4", "string"],
            ["sdf_Aliases", "Name 5", "string"],
            ["sdf_Aliases", "Name 6", "string"],
            ["sdf_Aliases", "Name 7", "string"],
            ["sdf_Aliases", "Name 8", "string"],
            ["sdf_Aliases", "Name 9", "string"],
            ["sdf_Aliases", "Name 10", "string"],
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