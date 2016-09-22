export default metaDataFactoryCtor;

function metaDataFactoryCtor(spec, my) {
  self = {};

  const data = {

    concours: [
      { name: 'id', type: 'number', oracle: 'PK_CCR', init: function() { return null; } },
      { name: 'code', type: 'string', required: true, oracle: 'CODE_CCR', init: function() { return null; } },
      { name: 'title', type: 'string', required: true, oracle: 'INTITULE_CCR', init: function() { return null; } },
      { name: 'description', type: 'string', required: true, oracle: 'DESCRIPTION_CCR', init: function() { return null; } },
      { name: 'image', type: 'blob', oracle: 'IMAGE_CCR', init: function() { return null; } },
      { name: 'startDate', type: 'date', oracle: 'DATE_DEBUT_CCR', init: function() { return null; } },
      { name: 'endDate', type: 'date', required: true, oracle: 'DATE_FIN_CCR', init: function() { return null; } },
      { name: 'winners', type: 'number', required: true, oracle: 'NOMBRE_CCR', init: function() { return 0; } },
      { name: 'question', type: 'string', oracle: 'QUESTION_CCR', init: function() { return null; } },
      { name: 'answer', type: 'string', oracle: 'REPONSE_CCR', init: function() { return null; } },
      { name: 'status', type: [{ id: 0, name: 'ENUM_NO_SHOW'},
                               { id: 1, name: 'ENUM_SHOW'},
                               { id: 2, name: 'ENUM_LAST_DAY'},
                               { id: 3, name: 'ENUM_CLOSED_NOT_DRAW'},
                               { id: 4, name: 'ENUM_CLOSED'
                               },
                              ], oracle: 'STATUT_CCR', init: function() { return 1; } },
      { name: 'link', type: 'string', oracle: 'LIEN_CCR', init: function() { return null; } },
      { name: 'admins', type: 'string', oracle: 'GESTIONNAIRE_CCR', init: function() { return null; } },
      { name: 'comments', type: 'string', oracle: 'COMMENTAIRE_CCR', init: function() { return null; } },
      { name: 'mailWinners', type: 'string', oracle: 'GAGNANT_CCR', init: function() { return ''; } },
      { name: 'mailLosers', type: 'string', oracle: 'PERDANT_CCR', init: function() { return ''; } },
      { name: 'drawingDate', type: 'date', required: true, oracle: 'TIRAGE_DATE_CCR', init: function() { return null; } },
      { name: 'drawingAdmin', type: 'string', oracle: 'TIREUR_CCR', init: function() { return null; } },
      { name: 'exclusionRule', type: 'string', oracle: 'EXCLUSION_CCR', init: function() { return null; } },
      { name: 'creationDate', type: 'date', readonly: true, oracle: 'CREATION_CCR', init: function() { return new Date(); } },
      { name: 'creationAdmin', type: 'string', readonly: true, oracle: 'CREATEUR_CCR', init: function() { return null; } },
      { name: 'imageName', type: 'string', oracle: 'IMAGE_NOM_CCR', init: function() { return null; } },
      { name: 'imageMime', type: 'string', oracle: 'IMAGE_TYPE_CCR', init: function() { return null; } }
    ],

    settings: [
      {name: 'admins', type: 'string', required: true, oracle: 'FIXME NOT YET there', init: function() { return ''; }},
    ],

    preferences: [
      {name: 'language', type: [
        {id: 'en-BE', name: 'ENUM_ENGLISH'},
        {id: 'fr-BE', name: 'ENUM_FRENCH'}
      ], init: function() {
        return my.languagePreferenceFactory.getLanguage();
      }},
    ],

  };

  //Public API
  self.get = get;
  self.init = init;
  return self;

  function get() {
    return data;
  }

  function init(o) {
    let obj = {};
    data[o.name].map(field => {
      obj[field.name] = field.init();
    });
    return obj;
  }
}
