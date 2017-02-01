describe('angularjs homepage', function () {
  it('should greet the named user', function () {
    angularHomepage.get();
    angularHomepage.setName('Julie is going to school today.');

    expect(angularHomepage.result.getText()).toEqual('Julie is going to school today.');
  });
});

//Test Angular homepage
describe('angularjs homepage todo list', function () {
  it('should add a todo', function () {

    browser.get('https://angularjs.org');

    element(by.model('todoList.todoText')).sendKeys('write first protractor test');
    element(by.css('[value="add"]')).click();

    var todoList = element.all(by.repeater('todo in todoList.todos'));
    expect(todoList.count()).toEqual(3);
    expect(todoList.get(2).getText()).toEqual('write first protractor test');

    // You wrote your first test, cross it off the list
    todoList.get(2).element(by.css('input')).click();
    var completedAmount = element.all(by.css('.done-true'));
    expect(completedAmount.count()).toEqual(2);
  });
});


// Here we are using the Jasmine test framework 
// See http://jasmine.github.io/2.0/introduction.html for more details
// It is a good idea to use page objects to modularize your testing logic

var angularHomepage = {
  nameInput: element(by.model('model.name')),
  result: element(by.binding('model.name')),
  get: function () {
    browser.get('#/create');
  },
  setName: function (name) {
    this.nameInput.sendKeys(name);
  }
};

describe('angularjs homepage', function () {
  it('should greet the named user', function () {
    angularHomepage.get();
    angularHomepage.setName('Julie is going to school today.');

    expect(angularHomepage.result.getText()).toEqual('Julie is going to school today.');
  });
});


/*
 * Protractor Demo
 */

// Basic 
describe('Protractor Demo App', function () {
  it('should add one and two', function () {
    browser.get('http://juliemr.github.io/protractor-demo/');
    element(by.model('first')).sendKeys(1);
    element(by.model('second')).sendKeys(2);

    element(by.id('gobutton')).click();

    expect(element(by.binding('latest')).getText()).
        toEqual('5'); // This is wrong!
  });
});


// Multiple Senarios
describe('Protractor Demo App', function () {
  var firstNumber = element(by.model('first'));
  var secondNumber = element(by.model('second'));
  var goButton = element(by.id('gobutton'));
  var latestResult = element(by.binding('latest'));

  beforeEach(function () {
    browser.get('http://juliemr.github.io/protractor-demo/');
  });

  it('should have a title', function () {
    expect(browser.getTitle()).toEqual('Super Calculator');
  });

  it('should add one and two', function () {
    firstNumber.sendKeys(1);
    secondNumber.sendKeys(2);

    goButton.click();

    expect(latestResult.getText()).toEqual('3');
  });

  it('should add four and six', function () {
    // Fill this in.
    expect(latestResult.getText()).toEqual('10');
  });
});


// Lists
describe('Protractor Demo App', function () {
  var firstNumber = element(by.model('first'));
  var secondNumber = element(by.model('second'));
  var goButton = element(by.id('gobutton'));
  var latestResult = element(by.binding('latest'));
  var history = element.all(by.repeater('result in memory'));

  function add(a, b) {
    firstNumber.sendKeys(a);
    secondNumber.sendKeys(b);
    goButton.click();
  }

  beforeEach(function () {
    browser.get('http://juliemr.github.io/protractor-demo/');
  });

  it('should have a history', function () {
    add(1, 2);
    add(3, 4);

    expect(history.count()).toEqual(2);

    add(5, 6);

    expect(history.count()).toEqual(0); // This is wrong!
  });
});