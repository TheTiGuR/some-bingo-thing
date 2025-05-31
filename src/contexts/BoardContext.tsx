import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BingoBoard, BingoSquare, ColorScheme } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { createBoard, deleteBoard, getBoard, getUserBoards, updateBoard } from '../services/firebase';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

interface BoardContextType {
  boards: BingoBoard[];
  currentBoard: BingoBoard | null;
  loading: boolean;
  loadBoards: (includeArchived?: boolean) => Promise<void>;
  loadBoard: (id: string) => Promise<void>;
  createNewBoard: (title: string, description: string, colorScheme: ColorScheme) => Promise<string>;
  updateBoardDetails: (id: string, data: Partial<BingoBoard>) => Promise<void>;
  deleteUserBoard: (id: string) => Promise<void>;
  duplicateBoard: (id: string) => Promise<string>;
  archiveBoard: (id: string, archive: boolean) => Promise<void>;
  updateSquares: (boardId: string, squares: BingoSquare[]) => Promise<void>;
  randomizeSquares: (boardId: string) => Promise<void>;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const useBoards = (): BoardContextType => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoards must be used within a BoardProvider');
  }
  return context;
};

interface BoardProviderProps {
  children: ReactNode;
}

export const BoardProvider: React.FC<BoardProviderProps> = ({ children }) => {
  const [boards, setBoards] = useState<BingoBoard[]>([]);
  const [currentBoard, setCurrentBoard] = useState<BingoBoard | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadBoards = async (includeArchived = false): Promise<void> => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userBoards = await getUserBoards(user.uid, includeArchived);
      setBoards(userBoards);
    } catch (error) {
      toast.error('Failed to load boards');
      console.error('Error loading boards:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBoard = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      const board = await getBoard(id);
      setCurrentBoard(board);
      if (!board) {
        toast.error('Board not found');
      }
    } catch (error) {
      toast.error('Failed to load board');
      console.error('Error loading board:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEmptySquares = (): BingoSquare[] => {
    const squares: BingoSquare[] = [];
    const totalSquares = 25;
    
    for (let i = 0; i < totalSquares; i++) {
      const isCenter = i === 12; // Middle square (0-indexed)
      squares.push({
        id: uuidv4(),
        content: isCenter ? 'FREE' : '',
        isCenter
      });
    }
    
    return squares;
  };

  const createNewBoard = async (
    title: string,
    description: string,
    colorScheme: ColorScheme
  ): Promise<string> => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const now = Date.now();
      const newBoard: Omit<BingoBoard, 'id'> = {
        title,
        description,
        createdAt: now,
        updatedAt: now,
        userId: user.uid,
        colorScheme,
        squares: createEmptySquares(),
        isArchived: false
      };
      
      const board = await createBoard(newBoard);
      setBoards(prev => [board, ...prev]);
      setCurrentBoard(board);
      toast.success('Board created successfully!');
      return board.id;
    } catch (error) {
      toast.error('Failed to create board');
      console.error('Error creating board:', error);
      throw error;
    }
  };

  const updateBoardDetails = async (id: string, data: Partial<BingoBoard>): Promise<void> => {
    try {
      await updateBoard(id, data);
      
      // Update local state
      setBoards(prev => 
        prev.map(board => (board.id === id ? { ...board, ...data } : board))
      );
      
      if (currentBoard?.id === id) {
        setCurrentBoard(prev => prev ? { ...prev, ...data } : prev);
      }
      
      toast.success('Board updated successfully!');
    } catch (error) {
      toast.error('Failed to update board');
      console.error('Error updating board:', error);
      throw error;
    }
  };

  const deleteUserBoard = async (id: string): Promise<void> => {
    try {
      await deleteBoard(id);
      
      // Update local state
      setBoards(prev => prev.filter(board => board.id !== id));
      
      if (currentBoard?.id === id) {
        setCurrentBoard(null);
      }
      
      toast.success('Board deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete board');
      console.error('Error deleting board:', error);
      throw error;
    }
  };

  const duplicateBoard = async (id: string): Promise<string> => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const boardToDuplicate = boards.find(board => board.id === id);
      if (!boardToDuplicate) throw new Error('Board not found');
      
      const now = Date.now();
      const newBoard: Omit<BingoBoard, 'id'> = {
        ...boardToDuplicate,
        id: undefined as any, // Will be assigned by Firestore
        title: `${boardToDuplicate.title} (Copy)`,
        createdAt: now,
        updatedAt: now,
        userId: user.uid,
        squares: boardToDuplicate.squares.map(square => ({
          ...square,
          id: uuidv4()
        }))
      };
      
      const board = await createBoard(newBoard);
      setBoards(prev => [board, ...prev]);
      toast.success('Board duplicated successfully!');
      return board.id;
    } catch (error) {
      toast.error('Failed to duplicate board');
      console.error('Error duplicating board:', error);
      throw error;
    }
  };

  const archiveBoard = async (id: string, archive: boolean): Promise<void> => {
    try {
      await updateBoard(id, { isArchived: archive });
      
      // Update local state
      setBoards(prev => 
        prev.map(board => (board.id === id ? { ...board, isArchived: archive } : board))
      );
      
      if (currentBoard?.id === id) {
        setCurrentBoard(prev => prev ? { ...prev, isArchived: archive } : prev);
      }
      
      toast.success(`Board ${archive ? 'archived' : 'unarchived'} successfully!`);
    } catch (error) {
      toast.error(`Failed to ${archive ? 'archive' : 'unarchive'} board`);
      console.error(`Error ${archive ? 'archiving' : 'unarchiving'} board:`, error);
      throw error;
    }
  };

  const updateSquares = async (boardId: string, squares: BingoSquare[]): Promise<void> => {
    try {
      await updateBoard(boardId, { squares });
      
      // Update local state
      setBoards(prev => 
        prev.map(board => (board.id === boardId ? { ...board, squares } : board))
      );
      
      if (currentBoard?.id === boardId) {
        setCurrentBoard(prev => prev ? { ...prev, squares } : prev);
      }
    } catch (error) {
      toast.error('Failed to update squares');
      console.error('Error updating squares:', error);
      throw error;
    }
  };

  const randomizeSquares = async (boardId: string): Promise<void> => {
    try {
      const board = boards.find(b => b.id === boardId) || currentBoard;
      if (!board) throw new Error('Board not found');
      
      // Extract non-center squares
      const centerSquare = board.squares.find(square => square.isCenter);
      const otherSquares = board.squares.filter(square => !square.isCenter);
      
      // Shuffle the non-center squares
      const shuffledSquares = [...otherSquares]
        .sort(() => Math.random() - 0.5);
      
      // Reinsert the center square at the middle position (index 12 in a 5x5 grid)
      const newSquares = [...shuffledSquares];
      if (centerSquare) {
        newSquares.splice(12, 0, centerSquare);
      }
      
      await updateSquares(boardId, newSquares);
      toast.success('Squares randomized successfully!');
    } catch (error) {
      toast.error('Failed to randomize squares');
      console.error('Error randomizing squares:', error);
      throw error;
    }
  };

  const value = {
    boards,
    currentBoard,
    loading,
    loadBoards,
    loadBoard,
    createNewBoard,
    updateBoardDetails,
    deleteUserBoard,
    duplicateBoard,
    archiveBoard,
    updateSquares,
    randomizeSquares
  };

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
};