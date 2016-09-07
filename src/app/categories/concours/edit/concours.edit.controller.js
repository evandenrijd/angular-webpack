import angular from 'angular';
import '../../../common/models/concours.module';
import {dump_obj} from '../../../utils';

let concoursEditControllerConstructor = function(spec, my) {
  let self = {};
  my = my || {}; //shared state (global deps);
  let concours;

  const excludeKeys = ['id', 'image', 'imageName', 'imageMime'];

  my.concoursList.getConcoursById(my.$stateParams.id).then(result => {
    concours = result;
    self.fields = concours.getFormlyFields({exclude: excludeKeys});
    self.model = concours.getFormlyModel({exclude: excludeKeys});
    self.image = concours.getImageObject();
  });

  let getConcours = function() {
    return concours;
  }

  let submit = function() {
    concours.setFormlyModel();
    concours.setImageObject(self.image);
    // alert(concours.toString());
    my.concoursList.updateConcours(concours);
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

export default function ConcoursEditController($log, concoursList, $stateParams) {
  return concoursEditControllerConstructor({}, {$log, concoursList, $stateParams});
};
