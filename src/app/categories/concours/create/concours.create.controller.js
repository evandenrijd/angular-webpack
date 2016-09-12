import angular from 'angular';
import concoursConstructor from '../../../common/models/concours.constructor';
import {dump_obj} from '../../../utils';

let concoursCreateControllerConstructor = function(spec, my) {
  let self = {};
  my = my || {}; //shared state (global deps);
  let concours = concoursConstructor(undefined, my);
  //FIXME set creation admin, from appState

  let excludeKeys = ['id'];

  self.fields = concours.getFormlyFields({exclude: excludeKeys});
  self.model = concours.getFormlyModel({exclude: excludeKeys});

  let getConcours = function() {
    return concours;
  }

  let submit = function() {
    concours.setFormlyModel();
    my.concoursList.createConcours(concours);
  }

  let cancel = function() {
    self.model = concours.getFormlyModel({exclude: excludeKeys});
    return self;
  }

  self.submit = submit;
  self.cancel = cancel;
  self.getConcours = getConcours;

  return self;
}

export default function concoursCreateController(meta, $translate, concoursList) {
  return concoursCreateControllerConstructor({}, {meta, $translate, concoursList});
};
