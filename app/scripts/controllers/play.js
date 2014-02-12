'use strict';

angular.module('fourInAlineApp')
  .controller('PlayCtrl', function ($scope) {
    //represents the playing field
    /*
    $scope.field = [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,'X','O',0,0,0],
      [0,0,'X','X','X',0,0,0],
      [0,'X','O','O','O',0,0,'O']
    ];*/

    $scope.field = [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,'X','X',0,0],
      [0,0,0,0,'O','X','X',0],
      [0,0,0,'O','O','O','O','X']
    ];


    /*$scope.field = [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0]
    ];*/

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
              //console.log("Player " + $scope.playerRound + "has won");
              alert('Game Over ' + "Player " + $scope.playerRound + " won!");
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

        //console.log("start Horizontal!!!!");
        
        for(var i = xStart; i < xEnd; i++)
        {

          //console.log("Horizontal: " + i + " " + y);
          //console.log(actual[y][i] + " " + actual[y][i+1] + " currentPlayer: " + player);

          if(actual[y][i] === player && actual[y][i] === actual[y][i+1])
          {
            //push xy-pairs to array
            goodCoins.push(i+","+y);

            //matching pairs, adding last coin if it fits
            if(goodCoins.length === 3)
            {
              goodCoins.push((i+1)+","+y);
              break;
            }
          }
        }

        if(goodCoins.length === 4)
          return true;
        else
          return false;
      };

      //check vertical line
      function checkVertical() {

        goodCoins.length = 0;

        //its not necessary to iterate through the whole line
        var yStart = y - 3;
        var yEnd = y + 3;

        if(yStart < 0) yStart = 0;
        if(yEnd > 7) yEnd = 7;
        
        //console.log("Start Vertical!!!!!!");

        for(var i = yEnd; i > yStart; i--)
        {
          //console.log("Vertical: " + i + " " + x);
          //console.log(actual[i][x] + " " + actual[i-1][x] + " currentPlayer: " + player);

          if(actual[i][x] === player && actual[i][x] === actual[i-1][x])
          {
            goodCoins.push(x+","+i);

            //matching pairs, adding last coin if it fits
            if(goodCoins.length === 3)
            {
              goodCoins.push(x+","+(i-1));
              break;
            }
          }
        }

        if(goodCoins.length === 4)
          return true;
        else
          return false;
      };

      function checkDiagonal() {

        //its not necessary to iterate through the whole line
        var xStart = x-3;
        var yStart = y-3;
        var xEnd = x+3;
        var yEnd = x+3;

        /*while(xStart < 0 || yStart < 0)
        {
          xStart++;
          yStart++;
        }

        while(xEnd > 7 || yEnd > 7)
        {
          xEnd--;
          yEnd--;
        }*/
  
        //check first diagonal -> \
        var currentY = yStart;
        goodCoins.length = 0;

        console.log("Start \\\\");

        for(var i = xStart; i < xEnd; i++)
        {
          if(currentY >= 0 && currentY < 7 && i >= 0 && i < 7)
          {
            console.log("Diagonal\: " + i + " " + currentY);
            //console.log(actual[currentY][i] + " " + actual[currentY+1][i+1] + " currentPlayer: " + player);

            if(actual[currentY][i] === player && actual[currentY][i] === actual[currentY+1][i+1])
            {
              goodCoins.push(i+","+currentY);
              console.log("Push: " + i+","+currentY)

              //matching pairs, adding last coin if it fits
              if(goodCoins.length === 3)
              {
                goodCoins.push(i+1+","+(currentY+1));
                console.log("Push: " + (i+1)+","+(currentY+1));
                //break;
              }
            }
          }

          currentY++;
        }

        if(goodCoins.length === 4)
          return true;

        //check second diagonal -> /
        /*currentY = yEnd;
        goodCoins.lenght = 0;

        console.log("Start ////////");
        console.log(actual);

        for(var i = xStart; i < xEnd; i++)
        {
          console.log("Diagonal/: " + i + " " + currentY);
          console.log(actual[i][currentY] + " " + actual[i+1][currentY-1] + " currentPlayer: " + player);

          if(actual[currentY][i] === player && actual[currentY][i] === actual[currentY-1][i+1])
          {
            goodCoins.push(i+","+currentY);

            //matching pairs, adding last coin if it fits
            if(goodCoins.length === 3)
            {
              goodCoins.push(i+1 + "," + (currentY-1));
              break;
            }
          }

          currentY--;
        }

        if(goodCoins.length === 4)
          return true;
        */
       
       return false;

      };

      if(checkHorizontal())
        hasWon = true;
      if(checkVertical())
        hasWon = true;
      if(checkDiagonal())
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
  });
