function RoomController($scope, $mdDialog){
	$scope.const = {
		STATUS_AVAILABLE: 'Available',
		STATUS_IN_USE: 'InUse',
		STATUS_CLOSED: 'Closed',

		CSS_GRID_RED: 'red',
		CSS_GRID_GREEN: 'green',
		CSS_GRID_YELLOW: 'yellow'
	};

	$scope.rooms = [
		{id: 1, name: 'Room n. 1', status: 'Available'},
		{id: 2, name: 'Room n. 2', status: 'InUse'},
		{id: 3, name: 'Room n. 3', status: 'Available'},
		{id: 4, name: 'Room n. 4', status: 'Closed'},
		{id: 5, name: 'Room n. 5', status: 'Closed'},
		{id: 6, name: 'Room n. 6', status: 'InUse'},
		{id: 7, name: 'Room n. 7', status: 'Closed'},
		{id: 8, name: 'Room n. 8', status: 'InUse'},
		{id: 9, name: 'Room n. 9', status: 'Closed'},
		{id: 10, name: 'Room n. 10', status: 'Available'},
		{id: 11, name: 'Room n. 11', status: 'Closed'},
		{id: 12, name: 'Room n. 12', status: 'InUse'}
	];

	$scope.details = function(event, room){
		$mdDialog.show({
	      controller: RoomController,
	      templateUrl: 'app/views/room/details.html',
	      parent: angular.element(document.body),
	      targetEvent: event,
	      clickOutsideToClose:true
	    });
	};

	$scope.cancel = function(){
		$mdDialog.cancel();
	}
}