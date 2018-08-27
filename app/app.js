angular.module('PettersonApp', ['ngMaterial', 'ngMessages', 'ui.utils.masks'])
	.controller('RoomController', ['$scope', '$interval', '$http', '$mdDialog', RoomController]);

angular.element(document).ready(function(){
	angular.element(document.getElementById('RoomController')).scope().init();
});