import React, { useState } from 'react';
import { BingoBoard, BoardView } from '../../types';
import BoardCard from './BoardCard';
import { Grid, List, Search, ArchiveRestore, FilePlus2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BoardListProps {
  boards: BingoBoard[];
  loading: boolean;
  showArchived: boolean;
  onToggleArchived: () => void;
  onDuplicate: (id: string) => void;
  onArchive: (id: string, archive: boolean) => void;
  onDelete: (id: string) => void;
}

const BoardList: React.FC<BoardListProps> = ({
  boards,
  loading,
  showArchived,
  onToggleArchived,
  onDuplicate,
  onArchive,
  onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<BoardView>('grid');
  
  const filteredBoards = boards.filter(board => 
    board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    board.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search boards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleArchived}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
              showArchived ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <ArchiveRestore size={18} />
            <span className="hidden sm:inline">{showArchived ? 'Hide Archived' : 'Show Archived'}</span>
          </button>
          
          <div className="flex items-center bg-gray-100 rounded-md overflow-hidden">
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 ${view === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-600'}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 ${view === 'list' ? 'bg-purple-500 text-white' : 'text-gray-600'}`}
            >
              <List size={18} />
            </button>
          </div>
          
          <Link
            to="/board/new"
            className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <FilePlus2 size={18} />
            <span className="hidden sm:inline">New Board</span>
          </Link>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
        </div>
      ) : filteredBoards.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-500 mb-4">No boards found</p>
          <Link
            to="/board/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <FilePlus2 size={18} />
            Create Your First Board
          </Link>
        </div>
      ) : (
        <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredBoards.map(board => (
            <BoardCard
              key={board.id}
              board={board}
              onDuplicate={onDuplicate}
              onArchive={onArchive}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardList;