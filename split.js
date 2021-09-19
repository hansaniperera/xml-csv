const splitStream =require('csv-split-stream')
const fs = require("fs");

return ( splitStream.split(
    fs.createReadStream('./sample_3.csv'),
    {
      lineLimit: 4
    },
    (index) => fs.createWriteStream(`./output-${index}.csv`)
  )
  .then(csvSplitResponse => {
    console.log('csvSplitStream succeeded.', csvSplitResponse);
    // outputs: {
    //  "totalChunks": 350,
    //  "options": {
    //    "delimiter": "\n",
    //    "lineLimit": "10000"
    //  }
    // }
  }).catch(csvSplitError => {
    console.log('csvSplitStream failed!', csvSplitError);
  }));