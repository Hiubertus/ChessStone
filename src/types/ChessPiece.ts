export type ChessPiece = {
    id: string;
    type: 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
    color: 'white' | 'black';
    hasMoved: boolean;
}