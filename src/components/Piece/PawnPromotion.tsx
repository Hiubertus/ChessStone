import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { ChessPiece } from '@/types/ChessPiece';
import './PawnPromotiom.scss';

type PromotionProps = {
    position: { x: number, y: number };
    color: 'white' | 'black';
    onPromote: (pieceType: ChessPiece['type']) => void;
    isOpen: boolean;
    tileRef: HTMLElement | null;
};

export const PawnPromotion = ({ position, color, onPromote, isOpen, tileRef }: PromotionProps) => {
    if (!isOpen || !position || !color) return null;

    const promotionPieces: ChessPiece['type'][] = ['queen', 'rook', 'bishop', 'knight'];

    const handlePromote = (pieceType: ChessPiece['type']) => {
        onPromote(pieceType);
    };

    // Calculate position styles
    const getPortalStyles = () => {
        const promotionWidth = 240; // 4 pieces * 60px width

        // If we have a tile reference, use its actual position
        if (tileRef) {
            const tileRect = tileRef.getBoundingClientRect();
            const boardRect = tileRef.closest('.chess-board')?.getBoundingClientRect() || { left: 0, top: 0 };

            // Calculate relative position to the board
            const relLeft = tileRect.left - boardRect.left;
            const relTop = tileRect.top - boardRect.top;

            // Center the portal over the tile
            const leftPos = relLeft + (tileRect.width / 2) - (promotionWidth / 2);

            // Position above or below based on pawn's location
            const isTopHalf = position.y < 4;
            const topPos = isTopHalf
                ? relTop + tileRect.height // Below the pawn
                : relTop - 76; // Above the pawn (76px is the height of the promotion panel)

            return {
                position: 'absolute',
                left: `${leftPos}px`,
                top: `${topPos}px`,
                zIndex: 100,
            };
        } else {
            // Fallback to position calculation if no tile reference
            const tileSize = 60; // Size of a chess tile in pixels

            // Center the portal over the pawn
            const boardLeftPosition = (position.x * tileSize) - (promotionWidth / 2) + (tileSize / 2);

            // Position above or below based on pawn's location
            const isTopHalf = position.y < 4;
            const topPosition = isTopHalf
                ? (position.y + 1) * tileSize // Below the pawn
                : position.y * tileSize - 76; // Above the pawn

            return {
                position: 'absolute',
                left: `${boardLeftPosition}px`,
                top: `${topPosition}px`,
                zIndex: 100,
            };
        }
    };

    // Create the portal content
    const promotionPortal = (
        <div
            className="promotion-portal"
            style={getPortalStyles() as React.CSSProperties}
        >
            <div className="bg-white rounded-md shadow-lg p-2 flex gap-2">
                {promotionPieces.map((pieceType) => (
                    <Button
                        key={pieceType}
                        variant="outline"
                        className="w-12 h-12 p-0"
                        onClick={() => handlePromote(pieceType)}
                    >
                        <img
                            src={`/${color}-${pieceType}.png`}
                            alt={`${color} ${pieceType}`}
                            className="w-10 h-10"
                        />
                    </Button>
                ))}
            </div>
        </div>
    );

    // Get portal container or create it if it doesn't exist
    let portalContainer = document.getElementById('promotion-portal');
    if (!portalContainer) {
        portalContainer = document.createElement('div');
        portalContainer.id = 'promotion-portal';
        document.body.appendChild(portalContainer);
    }

    return createPortal(promotionPortal, portalContainer);
};