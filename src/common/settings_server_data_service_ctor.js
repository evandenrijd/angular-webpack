import fileCtor from './/file_ctor.plain';
import settingsCtor from './settings_ctor.plain';

export default settingsServerDataServiceCtor;

function settingsServerDataServiceCtor(spec) {
  let self = {};
  let file = fileCtor({filename: 'data/settings.json',
                       enc: 'utf8'});
  console.log('loading: ', file.filename);
  load().then(data => { //already catching load errors during startup
    settingsCtor(data).check().catch(err => {
      console.error(err);
      process.exit(1);
    });
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });

  //Public API
  self.load = load;
  self.store = store;
  self.hasUserAdminRole = hasUserAdminRole;
  return self;

  function load() {
    return new Promise((resolve, reject) => {
      file.readJSON().then(data => {
        resolve(data);
      }).catch(err => {
        reject(err);
      });
    });
  }

  function store(data) {
    return new Promise((resolve, reject) => {
      settingsCtor(data).check().then(dummy => {
        file.writeJSON(data).then(dummy => {
          resolve(self);
        });
      }).catch(err => {
        reject(err);
      });
    });
  }

  function hasUserAdminRole(user) {
    return new Promise((resolve, reject) => {
      load().then(data => {
        resolve(settingsCtor(data).hasUserAdminRole(user));
      }).catch(err => {
        reject(err);
      });
    });
    return
  }

};
