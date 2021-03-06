function RoomController($scope, $interval, $http, $mdDialog){
	$scope.const = {
		MESSAGE_STATUS_AVAILABLE: 'Disponível',
		MESSAGE_STATUS_IN_USE: 'Ocupado',
		MESSAGE_STATUS_CLOSED: 'Indisponível',
		
		STATUS_AVAILABLE: ['Started', 'Waiting'],
		STATUS_IN_USE: ['CustomerAssigned', 'CustomerAuthenticated'],
		STATUS_CLOSED: ['Stopping', 'Stopped', 'Killed', 'Expired'],

		CSS_GRID_RED: 'red',
		CSS_GRID_GREEN: 'green',
		CSS_GRID_YELLOW: 'yellow',

		INTERVAL: 5000,

		BASE_URL: 'http://ec2-18-228-15-230.sa-east-1.compute.amazonaws.com:28080/ligw/api/v1',
	};

	$scope.const.URL_GET_ROOMS = $scope.const.BASE_URL + '/sessions/active';
	$scope.const.URL_GET_CUSTOMER = $scope.const.BASE_URL + '/customer';
	$scope.const.URL_PUT_CUSTOMER = $scope.const.BASE_URL + '/client/{CLIENT_ID}/session/{SESSION_ID}/customer/{CUSTOMER_ID}';

	// COMENTAR ISSO AQUI
	// $scope.const.URL_GET_ROOMS = 'http://localhost:8080/app/test/rooms.json'
	// $scope.const.URL_GET_CUSTOMER = 'http://localhost:8080/app/test/details.json?';
	// $scope.const.URL_PUT_CUSTOMER = 'http://localhost:8080/app/test/details.json?/client/{CLIENT_ID}/session/{SESSION_ID}/customer/{CUSTOMER_ID}';

	$scope.montaGrid = function(){
		$http.get($scope.const.URL_GET_ROOMS + '?rand=' + Math.random()).then(function(response){
			$scope.rooms = response.data;
		});
	};

	$scope.init = function(){
		$scope.montaGrid();

		$interval($scope.montaGrid, $scope.const.INTERVAL);
	}

	$scope.details = function(event, room){
		response = {data: null};

		if($scope.const.STATUS_IN_USE.indexOf(room.status) > -1){
			url = $scope.const.URL_GET_CUSTOMER + '/' + room.assignedCustomerId + '?rand=' + Math.random();
			return $http.get(url).then(function(response){
				return $scope.showDetailsDialog(event, response, room);
			});
		}else{
			return $scope.showDetailsDialog(event, response, room);
		}
	};


	$scope.showFormCustomerField = function(){
		angular.element(document.querySelector("#input-email")).removeClass("ng-hide");
		angular.element(document.querySelector("#input-documentId")).removeClass("ng-hide");

		if($scope.customerForm.q == 'email'){
			angular.element(document.querySelector("#input-documentId")).addClass("ng-hide");
		}else if ($scope.customerForm.q == 'documentId'){
			angular.element(document.querySelector("#input-email")).addClass("ng-hide");
		}
	}

	$scope.showDetailsDialog = function(event, response, room){
		$mdDialog.show({
			controller: function ($scope, $mdDialog, customer, room){
				$scope.customer = customer;
				$scope.room = room;
				$scope.customerForm = {
					q: '',
					email: '',
					documentId: ''
				};

				$scope.cancel = function(){
					$mdDialog.cancel();
				};
			},
			templateUrl: 'app/views/room/details.html',
	      	parent: angular.element(document.body),
	      	targetEvent: event,
			clickOutsideToClose:true,
			locals: {
				customer: response.data,
				room: room
			}
	    });
	}

	$scope.submit = function(){
		field = $scope.customerForm.q;
		value = $scope.customerForm[field];

		if(value=='') return;

		if(field == 'documentId'){
			value = value.match(/\d/g).join('');
		}

		url = $scope.const.URL_GET_CUSTOMER + '?' + field + '=' + value + '&rand=' + Math.random();

		$http.get(url).then(function(response){
			if(typeof response.status != 'undefined'
				&& response.status == 200){
				
				if(typeof response.data != 'undefined' 
					&& typeof response.data.identifier != 'undefined' 
					&& response.data.identifier > 0){
					return $scope.associaCliente(response.data);
				}else{
					return $scope.formDialogError('Cliente não encontrado.');
				}
			}else{
				return $scope.formDialogError('Erro ao realizar a busca do cliente.');
			}
		});
	};

	$scope.associaCliente = function(customerData){
		var url = $scope.const.URL_PUT_CUSTOMER;
		url = url.replace(/{CLIENT_ID}/g, $scope.room.client.identifier);
		url = url.replace(/{SESSION_ID}/g, $scope.room.identifier);
		url = url.replace(/{CUSTOMER_ID}/g, customerData.identifier);

		$http.put(url).then(function(response){
			if(typeof response.status != 'undefined' && response.status == 200){
				$scope.formDialogSuccess();
				$scope.montaGrid();
				$scope.cancel();
			}else{
				$scope.formDialogError('Erro ao realizar o cadastro.');
			}
		});
	}

	$scope.formDialogSuccess = function(){
		$mdDialog.show(
	      $mdDialog.alert()
	        .parent(angular.element(document.querySelector('#popupContainer')))
	        .clickOutsideToClose(true)
	        .title('Sucesso')
	        .textContent('Cadastro realizado com sucesso.')
	        .ariaLabel('Sucesso')
	        .ok('Continuar')
	    );
	}

	$scope.formDialogError = function(message){
		$mdDialog.show(
	      $mdDialog.alert()
	        .parent(angular.element(document.querySelector('#popupContainer')))
	        .clickOutsideToClose(true)
	        .title('Erro!')
	        .textContent(message)
	        .ariaLabel('Erro!')
	        .ok('Continuar')
	    );
	}
}