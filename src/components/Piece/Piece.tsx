import './Piece.scss';

type Props = {
    type: 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
    color: 'white' | 'black';
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