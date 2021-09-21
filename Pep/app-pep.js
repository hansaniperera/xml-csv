const fs = require("fs");
const xmlcsv = require('./index-pep');
 
xmlcsv({
    source: fs.createReadStream("D:\\Ezcash\\FRS\\Accuity\\PEP_19044_GWLXML\\ENTITY.XML"),
    rootXMLElement: "entity",
        
        headerMap: [
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
            ["sdf_GovDesignation", "Government body", "string"],
            ["passportNum", "Identification number 1", "string"],
            ["sdf_AltPassport", "Identification number 2", "string", "AltPassport"],
            ["sdf_AltPassport2", "Identification number 3", "string", "AltPassport2"],
            ["sdf_NATIONAL NO", "Identification number 4", "string", "NATIONAL NO"],
            ["sdf_OtherInformation", "Party", "string", "OtherInformation"],
            ["title", "Designation", "string"],
            ["dob", "dob", "string"],
            ["address1", "Address 1", "string"],
            ["sdf_AltDOB", "", "string", "AltDOB"],
            ["address2", "", "string"],
            ["Iso2_AltAddress", "", "string", "AltAddress"],
    ]
}).pipe(fs.createWriteStream("./sample_pep.csv"));