import angular from 'angular';
import _ from 'underscore';
import {dump_obj} from '../../utils';
import '../meta.module';

(function(){

  let concoursConstructor = function(spec, my) {
    let self = {};
    let data = spec;
    my = my || {};
    let model = null; //copy of the data used in formly

    let layoutEdit = [
          {
            className: 'layout-row',
            fieldGroup: [
              { className: 'flex-33', key: 'code' },
              { className: 'flex', key: 'title' }
            ]
          },

          {
            className: 'layout-row',
            fieldGroup: [
              { className: 'flex', key: 'description',
                type: 'textarea',
                templateOptions: {
                  grow: false,
                  rows: 3
                },
              }
            ]
          },

          {
            className: 'layout-row',
            fieldGroup: [
              { className: 'flex', key: 'comments',
                type: 'textarea',
                templateOptions: {
                  grow: false,
                  rows: 2
                },
              }
            ]
          },

          {
            className: 'layout-row',
            fieldGroup: [
              { className: 'flex', key: 'question' },
              { className: 'flex', key: 'answer' },
            ]
          },

          {
            className: 'layout-row',
            fieldGroup: [
              { className: 'flex-20', key: 'winners' },
              { className: 'flex',
                key: 'startDate',
                validators: {
                  checkEndDate: {
                    expression: function(viewValue, modelValue, scope) {
                      let value = modelValue || viewValue;
                      if (value) value = value.setHours(0,0,0,0); //only compare date not time
                      if (value) {
                        let drawingDate = scope.model.drawingDate.setHours(0,0,0,0);
                        let endDate = scope.model.endDate.setHours(0,0,0,0);
                        if (endDate && drawingDate) endDate = endDate < drawingDate?drawingDate:endDate;
                        return value < endDate;
                      }
                      return true;
                    },
                    message: '"Should be less then end and/or drawing date."'
                  }
                }
              },
              { className: 'flex',
                key: 'endDate',
                validators: {
                  checkDrawingDate: {
                    expression: function(viewValue, modelValue, scope) {
                      let value = modelValue || viewValue;
                      if (value) value = value.setHours(0,0,0,0); //only compare date not time
                      if (scope.model.drawingDate) {
                        return value <= scope.model.drawingDate.setHours(0,0,0,0);
                      }
                      return true;
                    },
                    message: '"Should be less then or equal to drawing date."'
                  }
                }
              },
              { className: 'flex',
                key: 'drawingDate',
                validators: {
                  checkDrawingDate: {
                    expression: function(viewValue, modelValue, scope) {
                      let value = modelValue || viewValue;
                      if (value) value = value.setHours(0,0,0,0); //only compare date not time
                      if (scope.model.endDate) {
                        return value >= scope.model.endDate.setHours(0,0,0,0);
                      }
                      return true;
                    },
                    message: '"Should be bigger then or equal to end date."'
                  }
                },
              },
            ]
          },

          {
            className: 'layout-row',
            fieldGroup: [
              { className: 'flex-20', key: 'finalWinners' },
              { className: 'flex-20', key: 'finalLosers' },
              { className: 'flex-20', key: 'status' },
            ]
          },

          {
            className: 'layout-row',
            fieldGroup: [
              { className: 'flex', key: 'admins' },
              { className: 'flex', key: 'drawingAdmin' },
              { className: 'flex', key: 'creationAdmin' },
            ]
          },

          {
            className: 'layout-row',
            fieldGroup: [
              { className: 'flex-33', key: 'exclusionRule' },
              { className: 'flex', key: 'link' },
            ]
          },

          {
            className: 'layout-row layout-align-end-center',
            fieldGroup: [
              { className: 'flex-20', key: 'creationDate',
                templateOptions: {
                  disabled: true,
                },
              },
            ]
          },

        ];


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

    let getState = function() {
      return data;
    }

    let setState = function(state) {
      data = state;
    }

    let getFormlyFields = function() {
      return my.meta.getFormlyFields({name: 'concours',
                                      layout: layoutEdit});
    }

    let getFormlyModel = function() {
      model = my.meta.getFormlyModel({name: 'concours', 
                                      model: data});
      return model;
    }

    let setFormlyModel = function() {
      //FIXME: TODO
      data = model;
      return self;
    }

    self.getFormlyModel = getFormlyModel;
    self.getFormlyFields = getFormlyFields;
    self.getTitle = getTitle;
    self.getId = getId;
    self.getImage = getImage;
    self.getEndDate = getEndDate;
    self.toString = toString;
    self.getState = getState;
    self.setState = setState;

    return self;
  };

  let concoursListConstructor = function(spec, my) {
    let self = spec || {};
    my = my || {};
    let URLS = {
      FETCH: 'data/concours.json'
    };
    let concours;

    function extract(result) {
      console.debug('result: ', result);
      return result.data.map(spec => {
        return concoursConstructor(spec, my);
      });
    }

    function cacheConcours(result) {
      concours = extract(result);
      console.debug('concours: ', concours);
      return concours;
    }

    function findConcours(concoursId) {
      return _.find(concours, function (aConcours) {
        return aConcours.getId() === parseInt(concoursId, 10);
      })
    }

    self.loadAllConcours = function () {
      return (concours) ? my.$q.when(concours) :
        my.$http.get(URLS.FETCH).then(result => {
          return cacheConcours(result);
        });
    };

    self.getConcoursById = function (concoursId) {
      var deferred = my.$q.defer();
      if (concours) {
        deferred.resolve(findConcours(concoursId))
      } else {
        self.loadAllConcours().then(function () {
          deferred.resolve(findConcours(concoursId))
        })
      }
      return deferred.promise;
    };

    self.createConcours = function (aConcours) {
      aConcours.setId(concours.length);
      concours.push(aConcours);
    };

    self.updateConcours = function (aConcours) {
      var index = _.findIndex(concours, function (b) {
        return b.getId() === aConcours.getId();
      });
      concours[index] = aConcours;
    };

    self.deleteConcours = function (aConcours) {
      _.remove(concours, function (b) {
        return b.getId() === aConcours.getId();
      });
    };

    return self;
  }

  angular.module('gecopa.models.concours', [
    'gecopa.common.appState', //Use for translation
    'gecopa.models.meta'
  ])
    .provider('concoursList', function concoursListProvider() {
      this.$get = function concoursListConstructorFactory($http, $q, $translate, meta) {
        return concoursListConstructor({}, {$http, $q, $translate, meta});
      }
    });

})();
