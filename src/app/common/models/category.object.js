import {dump_obj} from '../../utils';

let categoryConstructor = function(spec) {
  let self = spec || {};

  let displayName = function() {
    return self.name;
  };

  let getName = function() {
    return self.name;
  }

  //getState give the state string used in ng-ui-router
  let getState = function() {
    return 'gecopa.admin.' + getName();
  }

  let getIcon = function() {
    return self.icon;
  }

  let getId = function() {
    return self.id;
  }

  let toString = function(){
    return dump_obj(self);
  }

  self.displayName = displayName;
  self.getName = getName;
  self.getState = getState;
  self.getIcon = getIcon;
  self.getId = getId;
  self.toString = toString;

  return self;
};

export default categoryConstructor;
