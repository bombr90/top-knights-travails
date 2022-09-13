const container = document.getElementById('container');
const board = (() => {
  const knight = document.createElement('img');
  knight.src = './knight.svg'
  knight.id = 'knight';
  const nextMoveOffsets = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
  const prevMoves = [];
  const visited = Array(8).fill().map(()=>Array(8).fill(false));

  console.log('prevmoves',prevMoves)

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

  const renderKnight = ([x,y]) => {
    const targetSquare = document.querySelector(`.square[data-x='${x}'][data-y='${y}']`);
    targetSquare.replaceChildren(knight)
  }

  function renderBullet([x,y] = []) {
  const targetSquare = document.querySelector(`.square[data-x='${x}'][data-y='${y}']`);
  if(!targetSquare) {
    console.log('renderbullet fail');
    return
  };
  targetSquare.innerHTML='&#8226';
}

  const nextMove = ([x, y] = []) => {
    const potentialMoves = [];
    const currLoc = [
      x || knight.parentNode.dataset.x,
      y || knight.parentNode.dataset.y,
    ]
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
      }
    });
    // potentialMoves.forEach(renderBullet);
    return potentialMoves;
  };

  const knightMoves = ([xInit,yInit], [xDest,yDest]) => {
    const queue = [[xInit,yInit]]
    visited[xInit][yInit] = true;
    while(queue.length<10) {
      const currPos = queue.shift();
      if(currPos.join()===[xDest,yDest].join()) {
        console.log('success')
        break
      }
      queue.push(...nextMove(currPos));
      prevMoves.push(currPos);
      console.table('queue1,prevMoves',queue, prevMoves)
    }
    
    const currPos = [xDest,yDest];
    const path = [];

    // while(currPos.join() !== [xInit,yInit].join()) {
    //   path.unshift(currPos)
    //   currPos 
    // }
    // path.unshift([xInit,yInit])

    console.table('prevMoves moveCount:',prevMoves);
    return path
  }

  return {
    renderKnight,
    nextMove,
    knightMoves,
    renderBullet,
  }
})()

// drivercode
board.renderKnight([4, 3]);
// board.nextMove([4,3]);
board.knightMoves([4,3],[3,5]);



