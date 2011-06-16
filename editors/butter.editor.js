(function (window, document) {

  var PLUGIN_FILE_PREFIX = "butter.editor.";


  var PluginEditorClient = window.PluginEditorClient = function ( options ) {

    var that = this;

    if ( options ) {
      this.message = options.message || function () {};
      this.init = options.init;
    } //if

    window.addEventListener( "message", function (e) {
      if ( e.data && e.data.message === "init" && that.init ) {
        that.init( e.data.data );
      }
      else {
        that.message( e.data );
      } //if
    });

    this.send = function ( message, data ) {

      postMessage({
        message: message,
        data: data,
      }, "*");
    }; //send
    
    this.submit = function ( values ) {

      var safeValues = {};

      for ( var value in values ) {

        var type = typeof( values[ value ] ),
            safeValue;

        if ( type === "function" ) {
          safeValue = values[ value ].toString();
        }
        else {
          safeValue = JSON.stringify( values[ value ] );
        } //if

        safeValues[ value ] = {
          type: type,
          value: safeValue,
        };
      } //for

      that.send( "submit", safeValues );

    };
    
  }; //PluginEditorClient


  var PluginEditor = window.PluginEditor = function ( options ) {

    var that = this;

    if ( !options.type ) {

      throw new Error( "Must specify editor type." );
    } //if

    this.message = options.message || function () {};

    var iframe = document.createElement( "iframe" );
    iframe.className = "editor-plugin-iframe";
    
    this.getIframe = function () {
      return iframe;
    };

    this.init = function ( initOptions ) {
    
      iframe.contentWindow.postMessage({
        message: "init",
        data: initOptions,
      }, "*");
    };

    if ( options.editorViewportId ) {

      if ( typeof(options.ready) === "function" ) {

        iframe.addEventListener( "load", function (e) {
          options.ready(e, iframe);
        }, false);
      } //if

      var viewportElement = document.getElementById( options.editorViewportId );
      viewportElement.appendChild(iframe);

    } //if

    iframe.setAttribute( "src", PLUGIN_FILE_PREFIX + options.type + ".html" );

    this.submit = options.submit || function () {};

    iframe.contentWindow.addEventListener( "message", function (e) {

      if ( e.data && e.data.message === "submit" && that.submit ) {

        var unpackedValues = {},
            values = e.data.data;

        for ( var value in values ) {

          if ( values[ value ].type === "function" ) {

            var fStr = values[ value ].value,
                args = fStr.match(/function \(([A-Za-z0-9_\$]*)\)/)[1],
                fn = new Function( args, fStr );
            unpackedValues[ value ] = fn;
          } //if
        } //for

        that.submit( unpackedValues );
      }
      else {

        that.message( e.data );
      } //if

    }, false);

  }; //PluginEditor

})(window, document);
