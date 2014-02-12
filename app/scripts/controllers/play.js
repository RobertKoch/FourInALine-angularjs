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
              $scope.gameOver();
            }

            break;
          }
        }
        //change player and cursor color
        $scope.changePlayer();
        $scope.moveCursor(col);
      }
      //no else for if: do nothing when column is full or game is over
    };

    $scope.gameOver = function() {
      //hide cursors, show winning-field
      $('tr.header, .player-round').hide();
      $('.won span.player').text($scope.playerRound+1);
      $('.won').fadeIn();
    };

    $scope.playerHasWon = function(x, y) {

      var player = $scope.players[$scope.playerRound];
      var actual = $scope.field;
      var goodCoins = [];
      var hasWon = false;

      //check horizontal line
      function checkHorizontal() {

        goodCoins.length = 0;
        
        //its not necessary to iterate through the whole line
        var xStart = x-3;
        var xEnd = x+3;

        if(xStart < 0) xStart = 0;
        if(xEnd > 7) xEnd = 7;

        for(var i = xStart; i < xEnd; i++)
        {

          //console.log("Horizontal: " + i + " " + y);
          //console.log(actual[y][i] + " " + actual[y][i+1] + " currentPlayer: " + player);

          if(actual[y][i] === player && actual[y][i] === actual[y][i+1])
          {
            //push xy-pairs to array
            goodCoins.push(i+','+y);

            //matching pairs, adding last coin if it fits
            if(goodCoins.length === 3)
            {
              goodCoins.push((i+1)+','+y);
              break;
            }
          }
        }

        if(goodCoins.length === 4) {
          $scope.highlightWinningLine(goodCoins);
          return true;
        }
        else
          return false;
      }

      //check vertical line
      function checkVertical() {

        goodCoins.length = 0;

        //its not necessary to iterate through the whole line
        var yStart = y - 3;
        var yEnd = y + 3;

        if(yStart < 0) yStart = 0;
        if(yEnd > 7) yEnd = 7;
        
        for(var i = yEnd; i > yStart; i--)
        {
          if(actual[i][x] === player && actual[i][x] === actual[i-1][x])
          {
            goodCoins.push(x+','+i);

            //matching pairs, adding last coin if it fits
            if(goodCoins.length === 3)
            {
              goodCoins.push(x+','+(i-1));
              break;
            }
          }
        }

        if(goodCoins.length === 4) {
          $scope.highlightWinningLine(goodCoins);
          return true;
        }
        else
          return false;
      }

      function checkDiagonal() {

        //its not necessary to iterate through the whole line
        var xStart = x-3;
        var yStart = y-3;
        var xEnd = x+3;
        var yEnd = y+3;
  
        //check first diagonal -> \
        var currentY = yStart;
        goodCoins.length = 0;

        for(var i = xStart; i < xEnd; i++)
        {
          if(currentY >= 0 && currentY < 7 && i >= 0 && i < 7)
          {
            if(actual[currentY][i] === player && actual[currentY][i] === actual[currentY+1][i+1])
            {
              goodCoins.push(i+','+currentY);

              //matching pairs, adding last coin if it fits
              if(goodCoins.length === 3)
              {
                goodCoins.push((i+1)+','+(currentY+1));
                break;
              }
            }
          }
          currentY++;
        }

        if(goodCoins.length === 4)
        {
          $scope.highlightWinningLine(goodCoins);
          return true;
        }

        //check second diagonal -> /
        currentY = yEnd;
        goodCoins.length = 0;

        for(var i = xStart; i < xEnd; i++)
        {
          if(currentY > 0 && currentY <= 7 && i >= 0 && i < 7)
          {
            if(actual[currentY][i] === player && actual[currentY][i] === actual[currentY-1][i+1])
            {
              goodCoins.push(i+','+currentY);

              //matching pairs, adding last coin if it fits
              if(goodCoins.length === 3)
              {
                goodCoins.push((i+1) + ',' + (currentY-1));
                break;
              }
            }
          }
          currentY--;
        }

        if(goodCoins.length === 4)
        {
          $scope.highlightWinningLine(goodCoins);
          return true;
        }
       
        return false;

      }

      if(checkHorizontal())
        hasWon = true;

      if(checkVertical())
        hasWon = true;

      if(checkDiagonal())
        hasWon = true;

      return hasWon;
    };

    $scope.highlightWinningLine = function(coins) {
      coins.forEach(function(coin) {
        var coords = coin.split(',');
        $('.field tr').eq(parseInt(coords[1])+1).find('td').eq(parseInt(coords[0])).find('.circle').addClass('winning-coin');
      });
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
    };
  });
