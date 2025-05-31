import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBoards } from '../contexts/BoardContext';
import { uploadBoardImage, deleteImage } from '../services/firebase';
import { BingoSquare as BingoSquareType } from '../types';
import BingoBoard from '../components/board/BingoBoard';
import ImageUploader from '../components/editor/ImageUploader';
import ColorSchemeSelector from '../components/editor/ColorSchemeSelector';
import { Save, ArrowLeft, Shuffle, Undo } from 'lucide-react';
import { toast } from 'react-toastify';

const BoardEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { currentBoard, loading, loadBoard, updateBoardDetails, updateSquares, randomizeSquares } = useBoards();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [colorScheme, setColorScheme] = useState(currentBoard?.colorScheme || 'purple');
  const [isSaving, setIsSaving] = useState(false);
  const [originalSquares, setOriginalSquares] = useState<BingoSquareType[]>([]);
  
  // Keep track of image paths for deletion
  const [headerImagePath, setHeaderImagePath] = useState('');
  const [footerImagePath, setFooterImagePath] = useState('');
  const [centerImagePath, setCenterImagePath] = useState('');
  
  const isInitialMount = useRef(true);
  
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    if (id) {
      loadBoard(id);
    }
  }, [id, user, navigate, loadBoard]);
  
  useEffect(() => {
    if (currentBoard) {
      setTitle(currentBoard.title);
      setDescription(currentBoard.description);
      setColorScheme(currentBoard.colorScheme);
      setOriginalSquares(currentBoard.squares);
      
      // Store image paths for potential deletion
      setHeaderImagePath(currentBoard.headerImageUrl?.split('?')[0] || '');
      setFooterImagePath(currentBoard.footerImageUrl?.split('?')[0] || '');
      setCenterImagePath(currentBoard.centerImageUrl?.split('?')[0] || '');
    }
  }, [currentBoard]);
  
  // Auto-save feature
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (currentBoard && !loading) {
      const saveTimeout = setTimeout(() => {
        handleSave();
      }, 5000); // Auto-save after 5 seconds of inactivity
      
      return () => clearTimeout(saveTimeout);
    }
  }, [title, description, colorScheme, currentBoard?.squares]);
  
  const handleSave = async () => {
    if (!id || !currentBoard) return;
    
    try {
      setIsSaving(true);
      await updateBoardDetails(id, {
        title,
        description,
        colorScheme,
        updatedAt: Date.now()
      });
      setIsSaving(false);
    } catch (error) {
      console.error('Error saving board:', error);
      setIsSaving(false);
    }
  };
  
  const handleUploadHeaderImage = async (file: File) => {
    if (!id || !currentBoard || !user) return;
    
    try {
      const result = await uploadBoardImage(file, user.uid, 'header');
      await updateBoardDetails(id, { headerImageUrl: result.url });
      
      // If there was a previous image, mark its path for deletion
      if (headerImagePath) {
        await deleteImage(headerImagePath);
      }
      
      // Update the stored path
      setHeaderImagePath(result.path);
      
      toast.success('Header image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload header image');
      console.error('Error uploading header image:', error);
    }
  };
  
  const handleRemoveHeaderImage = async () => {
    if (!id || !currentBoard) return;
    
    try {
      if (headerImagePath) {
        await deleteImage(headerImagePath);
      }
      
      await updateBoardDetails(id, { headerImageUrl: undefined });
      setHeaderImagePath('');
      
      toast.success('Header image removed successfully!');
    } catch (error) {
      toast.error('Failed to remove header image');
      console.error('Error removing header image:', error);
    }
  };
  
  const handleUploadFooterImage = async (file: File) => {
    if (!id || !currentBoard || !user) return;
    
    try {
      const result = await uploadBoardImage(file, user.uid, 'footer');
      await updateBoardDetails(id, { footerImageUrl: result.url });
      
      // If there was a previous image, mark its path for deletion
      if (footerImagePath) {
        await deleteImage(footerImagePath);
      }
      
      // Update the stored path
      setFooterImagePath(result.path);
      
      toast.success('Footer image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload footer image');
      console.error('Error uploading footer image:', error);
    }
  };
  
  const handleRemoveFooterImage = async () => {
    if (!id || !currentBoard) return;
    
    try {
      if (footerImagePath) {
        await deleteImage(footerImagePath);
      }
      
      await updateBoardDetails(id, { footerImageUrl: undefined });
      setFooterImagePath('');
      
      toast.success('Footer image removed successfully!');
    } catch (error) {
      toast.error('Failed to remove footer image');
      console.error('Error removing footer image:', error);
    }
  };
  
  const handleUploadCenterImage = async (file: File) => {
    if (!id || !currentBoard || !user) return;
    
    try {
      const result = await uploadBoardImage(file, user.uid, 'center');
      await updateBoardDetails(id, { centerImageUrl: result.url });
      
      // If there was a previous image, mark its path for deletion
      if (centerImagePath) {
        await deleteImage(centerImagePath);
      }
      
      // Update the stored path
      setCenterImagePath(result.path);
      
      toast.success('Center image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload center image');
      console.error('Error uploading center image:', error);
    }
  };
  
  const handleRemoveCenterImage = async () => {
    if (!id || !currentBoard) return;
    
    try {
      if (centerImagePath) {
        await deleteImage(centerImagePath);
      }
      
      await updateBoardDetails(id, { centerImageUrl: undefined });
      setCenterImagePath('');
      
      toast.success('Center image removed successfully!');
    } catch (error) {
      toast.error('Failed to remove center image');
      console.error('Error removing center image:', error);
    }
  };
  
  const handleUpdateSquares = async (squares: BingoSquareType[]) => {
    if (!id) return;
    
    try {
      await updateSquares(id, squares);
    } catch (error) {
      toast.error('Failed to update squares');
      console.error('Error updating squares:', error);
    }
  };
  
  const handleRandomizeSquares = async () => {
    if (!id) return;
    
    try {
      await randomizeSquares(id);
      toast.success('Squares randomized successfully!');
    } catch (error) {
      toast.error('Failed to randomize squares');
      console.error('Error randomizing squares:', error);
    }
  };
  
  const handleResetSquares = async () => {
    if (!id) return;
    
    try {
      await updateSquares(id, originalSquares);
      toast.success('Squares reset to original order!');
    } catch (error) {
      toast.error('Failed to reset squares');
      console.error('Error resetting squares:', error);
    }
  };
  
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
        <p className="text-lg text-gray-700 mb-4">Board not found or you don't have permission to edit it.</p>
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
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Board Settings</h2>
            
            <div className="space-y-4">
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
                  placeholder="Board Title"
                  maxLength={50}
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Optional description"
                  rows={3}
                  maxLength={200}
                />
              </div>
              
              <ColorSchemeSelector value={colorScheme} onChange={setColorScheme} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Board Images</h2>
            
            <div className="space-y-6">
              <ImageUploader
                imageUrl={currentBoard.headerImageUrl}
                onUpload={handleUploadHeaderImage}
                onRemove={handleRemoveHeaderImage}
                label="Header Image"
                recommendedSize="800x200px"
              />
              
              <ImageUploader
                imageUrl={currentBoard.centerImageUrl}
                onUpload={handleUploadCenterImage}
                onRemove={handleRemoveCenterImage}
                label="Center Square Image"
                recommendedSize="200x200px"
              />
              
              <ImageUploader
                imageUrl={currentBoard.footerImageUrl}
                onUpload={handleUploadFooterImage}
                onRemove={handleRemoveFooterImage}
                label="Footer Image"
                recommendedSize="800x200px"
              />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Square Management</h2>
            <p className="text-sm text-gray-600 mb-4">
              Double-click on any square (except the center) to edit its content. Drag squares to rearrange them.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleRandomizeSquares}
                className="w-full flex items-center justify-center gap-2 p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                <Shuffle className="h-4 w-4" />
                Randomize Squares
              </button>
              
              <button
                onClick={handleResetSquares}
                className="w-full flex items-center justify-center gap-2 p-2 bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition-colors"
              >
                <Undo className="h-4 w-4" />
                Reset to Original
              </button>
            </div>
          </div>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 p-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:bg-purple-400"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Changes
              </>
            )}
          </button>
          
          <Link
            to={`/board/share/${id}`}
            className="w-full flex items-center justify-center gap-2 p-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-center"
          >
            Preview & Share
          </Link>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Board Preview</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <BingoBoard
                board={currentBoard}
                editable={true}
                onUpdateSquares={handleUpdateSquares}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardEditorPage;