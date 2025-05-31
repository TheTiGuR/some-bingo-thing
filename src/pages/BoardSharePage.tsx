import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBoards } from '../contexts/BoardContext';
import BingoBoard from '../components/board/BingoBoard';
import ExportOptions from '../components/export/ExportOptions';
import { ArrowLeft, Edit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const BoardSharePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentBoard, loading, loadBoard } = useBoards();
  const { user } = useAuth();
  const navigate = useNavigate();
  const boardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (id) {
      loadBoard(id);
    }
  }, [id, loadBoard]);
  
  const shareUrl = `${window.location.origin}/board/view/${id}`;
  
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
          to="/dashboard"
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Board Preview</h2>
              {user && user.uid === currentBoard.userId && (
                <Link
                  to={`/board/${id}`}
                  className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Edit Board
                </Link>
              )}
            </div>
            
            <div ref={boardRef}>
              <BingoBoard board={currentBoard} />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <ExportOptions
              board={currentBoard}
              boardRef={boardRef}
              shareUrl={shareUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardSharePage;