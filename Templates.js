/**
 * TEMPLATES
 * Template parsing with jQuery and Hogan
 *
 * Hogan: http://twitter.github.io/hogan.js/
 * Mustache: http://mustache.github.io/
 *
 * Templates with `x-template` get indexed by their name and injected into the
 * DOM where `x-template-inject` matches the template's name.
 *
 * To inject a specific template you can call
 * `Templates.inject(templatename, data)` while `templatename` is the value of
 * `x-template` and data is the object that holds the data to be passed to
 * the Hogan template.
 */
void function (global) {

  var $;
  var Hogan;

  var Templates = {};

  /**
   * All templates on a page
   * @return {jQuery Object} All templates on a page
   */
  Templates.getTemplates = function () {
    return $('[x-template]');
  };

  /**
   * Get a specific template
   * @param  {String}        page
   * @return {jQuery Object}      Template
   */
  Templates.get = function (page) {
    return Templates.getTemplates().filter('[x-template~="' + page + '"]').html();
  };

  /**
   * Parse templates and render them with data
   * @param  {Sting}  template HTML of template
   * @param  {Object} data     Data to inject into template
   * @return {String}          Parsed template
   */
  Templates.parse = function (template, data) {
    var parsedTemplate = Hogan.compile(template);

    return parsedTemplate.render(data);
  };

  /**
   * Generate UUID
   * @return {String}
   */
  Templates.generateId = function () {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1) +
           Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  };

  /**
   * Inject templates where they are needed
   * @param  {String}   templateName Name of template
   * @param  {Object}   data         Data to inject into template
   * @param  {Function} callback     Callback function for each element
   * @return {void}
   */
  Templates.inject = function (templateName, data, callback) {
    var template = Templates.get(templateName);
    var html = '';
    var i = 0;
    var length = data.length;

    callback = callback || function () {};

    // If data is not provided as an array
    if (!$.isArray(data)) {
      data = [data];
    }

    for (; i < length; i++) {
      data[i].name = data[i].name || Templates.generateId();
      data[i].id = templateName + '__' + data[i].name;

      html += '<div x-template-id="' + data[i].id + '">' + Templates.parse(template, data[i]) + '</div>';
    }

    $('[x-template-inject~="' + templateName + '"]').html(html);

    for (i = 0; i < length; i++) {
      callback(data[i]);
    }
  };

  /**
   * Update a given template
   * @param  {String} templateName Name of template
   * @param  {String} name         ID of element to update
   * @param  {Object} data         Data to inject into template
   * @return {void}
   */
  Templates.update = function (templateName, name, data) {
    var template = Templates.get(templateName);
    var html = Templates.parse(template, data);

    // Replace element with new element
    $('[x-template-id="' + templateName + '__' + name + '"]')
      .after(html)
      .remove();
  };

  /**
   * Initialize with jQuery and Hogan
   * @param  {Obejct} imports Holds possible imports
   * @return {void}
   */
  Templates.init = function (imports) {
    $ = imports.jQuery;
    Hogan = imports.Hogan;

    return Templates;
  };

  /*
   * AMD, module loader, global registration
   */

  // Expose loaders that implement the Node module pattern.
  if (typeof module === 'object' && module && typeof module.exports === 'object') {
    module.exports = Templates.init({
      jQuery: require('jquery'),
      Hogan: require('hogan.js')
    });

  // Register as an AMD module
  } else if (typeof define === 'function' && define.amd) {
    define('Templates', ['jQuery', 'hogan.js'], function (jQuery, Hogan) {
      return Templates.init({
        jQuery: jQuery,
        Hogan: Hogan
      });
    });

  // Export into global space
  } else if (typeof global === 'object' && typeof global.document === 'object') {
    global.Templates = Templates.init({
      jQuery: global.jQuery,
      Hogan: global.Hogan
    });
  }
}(this);
