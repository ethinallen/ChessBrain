
import _ from 'lodash';

//helper function to see if a square has black, white, or no piece
export function squareHasPiece(board, position){
  return board[position[0]][position[1]][0];
}

// the following functions are called in whiteLegalMove() depending on the piece
export function whiteKingLegalMove(board, initialPosition, finalPosition, auxBoardState){
  let whiteCanCastle = auxBoardState[0];

  if (_.isEqual(finalPosition, [7,6]) && _.isEqual(initialPosition, [7,4]) &&  whiteCanCastle){
    return (squareHasPiece(board, [7,5])=== 2) && (squareHasPiece(board, [7,6]) ===2);
  }else if (_.isEqual(finalPosition,[7,2]) && _.isEqual(initialPosition, [7,4]) && whiteCanCastle){
    return (squareHasPiece(board, [7,1]) === 2) &&
            (squareHasPiece(board, [7,2]) === 2) &&
            (squareHasPiece(board, [7,3]) === 2);
  }

  //main logic
  let result = false;
  let finalPositionIsPossible = (Math.abs(finalPosition[0]-initialPosition[0]) < 2 &&
                                  Math.abs(finalPosition[1]-initialPosition[1]) < 2);
  if (finalPositionIsPossible){
    result = (squareHasPiece(board, finalPosition) !== 0);
  }
  return result;
}

export function whitePawnLegalMove(board, initialPosition, finalPosition, auxBoardState) {
  let result = false;
  let intermediary = [initialPosition[0]-1, initialPosition[1]];

  // En Passant stuff
  if(_.isEqual(auxBoardState[3], [initialPosition[0],initialPosition[1]+1]) &&
      _.isEqual(finalPosition, [auxBoardState[3][0]-1,auxBoardState[3][1]])){
    // console.log("valid en passant");
    return true;
  }

  if(_.isEqual(auxBoardState[3], [initialPosition[0],initialPosition[1]-1]) &&
      _.isEqual(finalPosition, [auxBoardState[3][0]-1,auxBoardState[3][1]])){
    // console.log("valid en passant");
    return true;
  }

  if (_.isEqual([initialPosition[0]-2, initialPosition[1]], finalPosition)){
    result = squareHasPiece(board, intermediary) === 2 &&
    squareHasPiece(board, finalPosition) === 2 &&
    initialPosition[0] === 6;
  }
  if (_.isEqual([initialPosition[0]-1, initialPosition[1]], finalPosition)){
    result = squareHasPiece(board, finalPosition) === 2;
  }
  else if (_.isEqual([initialPosition[0]-1, initialPosition[1]+1], finalPosition)){
    result = squareHasPiece(board, finalPosition) === 1;
  }
  else if (_.isEqual([initialPosition[0]-1, initialPosition[1]-1], finalPosition)){
    result = squareHasPiece(board, finalPosition) === 1;
  }
  return result;
}

export function whiteKnightLegalMove(board, initialPosition, finalPosition){

  let finalPositionIsPossible =
  (_.isEqual([initialPosition[0]-1, initialPosition[1]+2], finalPosition)) ||
  (_.isEqual([initialPosition[0]-1, initialPosition[1]-2], finalPosition)) ||
  (_.isEqual([initialPosition[0]+1, initialPosition[1]+2], finalPosition)) ||
  (_.isEqual([initialPosition[0]+1, initialPosition[1]-2], finalPosition)) ||
  (_.isEqual([initialPosition[0]-2, initialPosition[1]+1], finalPosition)) ||
  (_.isEqual([initialPosition[0]-2, initialPosition[1]-1], finalPosition)) ||
  (_.isEqual([initialPosition[0]+2, initialPosition[1]+1], finalPosition)) ||
  (_.isEqual([initialPosition[0]+2, initialPosition[1]-1], finalPosition));

  let result = finalPositionIsPossible && (squareHasPiece(board, finalPosition)!==0);

  return result;
}

