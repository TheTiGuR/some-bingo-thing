import React from 'react';
import { BingoBoard as BingoBoardType, BingoSquare as BingoSquareType } from '../../types';
import BingoSquare from './BingoSquare';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';

interface BingoBoardProps {
  board: BingoBoardType;
  editable?: boolean;
  onUpdateSquares?: (squares: BingoSquareType[]) => void;
}

const BingoBoard: React.FC<BingoBoardProps> = ({
  board,
  editable = false,
  onUpdateSquares
}) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeIndex = board.squares.findIndex(square => square.id === active.id);
      const overIndex = board.squares.findIndex(square => square.id === over.id);
      
      // Don't allow moving to/from the center position
      const centerIndex = board.squares.findIndex(square => square.isCenter);
      if (activeIndex === centerIndex || overIndex === centerIndex) {
        return;
      }
      
      const newSquares = arrayMove(board.squares, activeIndex, overIndex);
      
      if (onUpdateSquares) {
        onUpdateSquares(newSquares);
      }
    }
  };
  
  const handleUpdateSquare = (id: string, content: string) => {
    if (!onUpdateSquares) return;
    
    const newSquares = board.squares.map(square => 
      square.id === id ? { ...square, content } : square
    );
    
    onUpdateSquares(newSquares);
  };
  
  const getHeaderBgColor = () => {
    switch (board.colorScheme) {
      case 'purple': return 'bg-purple-600';
      case 'teal': return 'bg-teal-600';
      case 'pink': return 'bg-pink-600';
      case 'amber': return 'bg-amber-600';
      case 'blue': return 'bg-blue-600';
      case 'green': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Board Header */}
      <div className={`${getHeaderBgColor()} text-white p-4 text-center`}>
        {board.headerImageUrl ? (
          <div className="mb-2 flex justify-center">
            <img
              src={board.headerImageUrl}
              alt="Board Header"
              className="max-h-32 rounded-md object-contain"
            />
          </div>
        ) : null}
        <h2 className="text-xl md:text-2xl font-bold">{board.title}</h2>
        {board.description && (
          <p className="text-sm opacity-90 mt-1">{board.description}</p>
        )}
      </div>
      
      {/* Bingo Grid */}
      <div className="p-4">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={board.squares.map(square => square.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-5 gap-2">
              {board.squares.map((square, index) => (
                <BingoSquare
                  key={square.id}
                  square={square}
                  index={index}
                  editable={editable}
                  colorScheme={board.colorScheme}
                  onUpdate={handleUpdateSquare}
                  centerImageUrl={square.isCenter ? board.centerImageUrl : undefined}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      
      {/* Board Footer */}
      {board.footerImageUrl && (
        <div className={`${getHeaderBgColor()} p-4 flex justify-center`}>
          <img
            src={board.footerImageUrl}
            alt="Board Footer"
            className="max-h-24 rounded-md object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default BingoBoard;