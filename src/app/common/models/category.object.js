import {dump_obj} from '../../utils';

var categoryConstructor = function(spec, my) {
  let self = {};
  let data = spec;
  my = my || {};

  // shared.$log.debug('ctor called: ', spec);

  let displayName = function() {
    return data && data.name;
  };

  let getName = function() {
    return data && data.name;
  }

  let getIcon = function() {
    return data && data.icon;
  }

  let getId = function() {
    return data && data.id;
  }

  let toString = function(){
    return dump_obj(data);
  }

  self.displayName = displayName;
  self.getName = getName;
  self.getIcon = getIcon;
  self.getId = getId;
  self.toString = toString;

  return self;
};

export default categoryConstructor;
