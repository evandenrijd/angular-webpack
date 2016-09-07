export default function concoursListController($log, concoursList, meta, $state) {
  let self = {};
  let my = {}; //shared state (global deps);
  let concours = [];

  concoursList.reset({}).then(result => {
    concours = result;
  });

  let getAttributeLabelId = function(attr) {
    return meta.getAttributeLabelId({name: 'concours', attr: attr});
  }

  let getConcours = function() {
    return concours;
  }

  let remove = function(where) {
    concoursList.deleteConcours(where.id);
  }

  //public API
  self.getConcours = getConcours;
  self.getAttributeLabelId = getAttributeLabelId;
  self.remove = remove;

  return self;
};
