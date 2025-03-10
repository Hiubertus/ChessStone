import { Piece } from '../Piece/Piece';
import { ChessTile } from '@/types/ChessTile';
import './Tile.scss';

export const Tile = ({
                         position,
                         isLight,
                         piece,
                         isSelected,
                         isPossibleMove,
                         isCheck = false,
                         onClick
                     }: ChessTile) => {
    const algebraicNotation = `${String.fromCharCode(97 + position.x)}${8 - position.y}`;

    // Generate class names
    const tileClasses = [
        'tile',
        isLight ? 'tile--light' : 'tile--dark',
        isSelected ? 'tile--selected' : '',
        isPossibleMove ? 'tile--possible-move' : '',
        isCheck ? 'tile--check' : ''
    ].filter(Boolean).join(' ');

    const renderPiece = () => {
        if (!piece) return null;

        return (
            <Piece
                type={piece.type}
                color={piece.color}
            />
        );
    };

    const showNotation = (position.y === 7 || position.x === 0);

    return (
        <div
            className={tileClasses}
            onClick={onClick}
            data-position={algebraicNotation}
        >
            {/* Notacja algebraiczna */}
            {showNotation && (
                <>
                    {position.y === 7 && (
                        <div className="tile__notation tile__notation--file">
                            {algebraicNotation[0]}
                        </div>
                    )}
                    {position.x === 0 && (
                        <div className="tile__notation tile__notation--rank">
                            {algebraicNotation[1]}
                        </div>
                    )}
                </>
            )}

            {renderPiece()}
        </div>
    );
};