export function whiteBishopLegalMove(board, initialPosition, finalPosition){

  let finalPositionIsPossible =
  (finalPosition[0]-initialPosition[0]) === (finalPosition[1]-initialPosition[1]) ||
  (finalPosition[0]-initialPosition[0]) === (-1)*(finalPosition[1]-initialPosition[1]);
  if (!finalPositionIsPossible){return false}
  let rDirection = (finalPosition[0]-initialPosition[0])/Math.abs((finalPosition[0]-initialPosition[0]));
  let cDirection = (finalPosition[1]-initialPosition[1])/Math.abs((finalPosition[1]-initialPosition[1]));
  let noBlockingPiece = true;
  for (let i = 1; i<Math.abs(finalPosition[1]-initialPosition[1]); i++){
    if (squareHasPiece(
      board,
      [ initialPosition[0] + i*rDirection , initialPosition[1] + i*cDirection ])
      !== 2) {noBlockingPiece = false;}
  }

  let result = finalPositionIsPossible &&
    squareHasPiece(board,finalPosition)!==0&&
    noBlockingPiece;
  return result;
}

export function whiteRookLegalMove(board, initialPosition, finalPosition){
  let rDirection = 0;
  let cDirection = 0;

  if(!((finalPosition[0]-initialPosition[0] === 0) ||(finalPosition[1]-initialPosition[1] === 0))){
    return false;
  }

  if (finalPosition[0]-initialPosition[0]===0){
    if(finalPosition[1]-initialPosition[1]>0){
      cDirection = 1;
    }else{
      cDirection = -1;
    }
  }else{
    if(finalPosition[0]-initialPosition[0]>0){
      rDirection = 1;
    }else{
      rDirection = -1;
    }
  }

  let noBlockingPiece = true;


  if (rDirection !== 0){
    for (let i = 1; i<Math.abs(finalPosition[0]-initialPosition[0]); i++){
      if (squareHasPiece(
        board,
        [ initialPosition[0] + i*rDirection, initialPosition[1]])!== 2) {
          noBlockingPiece = false;
      }
    }
  }else{
    for (let i = 1; i<Math.abs(finalPosition[1]-initialPosition[1]); i++){
      if (squareHasPiece(
        board,
        [ initialPosition[0], initialPosition[1]+i*cDirection])!== 2) {
          noBlockingPiece = false;
      }
    }
  }

  let result =
    squareHasPiece(board,finalPosition)!==0&&
    noBlockingPiece;
  return result;
}

//called in legalMove() if the piece being evaluated is white
export function whiteLegalMove(board, piece, initialPosition, finalPosition, auxBoardState){
  let result = false;
  if (piece === 1) result = whitePawnLegalMove(board, initialPosition, finalPosition, auxBoardState)
  else if (piece === 3) result = whiteKnightLegalMove(board, initialPosition, finalPosition)
  else if (piece === 4) result = whiteBishopLegalMove(board, initialPosition, finalPosition)
  else if (piece === 5) result = whiteRookLegalMove(board, initialPosition, finalPosition)
  else if (piece === 9) {
    result =  whiteRookLegalMove(board, initialPosition, finalPosition) ||
    whiteBishopLegalMove(board, initialPosition, finalPosition);
  }else if (piece === 10){
    result = whiteKingLegalMove(board, initialPosition, finalPosition, auxBoardState);
  }
  return result;
}

//the following functions are called in blackLegalMove() depending on the piece
export function blackKingLegalMove(board, initialPosition, finalPosition, auxBoardState){

  let blackCanCastle = auxBoardState[1];
  //seperate logic for castling
  if (_.isEqual(finalPosition, [0,6]) && _.isEqual(initialPosition, [0,4]) && blackCanCastle){
    // console.log("in correct conditional");
    return (squareHasPiece(board, [0,5])=== 2) && (squareHasPiece(board, [0,6]) ===2);
  }else if (_.isEqual(finalPosition, [0,2]) && _.isEqual(initialPosition, [0,4]) && blackCanCastle){
    return (squareHasPiece(board, [0,1]) === 2) &&
            (squareHasPiece(board, [0,2]) === 2) &&
            (squareHasPiece(board, [0,3]) === 2);
  }

  // main logic
  let result = false;
  let finalPositionIsPossible = (Math.abs(finalPosition[0]-initialPosition[0]) < 2 &&
                                  Math.abs(finalPosition[1]-initialPosition[1]) < 2);
  if (finalPositionIsPossible){
    result = (squareHasPiece(board, finalPosition) !== 1);
  }
  return result;
}

