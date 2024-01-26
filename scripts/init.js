const fs = require('fs');
const filePath = "./db.dat";
const textToWrite = `
{
    "dates": [],
    "users": []
}
`;

if (!fs.existsSync(filePath)) {
  fs.open(filePath, 'w', (err, fileDescriptor) => {
    if (err) {
      console.error(`Error opening the file: ${err}`);
      return;
    }
  
    fs.write(fileDescriptor, textToWrite, (err) => {
      if (err) {
        console.error(`Error writing to the file: ${err}`);
      } else {
        console.log('Text has been written to the file.');
      }
      fs.close(fileDescriptor, (err) => {
        if (err) {
          console.error(`Error closing the file: ${err}`);
        }
      });
    });
  });
}
