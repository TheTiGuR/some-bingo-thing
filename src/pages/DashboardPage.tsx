import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBoards } from '../contexts/BoardContext';
import BoardList from '../components/dashboard/BoardList';
import { toast } from 'react-toastify';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { boards, loading, loadBoards, duplicateBoard, archiveBoard, deleteUserBoard } = useBoards();
  const [showArchived, setShowArchived] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    loadBoards(showArchived);
  }, [user, showArchived, navigate, loadBoards]);
  
  const handleDuplicateBoard = async (id: string) => {
    try {
      const newBoardId = await duplicateBoard(id);
      toast.success('Board duplicated successfully!');
      navigate(`/board/${newBoardId}`);
    } catch (error) {
      toast.error('Failed to duplicate board');
      console.error('Error duplicating board:', error);
    }
  };
  
  const handleArchiveBoard = async (id: string, archive: boolean) => {
    try {
      await archiveBoard(id, archive);
    } catch (error) {
      toast.error(`Failed to ${archive ? 'archive' : 'unarchive'} board`);
      console.error(`Error ${archive ? 'archiving' : 'unarchiving'} board:`, error);
    }
  };
  
  const handleDeleteBoard = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this board? This action cannot be undone.');
    
    if (confirmed) {
      try {
        await deleteUserBoard(id);
      } catch (error) {
        toast.error('Failed to delete board');
        console.error('Error deleting board:', error);
      }
    }
  };
  
  const handleToggleArchived = () => {
    setShowArchived(!showArchived);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bingo Boards</h1>
        <p className="text-gray-600">Create, manage, and share your custom bingo boards</p>
      </div>
      
      <BoardList
        boards={boards}
        loading={loading}
        showArchived={showArchived}
        onToggleArchived={handleToggleArchived}
        onDuplicate={handleDuplicateBoard}
        onArchive={handleArchiveBoard}
        onDelete={handleDeleteBoard}
      />
    </div>
  );
};

export default DashboardPage;