export function blackPawnLegalMove(board, initialPosition, finalPosition, auxBoardState) {

  let result = false;
  let intermediary = [initialPosition[0]+1, initialPosition[1]];

  if(_.isEqual(auxBoardState[3], [initialPosition[0],initialPosition[1]+1]) &&
      _.isEqual(finalPosition, [auxBoardState[3][0]+1,auxBoardState[3][1]])){
    // console.log("valid en passant");
    return true;
  }

  if(_.isEqual(auxBoardState[3], [initialPosition[0],initialPosition[1]-1]) &&
      _.isEqual(finalPosition, [auxBoardState[3][0]+1,auxBoardState[3][1]])){
    // console.log("valid en passant");
    return true;
  }

  if (_.isEqual([initialPosition[0]+2, initialPosition[1]], finalPosition)){
    result = squareHasPiece(board, intermediary) === 2 &&
    squareHasPiece(board, finalPosition) === 2 &&
    initialPosition[0] === 1;
  }
  if (_.isEqual([initialPosition[0]+1, initialPosition[1]], finalPosition)){
    result = squareHasPiece(board, finalPosition) === 2;
  }
  else if (_.isEqual([initialPosition[0]+1, initialPosition[1]+1], finalPosition)){
    result = squareHasPiece(board, finalPosition) === 0;
  }
  else if (_.isEqual([initialPosition[0]+1, initialPosition[1]-1], finalPosition)){
    result = squareHasPiece(board, finalPosition) === 0;
  }
  return result;
}

export function blackKnightLegalMove(board, initialPosition, finalPosition){

  let finalPositionIsPossible =
  (_.isEqual([initialPosition[0]-1, initialPosition[1]+2], finalPosition)) ||
  (_.isEqual([initialPosition[0]-1, initialPosition[1]-2], finalPosition)) ||
  (_.isEqual([initialPosition[0]+1, initialPosition[1]+2], finalPosition)) ||
  (_.isEqual([initialPosition[0]+1, initialPosition[1]-2], finalPosition)) ||
  (_.isEqual([initialPosition[0]-2, initialPosition[1]+1], finalPosition)) ||
  (_.isEqual([initialPosition[0]-2, initialPosition[1]-1], finalPosition)) ||
  (_.isEqual([initialPosition[0]+2, initialPosition[1]+1], finalPosition)) ||
  (_.isEqual([initialPosition[0]+2, initialPosition[1]-1], finalPosition));

  let result = finalPositionIsPossible && (squareHasPiece(board, finalPosition)!==1);

  return result;
}

export function blackBishopLegalMove(board, initialPosition, finalPosition){

  let finalPositionIsPossible =
  (finalPosition[0]-initialPosition[0]) === (finalPosition[1]-initialPosition[1]) ||
  (finalPosition[0]-initialPosition[0]) === (-1)*(finalPosition[1]-initialPosition[1]);
  if (!finalPositionIsPossible){return false}
  let rDirection = (finalPosition[0]-initialPosition[0])/Math.abs((finalPosition[0]-initialPosition[0]));
  let cDirection = (finalPosition[1]-initialPosition[1])/Math.abs((finalPosition[1]-initialPosition[1]));
  let noBlockingPiece = true;
  for (let i = 1; i<Math.abs(finalPosition[1]-initialPosition[1]); i++){
    if (squareHasPiece(
      board,
      [ initialPosition[0] + i*rDirection , initialPosition[1] + i*cDirection ])
      !== 2) {noBlockingPiece = false;}
  }

  let result = finalPositionIsPossible &&
    squareHasPiece(board,finalPosition)!==1&&
    noBlockingPiece;
  return result;
}

