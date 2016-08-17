import categoryConstructor from '../common/models/category.object';

export default function CategoriesListController($log, $state, appState) {
  let self = {};
  let my = {$log}; //shared state (global deps);
  let categories_core = [
    {
      id: 1,
      name: 'concours',
      icon: 'home'
    },
    {
      id: 2,
      name: 'users',
      icon: 'people'
    },
    {
      id: 3,
      name: 'settings',
      icon: 'settings'
    },
  ];
  let categories = categories_core.map((c) => {
    return categoryConstructor(c, my);
  });

  let getCategories = function () {
    return categories;
  }

  let selectCategory = function(category) {
    appState.setCategory(category);
    $state.go(appState.getStateFromSelectedCategory());
  }

  let getSelectedCategory = function() {
    return appState.getCategory();
  }

  self.getCategories = getCategories;
  self.selectCategory = selectCategory;
  self.getSelectedCategory = getSelectedCategory;

  return self;
}
