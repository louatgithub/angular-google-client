(function() {
  'use strict';
  angular.module('cm-google-api').directive('cmGoogleSignIn', ['$http', 'googleClient', function($http, googleClient){
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        clickHandler: '=',
        signInListener: '=',
        userListener: '='
      },
      template: '<span ng-transclude></span>',
      link: function (scope, element, attrs) {

        function clickHandler(googleUser){
          scope.$apply(scope.clickHandler(googleUser));
        }

        function userListener(googleUser){
          scope.$apply(scope.userListener(googleUser));
        }

        function signInListener(val){
          scope.$apply(scope.signInListener(val));
        }

        if(typeof scope.clickHandler === 'undefined'){
          scope.clickHandler = angular.noop;
        }
        googleClient.afterScriptsLoaded().then(
          function(){
            var auth2 = gapi.auth2.getAuthInstance();
            if (typeof scope.signInListener !== 'undefined') {
              auth2.isSignedIn.listen(signInListener);
            }
            if (typeof scope.userListener !== 'undefined') {
              auth2.currentUser.listen(userListener);
            }
            auth2.attachClickHandler(element[0], {}, clickHandler, function(error) {
              console.log(JSON.stringify(error, undefined, 2));
            });
          },
          function(e){
            console.log(e);
          }
        );
      }
    };
  }]);
})();
