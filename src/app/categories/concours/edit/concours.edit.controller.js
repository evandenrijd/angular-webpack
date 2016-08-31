import angular from 'angular';
import '../../../common/models/concours.module';
import {dump_obj} from '../../../utils';

export default function ConcoursEditController($log, concoursList, $stateParams) {
  let self = {};
  let my = {}; //shared state (global deps);
  let concours;

  concoursList.getConcoursById($stateParams.id).then(result => {
    concours = result;
    self.fields = concours.getFormlyFields();
    self.model = concours.getFormlyModel();
  });

  let getConcours = function() {
    return concours;
  }

  let submit = function() {
    concours.setFormlyModel();
    concoursList.updateConcours(concours);
  }

  let cancel = function() {
    self.model = concours.getFormlyModel();
    return self;
  }

  self.submit = submit;
  self.cancel = cancel;
  self.getConcours = getConcours;

  return self;
};
