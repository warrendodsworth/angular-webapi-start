describe('home.ctrl', function () {
  var $controller, IndexController, config, _home;

  // Load ui.router and our components.users module which we'll create next
  beforeEach(angular.mock.module('controllers'));

  // Inject the $controller service to create instances of the controller (HomeController) we want to test
  beforeEach(inject(function ($rootScope, _$controller_) {
    scope = $rootScope.$new();
    $controller = _$controller_;
    config = {};
    _home = {};
    IndexController = $controller('IndexController', { $scope: scope, config: config });
  }));

  // Verify our controller exists
  it('should be defined', function () {
    expect(IndexController).toBeDefined();
  });

  it('should equal true', function () {
    expect(true).toBe(true);
  });
});
