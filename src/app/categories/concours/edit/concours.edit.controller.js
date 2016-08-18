import '../../../common/models/concours.service';
import {dump_obj} from '../../../utils';

export default function ConcoursEditController($log, concoursService, $stateParams) {
  let self = {};
  let my = {}; //shared state (global deps);
  let concours = null;

  concoursService.getConcoursById($stateParams.id).then(result => {
    concours = result;
  });

  let getConcours = function() {
    return concours;
  }

  self.getConcours = getConcours;

  return self;
};
