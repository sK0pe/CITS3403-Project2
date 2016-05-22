(function(){    // Make a private space

    /*--------------------------------------------------Constants*/
    var keyArray = {ESC: 27, SPACE: 32, W: 87, S: 83, A: 65, D: 68, ENTER: 13},
        directionArray = {UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3},
        canvas = document.getElementById("canvas"),
        ctx = canvas.getContext("2d"),
        previewCanvas = document.getElementById("previewCanvas"),
        previewctx = previewCanvas.getContext("2d"),
        WIDTH = 10,     // width in blocks
        HEIGHT = 20,    // height in blocks
        previewSize = 5,    //  size of preview pane in blocks
        timeToDrop = 0.6;  // time till block drops
    /*----------------------------------------------Game Variables*/
    var blockSize,      // pixel length or width of a block
        blockField,     // 2d array representing empty or full
        playerInputs,   // User input queue
        playing,        // bool to see if playing
        elapsedTime,    // keeps track of changes in time
        currBlock,      // current block
        nextBlock,      // next block
        score,          // current score
        tetris,         // if last clear was a tetris (4 blocks)
        paused;         // Boolean indicating pause state

    /*----------------------------------------------Tetrminos*/
    /*  A 16bit number is representing each of the 2d arrays that represent
    *   a rotation of the piece, 0, 90, 180, 270.  The 16 bit integer
    *   replaces the 4x4 bool array that would otherwise be used.*/

    var i = { size: 4, blocks: [0x0F00, 0x2222, 0x00F0, 0x4444], colour: 'cyan'   };
    var j = { size: 3, blocks: [0x44C0, 0x8E00, 0x6440, 0x0E20], colour: 'blue'   };
    var l = { size: 3, blocks: [0x4460, 0x0E80, 0xC440, 0x2E00], colour: 'orange' };
    var o = { size: 2, blocks: [0xCC00, 0xCC00, 0xCC00, 0xCC00], colour: 'yellow' };
    var s = { size: 3, blocks: [0x06C0, 0x8C40, 0x6C00, 0x4620], colour: 'green'  };
    var t = { size: 3, blocks: [0x0E40, 0x4C40, 0x4E00, 0x4640], colour: 'purple' };
    var z = { size: 3, blocks: [0x0C60, 0x4C80, 0xC600, 0x2640], colour: 'red'    };

    /*---------------------------------------------Logical Positions*/
    /*Use bit manipulations to iterate through the 16 bit integer
    * the piece's 4x4 array is proposed to be at coordinates(x,y), in rotate form
    * for specified tetromino, if valid, perform function f upon it.  Therefore
    * "f" is only activated upon valid blocks in the specified tetromino, in
    * its current rotateForm
    * */
    function checkBlocks(tetromino, x, y, rotateForm, f){
        var bit, row = 0, col = 0, shapeArray = tetromino.blocks[rotateForm];
        //  Iterate from top left to bottom right of 4x4 array
        for(bit = 0x8000; bit > 0; bit = bit >> 1){
            // if block is present at the shape being looked for
            if(shapeArray & bit){
                f(x + col, y + row);
            }
            ++col;
            if(col === 4){
                col = 0;
                ++row;
            }
        }
    }

    /*Check if proposed position IS NOT possible*/
    function impossibleMove(tetromino, x, y, rotateForm){
        var validation = false;
        checkBlocks(tetromino, x, y, rotateForm,
            function(x, y){
                if((x < 0) || (x >= WIDTH) || (y < 0) || y >= HEIGHT || getBlock(x,y)){
                    validation = true;
                }
            });
        return validation;
    }

    /*Check if proposed move IS possible*/
    function possibleMove(tetromino, x, y, rotateForm){
        return !impossibleMove(tetromino, x, y, rotateForm);
    }


    /*----------------------------------------------Generate Random tetromino*/
    //  This also implicitly defines a tetromino's properties
    // the type, state of rotation, x and y coordinate (col and row coordinate)
    function randomTetromino(){
        //  Get random piece from 0 - 6
        var shapes = [ i, j, l, o, s, t, z];
        var piece = Math.floor(Math.random()*7);
        var selection = shapes[piece];
        //  Return an array of the tetromino, in the 0 direction
        //  With x coordinate in the middle of the screen horizontal
        //  at the top.
        return { tetromino: selection,
                    rotateForm: directionArray.UP,
                        x: Math.round((WIDTH - selection.size)/2),
                            y: 0 };
    }


    /*-------------------------------------------------------Game Functions*/
    // Begin game
    function startPlaying(){
        document.getElementById("startBanner").style.visibility = "hidden";
        reset();
        playing = true;
        paused = false;
    }

    //  End game
    function endGame(){
        document.getElementById("startBanner").style.visibility ="visible";
        setScore(0);
        playing = false;
    }

    function setPauseState(){
        paused = !paused;
    }

    // Set Tetris boolean
    function setTetris(truthValue){
        tetris = truthValue;
    }

    // Get Tetris boolean
    function getTetris(){
        return tetris;
    }

    //  Set the score, if called without parameter score === 0
    function setScore(s){
        score = score + s || 0;
        redrawScore();
    }

    //  Get a block with null / false if it doesn't exist
    function getBlock(x, y){
        //  Check if tetris grid and row exist, return block space else null
        //  null evaluates to false
        return (blockField && blockField[x]) ? blockField[x][y] : null;
    }

    //  Setter for rows and blocks that are define or undefined
    function setBlock(x, y, tetromino){
        // If blockField[x] is undefined fill it with an empty array
        // If blockField[x] is defined, do not change the row
        blockField[x] = blockField[x] || [];
        //  At coordinates of confirmed existing line, place piece type
        blockField[x][y] = tetromino;
        // redraw canvas
        redrawBlockField();
    }

    // Clear tetris grid
    function clearBlockField(){
        blockField = [];
        redrawBlockField();
    }

    //  Set the current piece
    function setCurrBlock(piece){
        // If "piece" undefined then assign a new block as the current block
        currBlock = piece || randomTetromino();
        redrawBlockField();
    }

    //  Set the next piece
    function setNextBlock(piece){
        // If "piece" is undefined then assign a new block into nextBlock
        nextBlock = piece || randomTetromino();
        redrawPreview();
    }

    /*Set or Reset the game */
    function reset(){
        elapsedTime = 0;
        playerInputs = [];
        clearBlockField();
        setScore();
        setCurrBlock(nextBlock);
        setNextBlock();
    }

    /*Check if the next possible move is possible,
    if possible return true else return false*/
    function move(direction){
        var tempX = currBlock.x;
        var tempY = currBlock.y;
        switch(direction){
            case directionArray.LEFT:
                tempX -= 1;
                break;
            case directionArray.RIGHT:
                tempX += 1;
                break;
            case directionArray.DOWN:
                tempY += 1;
                break;
        }
        if(possibleMove(currBlock.tetromino, tempX, tempY, currBlock.rotateForm)){
            currBlock.x = tempX;
            currBlock.y = tempY;
            redrawBlockField();
            return true;
        }
        else{
            return false;
        }
    }

    /*Rotate the tetromino piece clockwise through the hardcoded states*/
    function rotate(){
        // If the tetromino is in its end state, the next state should be blocks[0]
        // otherwise it should just be the next one in the array of rotations
        var tempRotateForm = (currBlock.rotateForm == 3)? 0 : currBlock.rotateForm + 1;
        // Check if this next rotation would be valid, if so, rotate and redraw
        if(possibleMove(currBlock.tetromino, currBlock.x, currBlock.y, tempRotateForm)){
            currBlock.rotateForm = tempRotateForm;
            redrawBlockField();
        }
    }

    /*During update, move piece down during normal loop by 1 row*/
    function drop(){
        if(!move(directionArray.DOWN)){
            // If can't move down, add to the field of blocks
            // increment score
            setScore(10);
            addPiece();
            // remove lines
            clearLines();
            // inherit next block to current block
            setCurrBlock(nextBlock);
            // set the next block
            setNextBlock(randomTetromino());
            //  Clear player input queue
            playerInputs = [];
            //  Lose game if over flow on drops
            if(impossibleMove(currBlock.tetromino, currBlock.x, currBlock.y, currBlock.rotateForm)){
                endGame();
            }
        }
    }

    /*Execute User key presses*/
    function executeInput(input){
        switch(input){
            case directionArray.LEFT:
                move(directionArray.LEFT);
                break;
            case directionArray.RIGHT:
                move(directionArray.RIGHT);
                break;
            case directionArray.UP:
                rotate();
                break;
            case directionArray.DOWN:
                drop();
                break;
        }
    }

    /* Add piece to the field of block at the bottom of the grid by setting it
    *  uses helper function to apply only valid blocks in 4x4 array*/
    function addPiece(){
        checkBlocks(currBlock.tetromino, currBlock.x, currBlock.y, currBlock.rotateForm, function(x,y){
            setBlock(x, y, currBlock.tetromino);
        });
    }

    /*Delete row, bring blocks from above down 1 line*/
    function deleteRow(line){
        var col, row;
        for(row = line; row >= 0; --row){
            for(col = 0; col < WIDTH; ++col){
                if(row == 0){
                    //  Set null if on 0 line
                    setBlock(col, row, null);
                }
                else{
                    // set block from above
                    setBlock(col, row, getBlock(col, row-1));
                }
            }
        }
    }

    /*Clear and Score Lines*/
    function clearLines(){
        var row, col, isFullLine;
        var numberOfLines = 0;
        for(row = HEIGHT; row > 0; --row){
            isFullLine = true;
            for(col = 0; col < WIDTH; ++col){
                if(!getBlock(col, row)){
                    isFullLine = false;
                }
            }
            if(isFullLine){
                deleteRow(row);
                // recheck same line as blocks fall down into this vacated space
                row += 1;
                ++numberOfLines;
            }
        }
        //  Score increase for lines cleared
        switch(numberOfLines){
            case 0:
                break;
            case 1:
                setScore(100);
                setTetris(false);
                break;
            case 2:
                setScore(200);
                setTetris(false);
                break;
            case 3:
                setScore(400);
                setTetris(false);
                break;
            case 4:
                if(getTetris()){
                    // back to back tetris scores 1200
                    setScore(1200);
                }
                else{
                    setScore(800);
                    setTetris(true);
                }
                break;
        }
    }

    /*-------------------------------------------------------Event Listeners*/
    function resize(){
        canvas.width = canvas.clientWidth;  //  apply current HTML dimensions
        canvas.height = canvas.clientHeight;
        previewCanvas.height = previewCanvas.clientHeight;
        previewCanvas.width = previewCanvas.clientWidth;
        blockSize = canvas.height / HEIGHT;
        redrawBlockField();
        redrawPreview();
    }

    function keyDown(event){
        var preventDefault = false;
        if(playing && !paused){
            switch(event.keyCode){
                case keyArray.A:
                    playerInputs.push(directionArray.LEFT);
                    preventDefault = true;
                    break;
                case keyArray.D:
                    playerInputs.push(directionArray.RIGHT);
                    preventDefault = true;
                    break;
                case keyArray.W:
                    playerInputs.push(directionArray.UP);
                    preventDefault = true;
                    break;
                case keyArray.S:
                    playerInputs.push(directionArray.DOWN);
                    preventDefault = true;
                    break;
                case keyArray.ESC:
                    endGame();
                    preventDefault = true;
                    break;
                case keyArray.SPACE:
                    setPauseState();
                    preventDefault = true;
                    break;
            }
        }
        else{
            //  If not playing
            switch(event.keyCode){
                case keyArray.ENTER:
                    startPlaying();
                    preventDefault = true;
                    break;
                case keyArray.SPACE:
                    setPauseState();
                    preventDefault = true;
                    break;
            }
        }
        //  Prevent regular functions for keys when interacting with game
        if(preventDefault){
            event.preventDefault();
        }
    }
    /*-------------------------------------------------------Drawing Functions*/
    // redraw object
    var redraw = {};
    // implicit assignment of redraw child objects
    function redrawBlockField(){
        redraw.field = true;
    }
    function redrawPreview(){
        redraw.preview = true;
    }
    function redrawScore(){
        redraw.score = true;
    }


    /*Draw a Block*/
    function drawBlock(ctx, x, y, colour){
        ctx.fillStyle = colour;
        ctx.fillRect(x*blockSize, y*blockSize, blockSize, blockSize);
        ctx.strokeRect(x*blockSize, y*blockSize, blockSize, blockSize);
    }


    /*Draws a tetromino*/
    function drawTetromino(ctx, tetromino, x, y, rotateForm){
        checkBlocks(tetromino, x, y, rotateForm, function(x, y){
            drawBlock(ctx, x, y, tetromino.colour);
        });
    }


    /*Draw the entire block field based on current 2d array game state*/
    function drawField(){
        if(redraw.field){
            // clear entire canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if(playing){
                drawTetromino(ctx, currBlock.tetromino, currBlock.x, currBlock.y, currBlock.rotateForm);
            }
            var col, row, block;
            for(row = 0; row < HEIGHT; ++row){
                for(col = 0; col < WIDTH; ++col){
                    // If block exists, draw it
                    if(block = getBlock(col, row)){
                        drawBlock(ctx, col, row, block.colour);
                    }
                }
            }
            ctx.strokeRect(0, 0, WIDTH * blockSize - 1, HEIGHT*blockSize - 1);
            redraw.field = false;
        }
    }

    /*Draw the preview pane and the upcoming block*/
    function drawPreview(){
        if(redraw.preview){
            var pad = (previewSize - nextBlock.tetromino.size) / 2;
            previewctx.save();
            previewctx.strokeStyle = "rgb(255, 255, 255)";
            previewctx.translate(1,1);
            previewctx.clearRect(0, 0, previewSize*blockSize, previewSize*blockSize);
            drawTetromino(previewctx, nextBlock.tetromino, pad, pad, nextBlock.rotateForm);
            previewctx.strokeRect(0, 0, previewSize*blockSize-1, previewSize*blockSize-1);
            previewctx.restore();
            redraw.preview = false;
        }
    }

    /* Update the score*/
    function drawScore(){
        if(redraw.score){
            document.getElementById("score").innerHTML = String(score);
            redraw.score = false;
        }
    }

    /*Draw function*/
    function draw(){
        ctx.save(); // save context to stack
        ctx.strokeStyle = "rgb(255, 255, 255)";
        ctx.lineWidth = 1;
        ctx.translate(0.5, 0.5);
        drawField();
        drawPreview();
        drawScore();
        ctx.restore();  // pop context from stack
    }

    /*-------------------------------------------------------------Game Loop*/

    function runGame(){
        // Initialise event listeners check for events which may change game state
        document.addEventListener("keydown", keyDown, false);
        window.addEventListener("resize", resize, false);

        // Get time in milliseconds
        var start = new Date().getTime();

        //  Use request Animation frame, starts outside then runs
        //  recursively
        function drawLoop(){
            var current = new Date().getTime();
            // Find elapsed time in seconds
            elapsedTime = (current - start)/1000.0;
            if(playing && !paused){
                // do the next user input in queue
                executeInput(playerInputs.shift());
                if(elapsedTime > timeToDrop){
                    drop();  // Drop current Tetromino
                    start = new Date().getTime();
                }
            }
            draw();
            //  Ask for next frame
            requestAnimationFrame(drawLoop);
        }
        //  Resize before initiating loop
        resize();
        //  Reset game variables before initiating loop
        reset();
        //  Start animating
        drawLoop();
    }

    /*-------------------------------------------------------------Run Game*/
    runGame();

})();
             