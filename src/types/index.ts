export interface Language {
  id: number;
  name: string;
  extension: string;
  monacoLanguage: string;
  defaultCode: string;
  icon: string;
  category: string;
}

export interface CodeFile {
  id: string;
  name: string;
  content: string;
  language: Language;
  lastModified: Date;
  fileType?: 'html' | 'css' | 'js'; // For web project files
}

export interface WebProjectFile {
  id: string;
  name: string;
  content: string;
  type: 'html' | 'css' | 'js';
  lastModified: Date;
}

export interface WebProject {
  id: string;
  name: string;
  files: WebProjectFile[];
  activeFileId: string;
  lastModified: Date;
}

export interface CompilationResult {
  stdout: string;
  stderr: string;
  compile_output: string;
  status: {
    id: number;
    description: string;
  };
  time: string;
  memory: number;
}

export interface Theme {
  name: string;
  isDark: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
  };
}

export interface AppState {
  currentFile: CodeFile | null;
  files: CodeFile[];
  webProject: WebProject | null;
  isCompiling: boolean;
  compilationResult: CompilationResult | null;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  consoleOpen: boolean;
  previewOpen: boolean;
}