import {dump_obj} from '../../utils';

var concoursConstructor = function(spec, my) {
  let self = {};
  let data = spec;
  my = my || {};

  let getTitle = function() {
    return data && data.title;
  }

  let getEndDate = function() {
    return data && data.endDate;
  }

  let getId = function() {
    return data && data.id;
  }

  let getImage = function() {
    return data && data.image;
  }

  let toString = function() {
    return dump_obj(data);
  }

  self.getTitle = getTitle;
  self.getId = getId;
  self.getImage = getImage;
  self.getEndDate = getEndDate;
  self.toString = toString;

  return self;
};

export default concoursConstructor;
