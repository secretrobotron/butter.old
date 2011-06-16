(function (window, document) {

  var LayoutHelper = window.LayoutHelper = function () {

    var that = this,
        targets = this.targets = {},
        markedObjects = document.getElementsByClassName( "butter-layout-target" );
    
    this.addTarget = function ( target ) {

      if ( target.id ) {
        that.targets[ target.id ] = target;
      } //if
    }; //addTarget

    for ( var i=0; i<markedObjects.length;++i ) {
      
      this.addTarget( markedObjects[ i ] );
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
        that.send( "receive targets", targets.keys );
      },
    };

    window.addEventListener( "message", function (e) {

      if ( e.data && e.data[ "layout-helper"] === true ) {

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
        "layout-helper": true,
        message: message,
        data: data,
      }, "*");
    }; //send

    commObject.contentWindow.addEventListener( "message", function (e) {
      console.log(e.data);

      if ( e.data && e.data[ "layout-helper"] === true ) {
      } //if

    }, false);

    this.send( "get targets" );

  };

})(window, document);
