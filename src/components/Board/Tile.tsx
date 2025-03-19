import './Tile.scss';
import { Piece } from '@/components';
import { cn } from '@/lib/utils.ts';
import { ChessPiece, Position } from '@/types';

type Props = {
  position: Position;
  isLight: boolean;
  piece: ChessPiece | null;
  isSelected: boolean;
  isPossibleMove: boolean;
  isCheck?: boolean;
  isLastMoveFrom?: boolean;
  isLastMoveTo?: boolean;
  onClick: () => void;
};

export const Tile = ({
  position,
  isLight,
  piece,
  isSelected,
  isPossibleMove,
  isCheck = false,
  isLastMoveFrom = false,
  isLastMoveTo = false,
  onClick,
}: Props) => {
  const algebraicNotation = `${String.fromCharCode(97 + position.x)}${8 - position.y}`;

  const tileClasses = cn(
    'tile',
    isLight ? 'tile--light' : 'tile--dark',
    isSelected && 'tile--selected',
    isLastMoveFrom && 'tile--last-move-from',
    isLastMoveTo && 'tile--last-move-to',
    isCheck && 'tile--check',
  );

  const renderPiece = () => {
    if (!piece) return null;

    return <Piece type={piece.type} color={piece.color} />;
  };

  const renderMoveIndicator = () => {
    if (!isPossibleMove) return null;
    const indicatorClass = cn(
      piece
        ? 'tile__move-indicator tile__move-indicator--capture'
        : 'tile__move-indicator tile__move-indicator--move',
    );

    return <div className={indicatorClass}></div>;
  };

  const showNotation = position.y === 7 || position.x === 0;

  return (
    <div className={tileClasses} onClick={onClick} data-position={algebraicNotation}>
      {showNotation && (
        <>
          {position.y === 7 && (
            <div className="tile__notation tile__notation--file">{algebraicNotation[0]}</div>
          )}
          {position.x === 0 && (
            <div className="tile__notation tile__notation--rank">{algebraicNotation[1]}</div>
          )}
        </>
      )}

      {renderMoveIndicator()}
      {renderPiece()}
    </div>
  );
};
