import angular from 'angular';
import '../../../common/models/concours.module';
import {dump_obj} from '../../../utils';

let concoursEditControllerConstructor = function(spec, my) {
  let self = {};
  my = my || {}; //shared state (global deps);
  let concours;

  let excludeKeys = ['id'];

  my.concoursList.getConcoursById(my.$stateParams.id).then(result => {
    concours = result;
    self.fields = concours.getFormlyFields({exclude: excludeKeys});
    self.model = concours.getFormlyModel({exclude: excludeKeys});
  });

  let getConcours = function() {
    return concours;
  }

  let submit = function() {
    concours.setFormlyModel();
    my.concoursList.updateConcours(concours);
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

export default function concoursEditController($log, concoursList, $stateParams) {
  return concoursEditControllerConstructor({}, {$log, concoursList, $stateParams});
};
