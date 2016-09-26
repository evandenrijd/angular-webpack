import _ from 'underscore';

export default function userCtor(spec, my) {
  let self = {};
  spec = spec || {};
  my = my || {};

  //Public API
  self.getFirstName = getFirstName;
  self.getUserName = getUserName;

  return self;

  function getUserName() {
    return spec.username;
  }

  function getFirstName() {
    return spec.first_name;
  }
}
