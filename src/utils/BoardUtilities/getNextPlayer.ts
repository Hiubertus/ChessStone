export const getNextPlayer = (currentPlayer: 'white' | 'black'): 'white' | 'black' => {
    return currentPlayer === 'white' ? 'black' : 'white';
};