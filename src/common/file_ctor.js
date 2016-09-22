export default fileCtor;

function fileCtor(spec) {
  const fs = require('fs');

  let self = {};
  self.filename = spec.filename;
  self.enc = spec.enc;

  self.readJSON = readJSON;
  self.writeJSON = writeJSON;
  return self;

  function readFile(){
    return new Promise((resolve, reject) => {
      fs.readFile(self.filename, self.enc, function (err, res){
        if (err) reject(err);
        else resolve(res);
      });
    });
  }

  function readJSON() {
    return new Promise((resolve, reject) => {
      readFile(self.filename, self.enc).then(data => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err + ' on \'' + self.filename + '\'');
        }
      }).catch(err => {
        reject(err);
      });
    });
  }

  function writeJSON(data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(self.filename,
                   JSON.stringify(data, null, '  '),
                   self.enc,
                   (err) => {
                     if (err) reject(err);
                     resolve(data);
                   });
    });
  }
}
