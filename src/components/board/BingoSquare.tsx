import React, { useState, useEffect } from 'react';
import { BingoSquare as BingoSquareType } from '../../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface BingoSquareProps {
  square: BingoSquareType;
  index: number;
  editable: boolean;
  colorScheme: string;
  onUpdate?: (id: string, content: string) => void;
  centerImageUrl?: string;
}

const BingoSquare: React.FC<BingoSquareProps> = ({
  square,
  index,
  editable,
  colorScheme,
  onUpdate,
  centerImageUrl
}) => {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(square.content);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: square.id,
    disabled: !editable || square.isCenter
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
    cursor: editable && !square.isCenter ? 'grab' : 'default'
  };
  
  // Update local content when square content changes from parent
  useEffect(() => {
    setContent(square.content);
  }, [square.content]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value.slice(0, 50); // Limit to 50 characters
    setContent(newContent);
  };
  
  const handleBlur = () => {
    setEditing(false);
    if (onUpdate && content !== square.content) {
      onUpdate(square.id, content);
    }
  };
  
  const handleDoubleClick = () => {
    if (editable && !square.isCenter) {
      setEditing(true);
    }
  };
  
  const getBackgroundColor = () => {
    if (square.isCenter) return 'bg-white';
    
    switch (colorScheme) {
      case 'purple':
        return index % 2 === 0 ? 'bg-purple-50' : 'bg-purple-100';
      case 'teal':
        return index % 2 === 0 ? 'bg-teal-50' : 'bg-teal-100';
      case 'pink':
        return index % 2 === 0 ? 'bg-pink-50' : 'bg-pink-100';
      case 'amber':
        return index % 2 === 0 ? 'bg-amber-50' : 'bg-amber-100';
      case 'blue':
        return index % 2 === 0 ? 'bg-blue-50' : 'bg-blue-100';
      case 'green':
        return index % 2 === 0 ? 'bg-green-50' : 'bg-green-100';
      default:
        return index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100';
    }
  };
  
  const getBorderColor = () => {
    switch (colorScheme) {
      case 'purple': return 'border-purple-500';
      case 'teal': return 'border-teal-500';
      case 'pink': return 'border-pink-500';
      case 'amber': return 'border-amber-500';
      case 'blue': return 'border-blue-500';
      case 'green': return 'border-green-500';
      default: return 'border-gray-500';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(editable && !square.isCenter ? { ...attributes, ...listeners } : {})}
      className={`aspect-square border-2 ${getBorderColor()} ${getBackgroundColor()} p-1 flex items-center justify-center text-center rounded-md transition-all duration-200 select-none shadow-sm hover:shadow-md ${editable && !square.isCenter ? 'hover:scale-[1.02]' : ''}`}
      onDoubleClick={handleDoubleClick}
    >
      {editing ? (
        <textarea
          autoFocus
          value={content}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleBlur();
            }
          }}
          className="w-full h-full resize-none bg-white p-1 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={50}
        />
      ) : (
        <>
          {square.isCenter && centerImageUrl ? (
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
              <img 
                src={centerImageUrl} 
                alt="FREE" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            <p className="text-xs sm:text-sm font-medium break-words overflow-hidden">
              {content}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default BingoSquare;