export function blackRookLegalMove(board, initialPosition, finalPosition){
  let rDirection = 0;
  let cDirection = 0;

  if(!((finalPosition[0]-initialPosition[0] === 0) ||(finalPosition[1]-initialPosition[1] === 0))){
    return false;
  }

  if (finalPosition[0]-initialPosition[0]===0){
    if(finalPosition[1]-initialPosition[1]>0){
      cDirection = 1;
    }else{
      cDirection = -1;
    }
  }else{
    if(finalPosition[0]-initialPosition[0]>0){
      rDirection = 1;
    }else{
      rDirection = -1;
    }
  }
  let noBlockingPiece = true;

  if (rDirection !== 0){
    for (let i = 1; i<Math.abs(finalPosition[0]-initialPosition[0]); i++){
      if (squareHasPiece(
        board,
        [ initialPosition[0] + i*rDirection, initialPosition[1]])!== 2) {
          noBlockingPiece = false;
      }
    }
  }else{
    for (let i = 1; i<Math.abs(finalPosition[1]-initialPosition[1]); i++){
      if (squareHasPiece(
        board,
        [ initialPosition[0], initialPosition[1]+i*cDirection])!== 2) {
          noBlockingPiece = false;
      }
    }
  }

  let result =
    squareHasPiece(board,finalPosition)!==1&&
    noBlockingPiece;
  return result;
}

//is called in legal move if the piece being evaluated is black
export function blackLegalMove(board, piece, initialPosition, finalPosition, auxBoardState){
  let result = false;
  if (piece === 1) result = blackPawnLegalMove(board, initialPosition, finalPosition, auxBoardState)
  else if (piece === 3) result = blackKnightLegalMove(board, initialPosition, finalPosition)
  else if (piece === 4) result = blackBishopLegalMove(board, initialPosition, finalPosition)
  else if (piece === 5) result = blackRookLegalMove(board, initialPosition, finalPosition)
  else if (piece === 9) {
    result =  blackRookLegalMove(board, initialPosition, finalPosition) ||
    blackBishopLegalMove(board, initialPosition, finalPosition);
  }else if (piece === 10){
    result = blackKingLegalMove(board, initialPosition, finalPosition, auxBoardState);
  }
  return result;
}

//checks if a move is legal
export function legalMove(board, piece, color, initialPosition, finalPosition, auxBoardState){
  let result = false;
  if (color === 0){
    result = whiteLegalMove(board, piece, initialPosition, finalPosition, auxBoardState);
  }else if (color === 1){
    result = blackLegalMove(board, piece, initialPosition, finalPosition, auxBoardState);
  }
  return result && auxBoardState[2]===color;
}

export function isWhiteKingInCheck(board, auxBoardState) {

  let kingCoordinates = [-1,-1]
  for (let i=0; i<8; i++){
    for(let j=0; j<8; j++){
      if (_.isEqual(board[i][j], [0,10])){
        kingCoordinates = [i,j];
      }
    }
  }

  if (_.isEqual(kingCoordinates,[-1,-1])){
    return false;
  }

  let kingInCheck = false;
  for (let i=0; i<8; i++){
    for(let j=0; j<8; j++){
      if (board[i][j][0]===1){
        kingInCheck = blackLegalMove(board, board[i][j][1], [i,j], kingCoordinates, auxBoardState);
        if (kingInCheck){
          // console.log("white king is in check");
          return true;
        }
      }
    }
  }
  return kingInCheck;
}

export function isBlackKingInCheck(board, auxBoardState) {

  let kingCoordinates = [-1,-1]
  for (let i=0; i<8; i++){
    for(let j=0; j<8; j++){
      if (_.isEqual(board[i][j], [1,10])){
        kingCoordinates = [i,j];
      }
    }
  }

  if (_.isEqual(kingCoordinates,[-1,-1])){
    return false;
  }

  let kingInCheck = false;
  for (let i=0; i<8; i++){
    for(let j=0; j<8; j++){
      if (board[i][j][0]===0){
        kingInCheck = whiteLegalMove(board, board[i][j][1], [i,j],kingCoordinates, auxBoardState);
        if (kingInCheck){
          // .log("black king is in check");
          return true;
        }
      }
    }
  }
  return kingInCheck;
}
