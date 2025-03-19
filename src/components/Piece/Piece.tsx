import './Piece.scss';
import { Color, Piece as PieceType } from '@/enums';

type Props = {
  type: PieceType;
  color: Color;
};

export const Piece = ({ type, color }: Props) => {
  const imageSrc = `/${color}-${type}.png`;

  return (
    <div className="piece">
      <img className="piece__image" src={imageSrc} alt={`${color} ${type}`} />
    </div>
  );
};
