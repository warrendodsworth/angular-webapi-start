
exports.config = {
  framework: 'jasmine',
  specs: ['./e2e/**/*.spec.js', './labs/**/*.spec.js'],
  baseUrl: 'http://localhost:53233/',
};


//https://angular.github.io/protractor/#/tutorial   //Tutorial
//https://angular.github.io/protractor/#/toc        //Table of Contents
//http://angular.github.io/protractor/#/api?view=ElementArrayFinder //Lists
//seleniumAddress: 'http://localhost:4444/wd/hub',
//multiCapabilities: [{
//  'browserName': 'chrome',
//  // browser-specific tests
//  specs: 'chromeTests/*'
//}, {
//  'browserName': 'firefox',
//  // run tests in parallel
//  shardTestFiles: true
//}],
