// DOM elements
const container = document.getElementById('container');
const submit = document.getElementById('submit');
const reset = document.getElementById('reset');
const guiDisplay = document.getElementById('guiDisplay');
const inputFields = document.querySelectorAll('.coordinate');
// Attach Event Listeners
submit.addEventListener('click', showPath);
reset.addEventListener('click', resetBoard);

function showPath() {
  const xStart = +inputFields[0].value;
  const yStart = +inputFields[1].value;
  const xEnd = +inputFields[2].value;
  const yEnd = +inputFields[3].value;
  if( xStart >= 0 && xStart <= 7 &&
      yStart >= 0 && yStart <= 7 &&
      xEnd >= 0 && xEnd <= 7 &&
      yEnd >= 0 && yEnd <= 7) {
        board.reset();
        const path = board.knightMoves([xStart,yStart], [xEnd,yEnd]);
        console.log(`The path from (${xStart},${yStart}) to (${xEnd},${yEnd}) was completed in ${path.length -1} moves`);
        guiDisplay.textContent = `The path from (${xStart},${yStart}) to (${xEnd},${yEnd}) was completed in ${path.length-1} moves: \r\n`;
        let moveCount = 0;
        path.forEach(coordinate => {
          board.renderNumber(moveCount, coordinate.split(','));
          let text = document.createTextNode(`(${coordinate}), `);
          guiDisplay.appendChild(text);
          moveCount++;  
        });
        board.renderKnight([xStart, yStart]);
        console.table(path);
        return;
      }
      guiDisplay.textContent = "input values outside 0-7, try again";
      console.log('input values outside 0-7')
      return;
}

function resetBoard() {
  inputFields.forEach(input => {
    input.value = '';
  })
  guiDisplay.textContent = 'Enter Start and End coordinates then click Submit';
  board.reset();
}

const board = (() => {
  const knight = document.createElement('img');
  knight.src = './knight.svg'
  knight.id = 'knight';
  const nextMoveOffsets = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
  const prevMoves = [];
  const visited = Array(8).fill().map(()=>Array(8).fill(false));

  // GUI functions
  const initBoard = (() => {
    let board = document.createElement('div');
    board.id = 'board';
    for(let i = 7; i >= 0; i--) {
      for(let j = 0; j < 8; j++) {
        let square = document.createElement('div');
        square.classList.add('square');
        square.dataset.x = j;
        square.dataset.y = i;
        square.textContent=`x:${j}, y:${i}`;
        board.appendChild(square);
      }
    }
    container.appendChild(board);
  })();

  const reset = () => {
    const squares = document.querySelectorAll('.square')
    squares.forEach(square => {
      let x = square.dataset.x;
      let y = square.dataset.y; 
      square.textContent = `x:${x}, y:${y}`;
    })
  }

  const renderKnight = ([x,y]) => {
    const targetSquare = document.querySelector(`.square[data-x='${x}'][data-y='${y}']`);
    if(!targetSquare) {
      console.log('renderknight fail');
      return
    }
    targetSquare.replaceChildren(knight);
  }

  const renderNumber = (num, [x,y]) => {
    const targetSquare = document.querySelector(
      `.square[data-x='${x}'][data-y='${y}']`
    );
    if (!targetSquare) {
      console.log("renderNumber fail");
      console.log(typeof x, x, typeof y, y);
      return;
    }
    targetSquare.textContent=`${num}`;
  };

  function renderBullet([x,y] = []) {
  const targetSquare = document.querySelector(`.square[data-x='${x}'][data-y='${y}']`);
  if(!targetSquare) {
    console.log('renderbullet fail');
    return
  };
  targetSquare.innerHTML='&#8226';
}
// Utility functions
  const nextMove = ([x,y]) => {
    const potentialMoves = [];
    const currLoc = [x,y];
    nextMoveOffsets.forEach((offset) => {
      const newX = currLoc[0] + offset[0];
      const newY = currLoc[1] + offset[1];
      if (
        newX >= 0 && newX <= 7 &&
        newY >= 0 && newY <= 7 &&
        !visited[newX][newY]
      ) {
        visited[newX][newY] = true;
        potentialMoves.push([
          newX, 
          newY,
        ]);
        prevMoves.push([[newX,newY],currLoc]);
      }
    });
    return potentialMoves;
  };

  const createCol = (arr, n) => arr.map(x => x[n].join());
  
  // main knights travails algorithm
  const knightMoves = ([xInit,yInit],[xDest,yDest]) => {
    const queue = [[xInit,yInit]]
    visited[xInit][yInit] = true;
    while(queue.length) {
      if(queue.length>=64){
        console.log('queue overflow (>64 squares)...exiting')
        console.table('queue',queue)
        break;
      };
      const currPos = queue.shift();
      if(currPos.join()===[xDest,yDest].join()) {
        console.log('success')
        break
      }
      queue.push(...nextMove(currPos));
    }
    
    // backtrace once solution found
    const path = [];
    const currMoveCol = createCol(prevMoves, 0);
    const prevMoveCol = createCol(prevMoves, 1);
    path.unshift([xDest,yDest].join());
    let loopcount = 0; // to avoid infinite loop
    let currPos = [xDest, yDest].join();

  while (currPos !== [xInit, yInit].join()) {  
    let prevMoveIndex = currMoveCol.indexOf(currPos);
    currPos=(prevMoveCol[prevMoveIndex]);
    path.unshift(currPos);
    loopcount++;
    if (loopcount >= 64) {
      console.log('path exceeded 64 squares...exiting...')
      break;
    }
  }
  console.log('Knights Path:');
  console.table(path);
  return path
  }

  return {
    renderKnight,
    renderNumber,
    nextMove,
    knightMoves,
    reset,
    // renderBullet,
  }
})()

