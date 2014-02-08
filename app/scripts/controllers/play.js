'use strict';

angular.module('fourInAlineApp')
  .controller('PlayCtrl', function ($scope) {
    //represents the playing field
    $scope.field = [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0]
    ];

    //counter for (full) columns
    $scope.colCount = [0,0,0,0,0,0,0,0];

    //player signs and round
    $scope.players = ['X', 'O'];
    $scope.playerRound = 0;

    //add coin if col is not full, check if game is over
    $scope.addCoin = function(col) {
      console.log('Player '+ $scope.playerRound +' clicked: '+ col);
      if($scope.colCount[col] < 8)
      {
        $scope.colCount[col] += 1;

        //set coin to lowest empty bucket
        for(var i = ($scope.field.length-1); i >= 0; i--) {
          if($scope.field[i][col] === 0) {
            $scope.field[i][col] = $scope.players[$scope.playerRound];
            break;
          }
        }

        $scope.playerHasWon();
        $scope.changePlayer();
      }
      else
      {
        //column if full!
        console.log('Column is full!!');
      }
    };

    $scope.playerHasWon = function() {
       //TODO: check if current player has won
    };

    $scope.changePlayer = function() {
      if($scope.playerRound === 0)
      {
        $scope.playerRound = 1;
      }
      else
      {
        $scope.playerRound = 0;
      }
    };
  });
