import './Piece.scss';
import {Piece as PieceType} from "@/enums/Piece.ts";
import {Color} from "@/enums/Color.ts";

type Props = {
    type: PieceType;
    color: Color;
}

export const Piece = ({ type, color }: Props) => {
    const imageSrc = `/${color}-${type}.png`;

    return (
        <div className="piece">
            <img
                className="piece__image"
                src={imageSrc}
                alt={`${color} ${type}`}
            />
        </div>
    );
};