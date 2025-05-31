import { v4 as uuidv4 } from 'uuid';
import { User, BingoBoard, FileUploadResult } from '../types';

// Stub local storage keys
const USERS_STORAGE_KEY = 'bingo_users';
const CURRENT_USER_KEY = 'bingo_current_user';
const BOARDS_STORAGE_KEY = 'bingo_boards';

// Helper to initialize local storage
const initializeLocalStorage = () => {
  if (!localStorage.getItem(USERS_STORAGE_KEY)) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(BOARDS_STORAGE_KEY)) {
    localStorage.setItem(BOARDS_STORAGE_KEY, JSON.stringify([]));
  }
};

// Initialize storage
initializeLocalStorage();

// Authentication functions
export const registerUser = async (email: string, password: string, displayName: string): Promise<User> => {
  // Get existing users
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY) || '[]';
  const users = JSON.parse(usersJson);
  
  // Check if email already exists
  if (users.some((user: User) => user.email === email)) {
    throw new Error('Email already in use');
  }
  
  // Create new user
  const newUser: User = {
    uid: uuidv4(),
    email,
    displayName
  };
  
  // Store password (in real app, this would be hashed and stored in backend only)
  // For demo purposes only
  users.push({ ...newUser, password });
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  
  // Set as current user
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  
  return newUser;
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  // Get existing users
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY) || '[]';
  const users = JSON.parse(usersJson);
  
  // Find user with matching email and password
  const user = users.find((u: any) => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Create user object without password
  const userObj: User = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName
  };
  
  // Set as current user
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userObj));
  
  return userObj;
};

export const logoutUser = async (): Promise<void> => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  if (!userJson) return null;
  
  return JSON.parse(userJson);
};

// Firestore functions for Bingo Boards
export const createBoard = async (board: Omit<BingoBoard, 'id'>): Promise<BingoBoard> => {
  // Get existing boards
  const boardsJson = localStorage.getItem(BOARDS_STORAGE_KEY) || '[]';
  const boards = JSON.parse(boardsJson);
  
  // Create new board with ID
  const newBoard = { ...board, id: uuidv4() };
  
  // Add to boards and save
  boards.push(newBoard);
  localStorage.setItem(BOARDS_STORAGE_KEY, JSON.stringify(boards));
  
  return newBoard as BingoBoard;
};

export const updateBoard = async (id: string, data: Partial<BingoBoard>): Promise<void> => {
  // Get existing boards
  const boardsJson = localStorage.getItem(BOARDS_STORAGE_KEY) || '[]';
  const boards = JSON.parse(boardsJson);
  
  // Find and update the board
  const updatedBoards = boards.map((board: BingoBoard) => 
    board.id === id ? { ...board, ...data, updatedAt: Date.now() } : board
  );
  
  // Save updated boards
  localStorage.setItem(BOARDS_STORAGE_KEY, JSON.stringify(updatedBoards));
};

export const deleteBoard = async (id: string): Promise<void> => {
  // Get existing boards
  const boardsJson = localStorage.getItem(BOARDS_STORAGE_KEY) || '[]';
  const boards = JSON.parse(boardsJson);
  
  // Filter out the deleted board
  const updatedBoards = boards.filter((board: BingoBoard) => board.id !== id);
  
  // Save updated boards
  localStorage.setItem(BOARDS_STORAGE_KEY, JSON.stringify(updatedBoards));
};

export const getBoard = async (id: string): Promise<BingoBoard | null> => {
  // Get existing boards
  const boardsJson = localStorage.getItem(BOARDS_STORAGE_KEY) || '[]';
  const boards = JSON.parse(boardsJson);
  
  // Find the board
  const board = boards.find((b: BingoBoard) => b.id === id);
  
  return board || null;
};

export const getUserBoards = async (userId: string, includeArchived = false): Promise<BingoBoard[]> => {
  // Get existing boards
  const boardsJson = localStorage.getItem(BOARDS_STORAGE_KEY) || '[]';
  const boards = JSON.parse(boardsJson);
  
  // Filter boards by user ID
  let userBoards = boards.filter((board: BingoBoard) => board.userId === userId);
  
  // Filter out archived boards if needed
  if (!includeArchived) {
    userBoards = userBoards.filter((board: BingoBoard) => !board.isArchived);
  }
  
  // Sort by updated date (newest first)
  userBoards.sort((a: BingoBoard, b: BingoBoard) => b.updatedAt - a.updatedAt);
  
  return userBoards;
};

// Storage functions for image uploads
export const uploadBoardImage = async (file: File, userId: string, type: 'header' | 'footer' | 'center'): Promise<FileUploadResult> => {
  return new Promise((resolve) => {
    // Create a file reader to read the file as a data URL
    const reader = new FileReader();
    
    reader.onloadend = () => {
      // Generate a fake file path
      const fileId = uuidv4();
      const fileExtension = file.name.split('.').pop();
      const filePath = `users/${userId}/boards/${type}_${fileId}.${fileExtension}`;
      
      // The data URL represents the file content
      const dataUrl = reader.result as string;
      
      // Resolve with the data URL as the download URL
      setTimeout(() => {
        resolve({ url: dataUrl, path: filePath });
      }, 500); // Simulate network delay
    };
    
    // Read the file
    reader.readAsDataURL(file);
  });
};

export const deleteImage = async (path: string): Promise<void> => {
  // In a real implementation, this would delete from storage
  // For now, just return a resolved promise
  return Promise.resolve();
};