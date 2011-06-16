(function (window, document) {

  var LayoutHelpers = window.LayoutHelpers = [];

  var LayoutHelper = window.LayoutHelper = function () {

    var that = this,
        markedObjects = document.getElementsByClassName( "butter-layout-target" ),
        markedMedia = document.getElementsByClassName( "butter-layout-media" );

    LayoutHelpers.push( this );

    this.targets = {};
    this.media = [];
    
    this.addTarget = function ( target ) {

      if ( target.id ) {
        that.targets[ target.id ] = target;
      } //if
    }; //addTarget

    this.addMedia = function ( media ) {

      that.media.push(media);
    }; //addMedia

    for ( var i=0; i<markedObjects.length;++i ) {
      
      this.addTarget( markedObjects[ i ] );
    } //for

    for ( var i=0; i<markedMedia.length;++i ) {
      
      this.addMedia( markedMedia[ i ] );
    } //for

    this.send = function ( message, data ) {

      postMessage({
        "layout-helper": true,
        message: message,
        data: data,
      }, "*");
    }; //send


    var functions = {

      "get targets": function ( data ) {

        var keys = [];
        for ( var k in targets ) {
          keys.push(k);
        } //for
        that.send( "receive targets", keys );
      },

    };

    window.addEventListener( "message", function (e) {

      if ( e.data && e.data[ "layout-helper-connection"] === true ) {

        if ( e.data.message in functions ) {
          functions[ e.data.message ]( e.data.data );
        } //if
      } //if

    }, false);

  }; //LayoutHelper

  var LayoutHelperConnection = window.LayoutHelperConnection = function ( options ) {

    var commObject = options.object;

    this.send = function ( message, data ) {

      commObject.contentWindow.postMessage({
        "layout-helper-connection": true,
        message: message,
        data: data,
      }, "*");
    }; //send

    var functions = {

      "receive targets": function ( data ) {

      },

      "media timeupdate": function ( data ) {
      },
    };

    commObject.contentWindow.addEventListener( "message", function (e) {

      if ( e.data && e.data[ "layout-helper"] === true ) {
        
        if ( e.data.message in functions ) {

          functions[ e.data.message ]( e.data.data );

        } //if

      } //if

    }, false);

    this.getTargets = function () {

      this.send( "get targets" );
    }; //getTargets

  };

})(window, document);
