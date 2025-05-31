import React from 'react';
import { BingoBoard } from '../../types';
import { Edit, Copy, Archive, Trash2, Share2, ArrowUpFromLine } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BoardCardProps {
  board: BingoBoard;
  onDuplicate: (id: string) => void;
  onArchive: (id: string, archive: boolean) => void;
  onDelete: (id: string) => void;
}

const BoardCard: React.FC<BoardCardProps> = ({
  board,
  onDuplicate,
  onArchive,
  onDelete
}) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };
  
  const getBorderColor = () => {
    switch (board.colorScheme) {
      case 'purple': return 'border-purple-400';
      case 'teal': return 'border-teal-400';
      case 'pink': return 'border-pink-400';
      case 'amber': return 'border-amber-400';
      case 'blue': return 'border-blue-400';
      case 'green': return 'border-green-400';
      default: return 'border-gray-400';
    }
  };
  
  const getHeaderColor = () => {
    switch (board.colorScheme) {
      case 'purple': return 'bg-purple-500';
      case 'teal': return 'bg-teal-500';
      case 'pink': return 'bg-pink-500';
      case 'amber': return 'bg-amber-500';
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`rounded-lg shadow-md border-2 ${getBorderColor()} overflow-hidden bg-white hover:shadow-lg transition-shadow duration-200 ${board.isArchived ? 'opacity-70' : ''}`}>
      <div className={`${getHeaderColor()} text-white p-3`}>
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg truncate">{board.title}</h3>
          {board.isArchived && (
            <span className="text-xs bg-gray-800 text-white px-2 py-1 rounded-full">
              Archived
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-2 h-10 overflow-hidden">
          {board.description || 'No description'}
        </p>
        
        <div className="text-xs text-gray-500 mb-3">
          <p>Created: {formatDate(board.createdAt)}</p>
          <p>Last updated: {formatDate(board.updatedAt)}</p>
        </div>
        
        <div className="grid grid-cols-5 gap-1 w-full aspect-square mb-4">
          {Array.from({ length: 25 }).map((_, index) => {
            const square = board.squares[index];
            const isCenter = index === 12;
            const bgColor = getBgColor(board.colorScheme, index);
            
            return (
              <div
                key={index}
                className={`${bgColor} border ${getBorderColor()} rounded-sm flex items-center justify-center overflow-hidden`}
              >
                {isCenter && board.centerImageUrl ? (
                  <div className="w-full h-full bg-gray-100"></div>
                ) : (
                  <span className="text-[6px] font-medium truncate">
                    {square?.content.substring(0, 8) || ''}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="flex flex-wrap gap-2 text-sm">
          <Link
            to={`/board/${board.id}`}
            className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
          >
            <Edit size={14} /> Edit
          </Link>
          
          <button
            onClick={() => onDuplicate(board.id)}
            className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors"
          >
            <Copy size={14} /> Duplicate
          </button>
          
          {board.isArchived ? (
            <button
              onClick={() => onArchive(board.id, false)}
              className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-600 rounded-md hover:bg-amber-200 transition-colors"
            >
              <ArrowUpFromLine size={14} /> Unarchive
            </button>
          ) : (
            <button
              onClick={() => onArchive(board.id, true)}
              className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
            >
              <Archive size={14} /> Archive
            </button>
          )}
          
          <Link
            to={`/board/share/${board.id}`}
            className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-600 rounded-md hover:bg-purple-200 transition-colors"
          >
            <Share2 size={14} /> Share
          </Link>
          
          <button
            onClick={() => onDelete(board.id)}
            className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to get background color
const getBgColor = (colorScheme: string, index: number) => {
  const isEven = index % 2 === 0;
  
  switch (colorScheme) {
    case 'purple': return isEven ? 'bg-purple-50' : 'bg-purple-100';
    case 'teal': return isEven ? 'bg-teal-50' : 'bg-teal-100';
    case 'pink': return isEven ? 'bg-pink-50' : 'bg-pink-100';
    case 'amber': return isEven ? 'bg-amber-50' : 'bg-amber-100';
    case 'blue': return isEven ? 'bg-blue-50' : 'bg-blue-100';
    case 'green': return isEven ? 'bg-green-50' : 'bg-green-100';
    default: return isEven ? 'bg-gray-50' : 'bg-gray-100';
  }
};

export default BoardCard;