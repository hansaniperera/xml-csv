const splitStream =require('csv-split-stream')
const fs = require("fs");

return ( splitStream.split(
    fs.createReadStream('./Pep/sample_pep.csv'),
    {
      lineLimit: 300000
    },
    (index) => fs.createWriteStream(`./pep-${index}.csv`)
  )
  .then(csvSplitResponse => {
    console.log('csvSplitStream succeeded.', csvSplitResponse);
    
  }).catch(csvSplitError => {
    console.log('csvSplitStream failed!', csvSplitError);
  }));