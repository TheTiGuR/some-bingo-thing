import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBoards } from '../contexts/BoardContext';
import BingoBoard from '../components/board/BingoBoard';
import { ArrowLeft, Grid } from 'lucide-react';

const BoardViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentBoard, loading, loadBoard } = useBoards();
  
  useEffect(() => {
    if (id) {
      loadBoard(id);
    }
  }, [id, loadBoard]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
  }
  
  if (!currentBoard) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <p className="text-lg text-gray-700 mb-4">Board not found.</p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <Grid className="h-5 w-5 mr-1" />
          BingoCreator
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <BingoBoard board={currentBoard} />
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Want to create your own bingo board?{' '}
          <Link to="/" className="text-purple-600 font-medium">
            Visit BingoCreator
          </Link>
        </p>
      </div>
    </div>
  );
};

export default BoardViewPage;