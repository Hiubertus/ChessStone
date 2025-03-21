import { CSSProperties } from 'react';
import { createPortal } from 'react-dom';

import './PawnPromotiom.scss';
import { Button } from '@/components';
import { Color, Piece } from '@/enums';
import { ChessPiece, Position } from '@/types';

type PromotionProps = {
  position: Position;
  color: Color;
  onPromote: (pieceType: ChessPiece['type']) => void;
  isOpen: boolean;
};

export const PawnPromotion = ({ position, color, onPromote, isOpen }: PromotionProps) => {
  if (!isOpen || !position || !color) return null;

  const promotionPieces: ChessPiece['type'][] = [
    Piece.Queen,
    Piece.Rook,
    Piece.Bishop,
    Piece.Knight,
  ];

  const handlePromote = (pieceType: ChessPiece['type']) => {
    onPromote(pieceType);
  };

  const getPortalStyles = () => {
    const promotionWidth = 176;
    const promotionHeight = 64;

    if (!position) return {};

    const chessBoard = document.querySelector('.chess-board');
    if (!chessBoard) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const boardRect = chessBoard.getBoundingClientRect();
    const tileSize = boardRect.width / 8;

    const leftPos = boardRect.left + position.x * tileSize + tileSize / 2 - promotionWidth / 2;

    const isBlackPiece = color === Color.Black;
    const topPos = isBlackPiece
      ? boardRect.top + (position.y + 1) * tileSize
      : boardRect.top + position.y * tileSize - promotionHeight;

    return {
      position: 'fixed',
      left: `${leftPos}px`,
      top: `${topPos}px`,
      zIndex: 1000,
    };
  };

  const promotionPortal = (
    <div className="promotion-portal" style={getPortalStyles() as CSSProperties}>
      <div className="bg-white rounded-md shadow-lg p-2 flex gap-2">
        {promotionPieces.map(pieceType => (
          <Button
            key={pieceType}
            variant="outline"
            className="w-10 h-10 p-0"
            onClick={() => handlePromote(pieceType)}
          >
            <img
              src={`/${color}-${pieceType}.png`}
              alt={`${color} ${pieceType}`}
              className="w-8 h-8"
            />
          </Button>
        ))}
      </div>
    </div>
  );

  let portalContainer = document.getElementById('promotion-portal');
  if (!portalContainer) {
    portalContainer = document.createElement('div');
    portalContainer.id = 'promotion-portal';
    document.body.appendChild(portalContainer);
  }

  return createPortal(promotionPortal, portalContainer);
};
