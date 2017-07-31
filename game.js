var gameOfLife = {

  width: 12,
  height: 12, // width and height dimensions of the board
  stepInterval: null, // should be used to hold reference to an interval that is "playing" the game
  pattern: ['.O.....', '...O...', 'OO..OOO'],

  createAndShowBoard: function () {

    // create <table> element
    var goltable = document.createElement("tbody");

    // build Table HTML
    var tablehtml = '';
    for (var h = 0; h < this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (var w = 0; w < this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;

    // add table to the #board element
    var board = document.getElementById('board');
    board.appendChild(goltable);

    // once html elements are added to the page, attach events to them
    this.setupBoardEvents();
  },

  forEachCell: function (iteratorFunc) {
    /*
      Write forEachCell here. You will have to visit
      each cell on the board, call the "iteratorFunc" function,
      and pass into func, the cell and the cell's x & y
      coordinates. For example: iteratorFunc(cell, x, y)
    */
    for( var row = 0; row < this.height; row++ ){
      for( var col = 0; col < this.width; col++ ){
        var cell = document.getElementById( col + '-' + row )
        iteratorFunc(cell, col, row)
      }
    }

  },

  setupBoardEvents: function() {
    // each board cell has an CSS id in the format of: "x-y"
    // where x is the x-coordinate and y the y-coordinate
    // use this fact to loop through all the ids and assign
    // them "click" events that allow a user to click on
    // cells to setup the initial state of the game
    // before clicking "Step" or "Auto-Play

    // clicking on a cell should toggle the cell between "alive" & "dead"
    // for ex: an "alive" cell be colored "blue", a dead cell could stay white

    // EXAMPLE FOR ONE CELL
    // Here is how we would catch a click event on just the 0-0 cell
    // You need to add the click event on EVERY cell on the board

    // var board = document.getElementsByTagName('tbody');
    // var rows = board[0].childNodes
    // var td = '';
    // for( var i = 0; i < rows.length; i++ ){
    //   td = rows[i].children
    //   for( var j = 0; j <  td.length; j++ ){
    //     td[j].addEventListener('click', function(){
    //       if( this.getAttribute('data-status') === 'dead' ){
    //         this.className = 'alive'
    //         this.setAttribute('data-status', 'alive');
    //       }else if( this.getAttribute('data-status') === 'alive' ){
    //         this.className = 'dead';
    //         this.setAttribute('data-status', 'dead');
    //       }
    //     })
    //   }
    // }

    var onCellClick = function (e) {
      // QUESTION TO ASK YOURSELF: What is "this" equal to here?
      // how to set the style of the cell when it's clicked
      if (this.getAttribute('data-status') == 'dead') {
        this.className = "alive";
        this.setAttribute('data-status', 'alive');
      } else {
        this.className = "dead";
        this.setAttribute('data-status', 'dead');
      }
    };

    this.forEachCell(function(cell, col, row){
      cell.addEventListener( 'click', onCellClick )
    })

    var clear = function(){
      gameOfLife.forEachCell(function(cell){
        cell.className = 'dead';
      })
    }

    var randomize = function(){
      gameOfLife.forEachCell(function(cell){
        var flip = Math.random() < 0.5 ? 0 : 1;
        if (flip) cell.className = 'alive'
        else cell.className = 'dead';
      })
    }

    var clearBtn = document.getElementById('clear_btn');
    clearBtn.addEventListener('click', clear);

    var randomBtn = document.getElementById('reset_btn');
    randomBtn.addEventListener('click', randomize);

    var stepBtn = document.getElementById('step_btn');
    stepBtn.addEventListener('click', gameOfLife.step);

    var playBtn = document.getElementById('play_btn');
    playBtn.addEventListener('click', gameOfLife.enableAutoPlay);

    var uploadBtn = document.getElementById('upload_btn');
    uploadBtn.addEventListener('click', gameOfLife.uploadPattern)
  },
  uploadPattern: function(){
    var arr = [];
    var index = 0;
    var temp = 0;

    gameOfLife.forEachCell(function(cell, i, j){
        if (j !== temp ) {
          index = 0;
          temp = j;
        }

        if( j % 3 === 0 ){
          arr = gameOfLife.pattern[0].split('');
        }else if( j % 3 === 1 ){
          arr = gameOfLife.pattern[1].split('');
        }else{
          arr = gameOfLife.pattern[2].split('');
        }

        if( index === arr.length ) index = 0;
        if( arr[index] === '.' ){
          cell.className = 'dead';
          cell.setAttribute( 'data-status', 'dead')
        }else{
          cell.className = 'alive';
          cell.setAttribute( 'data-status', 'alive')
        }
        index++;
    })
  },
  step: function () {
    // Here is where you want to loop through all the cells
    // on the board and determine, based on it's neighbors,
    // whether the cell should be dead or alive in the next
    // evolution of the game.
    //
    // You need to:
    // 1. Count alive neighbors for all cells
    // 2. Set the next state of all cells based on their alive neighbors
    var livesCount = {};

      function checkNeighbors(cell, i, j){

          var colRight = 0;
          var colLeft = 0;
          var rowUp = 0;
          var rowDown = 0;
          var liveNeighbors = 0;
          var td = '';
          var flagCol = false;
          var flagRow = false;

          //colRight-j; i-rowUp; colRight-rowUp
          if( i < gameOfLife.width - 1 ) {
            colRight = i + 1;
            td = document.getElementById(colRight + '-' + j);
            if( td.className === 'alive') liveNeighbors++;
          }

          if( j < gameOfLife.height - 1 ) {
            rowUp = j + 1;
            td = document.getElementById(i + '-' + rowUp);
            if( td.className === 'alive') liveNeighbors++;
          }

          if( colRight && rowUp ){
            td = document.getElementById(colRight + '-' + rowUp);
            if( td.className === 'alive') liveNeighbors++;
          }

          //colLeft-j; i-rowDown; colLeft-rowDown
          if( i > 0 ) {
            colLeft = i - 1;
            if (colLeft === 0) flagCol = true;
            td = document.getElementById(colLeft + '-' + j);
            if( td.className === 'alive') liveNeighbors++;
          }

          if( j > 0 ) {
            rowDown = j - 1;
            if (rowDown === 0) flagRow = true;
            td = document.getElementById(i + '-' + rowDown);
            if( td.className === 'alive') liveNeighbors++;
          }


          if( ( colLeft || flagCol ) && ( rowDown || flagRow ) ){
            td = document.getElementById(colLeft + '-' + rowDown);
            if( td.className === 'alive') liveNeighbors++;
          }

          //colRight-rowDown; colLeft-rowUp
          if( colRight && ( rowDown || flagRow ) ){
            td = document.getElementById(colRight + '-' + rowDown);
            if( td.className === 'alive') liveNeighbors++;
          }

          if( ( colLeft || flagCol ) && rowUp ){
            td = document.getElementById(colLeft + '-' + rowUp);
            if( td.className === 'alive') liveNeighbors++;
          }
          var key =  cell.id;
          livesCount[ key ] = liveNeighbors
      }

      gameOfLife.forEachCell(function(cell, i, j){
        checkNeighbors(cell, i, j);
      })

      gameOfLife.forEachCell(function(cell, i, j){
        var numLive = livesCount[i + '-' + j]

        if ( cell.className === 'alive' && ( numLive > 3 || numLive< 2) ){
          cell.className = 'dead';
          cell.setAttribute('data-status', 'dead');
        }else if ( cell.className === 'dead' && numLive === 3 ) {
          cell.className = 'alive';
          cell.setAttribute('data-status', 'alive');
        }
      })

  },

  enableAutoPlay: function () {
    // Start Auto-Play by running the 'step' function
    // automatically repeatedly every fixed time interval
    if(!this.stepInterval){
      this.stepInterval = setInterval(gameOfLife.step, 500)
    }else{
      clearInterval(this.stepInterval)
      this.stepInterval = null;
    }

  }

};

gameOfLife.createAndShowBoard();
