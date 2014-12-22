/**
 * Test specification for Templates
 *
 * Tests with Jasmine
 */

// Create a DOM
var jsdom = require('jsdom');

// Add dependencies
global.jQuery = require('jquery')(jsdom.jsdom().parentWindow);
global.Hogan = require('hogan.js');

$ = jQuery;

// Load module
var Templates = require('../Templates');

describe('Templates', function () {
  beforeEach(function () {
    $('body')
      .append('<div x-template="test">{{name}}</div>')
      .append('<div x-template-inject="test"></div>');
  });

  afterEach(function () {
    $('[x-template], [x-template-inject]').remove();
  });

  it('exisits', function () {
    expect(Templates).not.toBe(undefined);
  });

  it('finds all templates', function () {
    expect(Templates.getTemplates().length).toBe(1);
    expect(Templates.getTemplates().first().html()).toBe('{{name}}');
  });

  it('parses templates', function () {
    var template = Templates.parse('{{foo}}', {
      foo: 'foo'
    });

    var template2 = Templates.parse('{{foo}} {{bar}}', {
      foo: 'foo',
      bar: 'bar'
    });

    expect(template).toBe('foo');
    expect(template2).toBe('foo bar');
  });

  it('generates unique IDs', function () {
    expect(Templates.generateId().length).toBe(8);
  });

  it('injects templates with data as object', function () {
    Templates.inject('test', {
      name: 'foo'
    });

    expect($('[x-template-inject="test"]').text()).toBe('foo');
  });

  it('injects templates with id set', function () {
    Templates.inject('test', {
      name: 'foo',
      id: 'foobar'
    });

    expect($('[x-template-inject="test"]').text()).toBe('foo');
  });

  it('injects templates with data as array', function () {
    Templates.inject('test', [{
      name: 'foo'
    }, {
      name: 'bar'
    }]);

    expect($('[x-template-inject="test"]').text()).toBe('foobar');
  });

  it('updates template with data as object', function () {
    Templates.inject('test', {
      name: 'foo',
      id: 'foo'
    });

    expect($('[x-template-inject="test"]').text()).toBe('foo');

    Templates.update('test', 'foo', {
      name: 'bar',
      id: 'foo'
    });

    expect($('[x-template-inject="test"]').text()).toBe('bar');
  });
});
