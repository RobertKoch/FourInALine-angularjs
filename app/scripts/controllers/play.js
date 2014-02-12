'use strict';

angular.module('fourInAlineApp')
  .controller('PlayCtrl', function ($scope, $window) {
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
    $scope.interactionAllowed = true;

    //add coin if col is not full, check if game is over
    $scope.addCoin = function(col) {
      console.log('Player '+ $scope.playerRound +' clicked: '+ col);

      if($scope.interactionAllowed && $scope.colCount[col] < 8)
      {
        $scope.colCount[col] += 1;

        //set coin to lowest empty bucket
        for(var i = ($scope.field.length-1); i >= 0; i--) {
          if($scope.field[i][col] === 0) {
            $scope.field[i][col] = $scope.players[$scope.playerRound];

            //use the last position to check hasWon faster
            if($scope.playerHasWon(col, i))
            {
              $scope.interactionAllowed = false;
              console.log("Player " + $scope.playerRound + "has won");
              //alert('Game Over' + "Player " + $scope.playerRound + " won!");
              $scope.gameOver();
            }

            break;
          }
        }
        //change player and cursor color
        $scope.changePlayer();
        $scope.moveCursor(col);
      }
      else
      {
        //column if full!
        console.log('Column is full or game is over!!');
      }
    };

    $scope.gameOver = function() {
      //hide cursors, show winning-field
      console.log('gameOver() called');
      $('tr.header, .player-round').hide();
      $('.won span.player').text($scope.playerRound+1);
      $('.won').fadeIn();
    };

    $scope.playerHasWon = function(x, y) {
      //TODO: check if current player has won
      console.log("Check HasWon for position " + x + " " + y);
      var player = $scope.players[$scope.playerRound];
      var actual = $scope.field;
      var goodCoins = [];
      var hasWon = false;

      //check horizontal line => field[y]
      function checkHorizontal() {
        goodCoins.length = 0;
        for(var i = 0; i < 7; i++)
        {
          if(actual[y][i] === player && actual[y][i] === actual[y][i+1])
          {
            //push xy-pairs to array
            goodCoins.push(i+","+y);

            //matching pairs, adding last coin if it fits
            if(goodCoins.length === 3)
              goodCoins.push((i+1)+","+y);
          }
        }

        if(goodCoins.length === 4)
          return true;
        else
          return false;
      };

      //check vertical line -> field[x][0..7]
      function checkVertical() {
        goodCoins.length = 0;
        for(var i = 7; i > 0; i--)
        {
          if(actual[i][x] === player && actual[i][x] === actual[i-1][x])
          {
            goodCoins.push(x+","+i);

            //matching pairs, adding last coin if it fits
            if(goodCoins.length === 3)
              goodCoins.push(x+","+(i-1));
          }
        }

        if(goodCoins.length === 4)
          return true;
        else
          return false;
      };

      if(checkHorizontal())
        hasWon = true;
      if(checkVertical())
        hasWon = true;

      return hasWon;
    };

    $scope.changePlayer = function() {
      if($scope.playerRound === 0)
        $scope.playerRound = 1;
      else
        $scope.playerRound = 0;
    };

    $scope.moveCursor = function(col) {
      if($scope.interactionAllowed) {
        $('tr.header td').removeClass('player_X player_O');
        $('td.headtd_'+col).addClass('player_'+$scope.players[$scope.playerRound]);
      }
    };

    $scope.reload = function() {
      $window.location.reload();
    }
  });
