export interface User {
  uid: string;
  email: string;
  displayName: string | null;
}

export interface BingoSquare {
  id: string;
  content: string;
  isCenter?: boolean;
}

export interface BingoBoard {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
  headerImageUrl?: string;
  footerImageUrl?: string;
  centerImageUrl?: string;
  colorScheme: ColorScheme;
  squares: BingoSquare[];
  isArchived: boolean;
}

export type ColorScheme = 'purple' | 'teal' | 'pink' | 'amber' | 'blue' | 'green';

export interface ColorSchemeConfig {
  name: ColorScheme;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
}

export interface FileUploadResult {
  url: string;
  path: string;
}

export type BoardView = 'grid' | 'list';