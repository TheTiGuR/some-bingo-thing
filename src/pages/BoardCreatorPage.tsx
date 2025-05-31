import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBoards } from '../contexts/BoardContext';
import { ColorScheme } from '../types';
import ColorSchemeSelector from '../components/editor/ColorSchemeSelector';
import { Save, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

const BoardCreatorPage: React.FC = () => {
  const { user } = useAuth();
  const { createNewBoard } = useBoards();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('purple');
  const [isCreating, setIsCreating] = useState(false);
  
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a board title');
      return;
    }
    
    try {
      setIsCreating(true);
      const boardId = await createNewBoard(title, description, colorScheme);
      toast.success('Board created successfully!');
      navigate(`/board/${boardId}`);
    } catch (error) {
      toast.error('Failed to create board');
      console.error('Error creating board:', error);
      setIsCreating(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Bingo Board</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Board Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Team Building Bingo"
              maxLength={50}
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Brief description of your bingo board"
              rows={3}
              maxLength={200}
            />
          </div>
          
          <ColorSchemeSelector value={colorScheme} onChange={setColorScheme} />
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isCreating}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:bg-purple-400"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Board
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoardCreatorPage;