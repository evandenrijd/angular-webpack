import angular from 'angular';
import concoursConstructor from '../../../common/models/concours.constructor';
import {dump_obj} from '../../../utils';

let concoursCreateControllerConstructor = function(spec, my) {
  let self = {};
  my = my || {}; //shared state (global deps);
  let concours = concoursConstructor(undefined, my);
  //FIXME set creation admin, from appState

  const excludeKeys = ['id', 'image', 'imageName', 'imageMime'];
  self.fields = concours.getFormlyFields({exclude: excludeKeys});
  self.model = concours.getFormlyModel({exclude: excludeKeys});
  self.image = concours.getImageObject();

  let getConcours = function() {
    return concours;
  }

  let submit = function() {
    concours.setFormlyModel();
    concours.setImageObject(self.image);
    // alert(concours.toString());
    my.concoursList.createConcours(concours);
  }

  let cancel = function() {
    self.model = concours.getFormlyModel({exclude: excludeKeys});
    self.image = concours.getImageObject();
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
