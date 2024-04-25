const fs = require('fs');
const yaml = require('yaml-js');
const $RefParser = require('@apidevtools/json-schema-ref-parser');

// Get the URL and output file name from command-line arguments
const url = process.argv[2];
const outputFileName = process.argv[3];

if (!url || !outputFileName) {
  console.error('Please provide the URL and output file name as parameters when running the script.');
  process.exit(1);
}

(async () => {
  try {
    const dereferencedSchema = await $RefParser.dereference(url);
    // Convert the flattened schema to JSON
    const flattenedSchemaJSON = JSON.stringify(dereferencedSchema, null, 2);

    // Write the flattened schema to a JSON file
    fs.writeFile(outputFileName, flattenedSchemaJSON, (err) => {
      if (err) {
        console.error('Error writing the flattened JSON file:', err);
        return;
      }
      console.log('Flattened JSON file saved successfully!');
    });
  } catch (error) {
    console.error('Error:', error);
  }
})();