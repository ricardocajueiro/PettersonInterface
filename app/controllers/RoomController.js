function RoomController($scope, $interval, $http, $mdDialog){
	$scope.const = {
		MESSAGE_STATUS_AVAILABLE: 'Disponível',
		MESSAGE_STATUS_IN_USE: 'Ocupado',
		MESSAGE_STATUS_CLOSED: 'Indisponível',
		
		STATUS_AVAILABLE: 'Started',
		STATUS_IN_USE: 'CustomerAssigned',
		STATUS_CLOSED: 'Closed',

		CSS_GRID_RED: 'red',
		CSS_GRID_GREEN: 'green',
		CSS_GRID_YELLOW: 'yellow',

		INTERVAL: 5000,

		URL_GET_ROOMS: 'http://localhost:8080/app/test/rooms.json',
		URL_GET_CUSTOMER: 'http://localhost:8080/app/test/details.json',
		URL_PUT_CUSTOMER: 'http://localhost:8080/app/test/details.json?',
	};

	$scope.montaGrid = function(){
		$http.get($scope.const.URL_GET_ROOMS + '?' + Math.random()).then(function(response){
			$scope.rooms = response.data;
		});
	};

	$scope.montaGrid();

	// $interval($scope.montaGrid, $scope.const.INTERVAL);

	$scope.details = function(event, room){
		teste = $scope;

		$http.get($scope.const.URL_GET_CUSTOMER + '?identifier=' + room.assignedCustomerId + '&' + Math.random()).then(function(response){
			$mdDialog.show({
				controller: function ($scope, $mdDialog, data, room){
					$scope.customer = data;
					$scope.room = room;
					$scope.customerForm = {
						name: 'Teste Teste',
						email: 'dev@ciashop.com.br',
						cpf: '111.111.111-11'
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
					data: response.data,
					room: room
				}
		    });
		});
	};

	$scope.submit = function(){
		
		// tenta buscar por e-mail
		url = $scope.const.URL_GET_CUSTOMER + '?email=' + $scope.customerForm.email + '&' + Math.random();
		$http.get(url).then(function(response){
			if(typeof response.status != 'undefined'
				&& response.status == 200
				&& typeof response.data != 'undefined' 
				&& typeof response.data.identifier != 'undefined' 
				&& response.data.identifier > 0){
				return $scope.associaCliente(response.data);
			}else{
				// tenta buscar por cpf
				url = $scope.const.URL_GET_CUSTOMER + '?documentId=' + $scope.customerForm.cpf + '&' + Math.random();
				
				$http.get(url).then(function(response){
					if(typeof response.status != 'undefined'
						&& response.status == 200
						&& typeof response.data != 'undefined'
						&& typeof response.data.identifier != 'undefined'
						&& response.data.identifier > 0){
						return $scope.associaCliente(response.data);
					}else{
						return $scope.formDialogError('Erro ao realizar a busca do cliente.');
					}
				});
			}
		});
	};

	$scope.associaCliente = function(customerData){
		var url = $scope.const.URL_PUT_CUSTOMER + '/' + $scope.room.identifier+ '/session/1/customer/' + customerData.identifier;

		$http.get(url).then(function(response){
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