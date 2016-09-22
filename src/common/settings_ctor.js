export default settingsCtor;
import _ from 'underscore';

function settingsCtor(spec, my) {
  let self = {};
  spec = spec || my.meta.init({name: 'settings'});
  my = _.extend({ //Default ES6 Promise style
    promise: function (executor) {
      return new Promise(executor);
    }
  }, my);

  self.get = get;
  self.check = check;
  self.hasUserAdminRole = hasUserAdminRole;

  return self;

  function get() {
    return spec;
  }

  function _splitAdmins() {
    return spec['admins'].split(':').map((admin) => {
      return admin.toUpperCase();
    });
  }

  function check() {
    return my.promise((resolve, reject) => {
      if (!!/^[A-Z]+(:?:[A-Z]+)*$/.test(spec.admins)) {
        let admins = _splitAdmins();
        if (!!admins.length) {
          console.debug('check OK for spec:', spec);
          resolve(self);
        } else {
          console.debug('check NOK for spec:', spec);
          reject('ERR_NEED_AT_LEAST_ONE_ADMIN');
        }
      } else {
        console.debug('check RE NOK for spec:', spec);
        reject('ERR_NO_COLON_SEPARATED_LIST');
      }
    });
  }

  function hasUserAdminRole(user) {
    return !!_splitAdmins().filter((admin) => {
      return user.username.toUpperCase() === admin;
    }).length;
  }
}
