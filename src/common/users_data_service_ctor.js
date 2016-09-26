import fileCtor from './file_ctor.plain';
import _ from 'underscore';

export default usersCtor;

function usersCtor(spec, my) {
  let self = {};
  my = my || {};

  let file = fileCtor({filename: 'data/users.json',
                       enc: 'utf8'});

  //Public API
  self.authenticate = authenticate;
  self.getWoPassword = getWoPassword;

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

  function authenticate(user) {
    return new Promise((resolve, reject) => {
      load().then(users => {
        resolve(_.find(users, (u) => {
          return u.username === user.username &&
            u.password === user.password;
        }));
      }).catch(err => {
        reject(err);
      });
    });
  }

  function getWoPassword(user) {
    return new Promise((resolve, reject) => {
      get(user).then(result => {
        delete result.password;
        resolve(result);
      }).catch(err => {
        reject(err);
      });
    });
  }

  function get(user) {
    return new Promise((resolve, reject) => {
      load().then(users => {
        resolve(_.find(users, (u) => {
          return u.username === user.username;
        }));
      }).catch(err => {
        reject(err);
      });
    });
  }
}
