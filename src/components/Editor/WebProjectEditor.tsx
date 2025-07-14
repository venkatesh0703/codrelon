import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { useAppStore } from '../../store/useAppStore';
import { Code2, Copy, FileText, Palette, Zap, Layers, Sparkles, Plus, X, Edit3, Trash2, ChevronDown, Folder } from 'lucide-react';
import { CodeEditorSkeleton } from '../UI/SkeletonLoader';
import toast from 'react-hot-toast';

export const WebProjectEditor: React.FC = () => {
  const { 
    webProject, 
    updateWebProjectFile, 
    setActiveWebFile, 
    addWebProjectFile, 
    deleteWebProjectFile,
    renameWebProjectFile,
    theme 
  } = useAppStore();
  
  const editorRef = useRef<any>(null);
  const [showFileDropdown, setShowFileDropdown] = useState(false);
  const [showAddFile, setShowAddFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'html' | 'css' | 'js'>('html');
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Enhanced editor configuration
    editor.updateOptions({
      fontSize: window.innerWidth > 768 ? 16 : 14,
      fontFamily: 'JetBrains Mono, Monaco, Consolas, "Courier New", monospace',
      lineHeight: 1.8,
      minimap: { enabled: window.innerWidth > 1024, scale: 0.9 },
      scrollBeyondLastLine: false,
      roundedSelection: false,
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      renderWhitespace: 'selection',
      fontLigatures: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
      lineNumbers: window.innerWidth > 640 ? 'on' : 'off',
      automaticLayout: true,
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
      scrollbar: {
        vertical: 'auto',
        horizontal: 'auto',
        verticalScrollbarSize: window.innerWidth > 768 ? 12 : 8,
        horizontalScrollbarSize: window.innerWidth > 768 ? 12 : 8,
        useShadows: true,
      },
    });

    // Enhanced custom themes with better colors
    monaco.editor.defineTheme('customDark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'variable', foreground: '9CDCFE' },
        { token: 'type', foreground: '4EC9B0' },
        { token: 'class', foreground: '4EC9B0', fontStyle: 'bold' },
        { token: 'tag', foreground: '569CD6' },
        { token: 'attribute.name', foreground: '9CDCFE' },
        { token: 'attribute.value', foreground: 'CE9178' },
      ],
      colors: {
        'editor.background': '#0D1117',
        'editor.foreground': '#E6EDF3',
        'editorLineNumber.foreground': '#7D8590',
        'editor.selectionBackground': '#264F78',
        'editor.lineHighlightBackground': '#161B22',
        'editorCursor.foreground': '#58A6FF',
        'scrollbarSlider.background': '#21262D80',
        'scrollbarSlider.hoverBackground': '#30363D',
        'scrollbarSlider.activeBackground': '#484F58',
      }
    });

    monaco.editor.defineTheme('customLight', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '008000', fontStyle: 'italic' },
        { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
        { token: 'string', foreground: 'A31515' },
        { token: 'number', foreground: '098658' },
        { token: 'function', foreground: '795E26' },
        { token: 'variable', foreground: '001080' },
        { token: 'type', foreground: '267F99' },
        { token: 'class', foreground: '267F99', fontStyle: 'bold' },
        { token: 'tag', foreground: '0000FF' },
        { token: 'attribute.name', foreground: '001080' },
        { token: 'attribute.value', foreground: 'A31515' },
      ],
      colors: {
        'editor.background': '#FFFFFF',
        'editor.foreground': '#24292F',
        'editorLineNumber.foreground': '#656D76',
        'editor.selectionBackground': '#0969DA40',
        'editor.lineHighlightBackground': '#F6F8FA',
        'editorCursor.foreground': '#0969DA',
        'scrollbarSlider.background': '#D1D9E080',
        'scrollbarSlider.hoverBackground': '#B1BAC4',
        'scrollbarSlider.activeBackground': '#8C959F',
      }
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (webProject && value !== undefined) {
      updateWebProjectFile(webProject.activeFileId, value);
    }
  };

  const getCurrentFile = () => {
    if (!webProject) return null;
    return webProject.files.find(f => f.id === webProject.activeFileId) || null;
  };

  const getCurrentLanguage = () => {
    const currentFile = getCurrentFile();
    if (!currentFile) return 'html';
    
    switch (currentFile.type) {
      case 'html': return 'html';
      case 'css': return 'css';
      case 'js': return 'javascript';
      default: return 'html';
    }
  };

  const getFileIcon = (type: 'html' | 'css' | 'js') => {
    switch (type) {
      case 'html': return { icon: FileText, emoji: '🌐', color: 'from-orange-500 to-red-500' };
      case 'css': return { icon: Palette, emoji: '🎨', color: 'from-blue-500 to-purple-500' };
      case 'js': return { icon: Zap, emoji: '⚡', color: 'from-yellow-500 to-orange-500' };
    }
  };

  const handleAddFile = () => {
    if (newFileName.trim()) {
      const extension = newFileType === 'js' ? 'js' : newFileType;
      const fileName = newFileName.includes('.') ? newFileName : `${newFileName}.${extension}`;
      addWebProjectFile(newFileType, fileName);
      setNewFileName('');
      setShowAddFile(false);
      toast.success(`${newFileType.toUpperCase()} file created!`, { icon: '📄' });
    }
  };

  const handleRename = (fileId: string) => {
    if (editingName.trim()) {
      renameWebProjectFile(fileId, editingName);
      setEditingFileId(null);
      setEditingName('');
      toast.success('File renamed!', { icon: '✏️' });
    }
  };

  const handleDeleteFile = (fileId: string) => {
    if (webProject && webProject.files.length > 1) {
      deleteWebProjectFile(fileId);
      toast.success('File deleted!', { icon: '🗑️' });
    } else {
      toast.error('Cannot delete the last file!', { icon: '⚠️' });
    }
  };

  const handleCopyCode = () => {
    const currentFile = getCurrentFile();
    if (currentFile) {
      navigator.clipboard.writeText(currentFile.content);
      toast.success(`${currentFile.name} copied!`, { icon: '📋' });
    }
  };

  const handleFileSelect = (fileId: string) => {
    setActiveWebFile(fileId);
    setShowFileDropdown(false);
  };

  if (!webProject) {
    return <CodeEditorSkeleton />;
  }

  const currentFile = getCurrentFile();

  return (
    <motion.div
      className="h-full relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-full bg-white/5 dark:bg-gray-900/10 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/20 dark:border-gray-700/20 overflow-hidden shadow-2xl">
        
        {/* Enhanced File Selector Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 bg-white/10 dark:bg-gray-800/20 border-b border-white/10 dark:border-gray-700/20">
          <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
            {/* File Dropdown Selector */}
            <div className="relative">
              <motion.button
                onClick={() => setShowFileDropdown(!showFileDropdown)}
                className="flex items-center space-x-3 px-4 sm:px-6 py-3 sm:py-4 bg-white/10 dark:bg-gray-700/30 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl text-gray-800 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-gray-700/40 transition-all duration-300 shadow-lg hover:shadow-xl min-w-0"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className="p-2 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Folder className="w-5 h-5 text-white" />
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  {currentFile ? (
                    <>
                      <div className="flex items-center space-x-2">
                        {(() => {
                          const fileInfo = getFileIcon(currentFile.type);
                          const IconComponent = fileInfo.icon;
                          return <IconComponent className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
                        })()}
                        <span className="font-semibold text-sm sm:text-base truncate">
                          {currentFile.name}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {currentFile.type.toUpperCase()} • {currentFile.content.split('\n').length} lines
                      </div>
                    </>
                  ) : (
                    <div>
                      <div className="font-semibold text-sm sm:text-base">Select File</div>
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Choose a file to edit
                      </div>
                    </div>
                  )}
                </div>
                
                <motion.div
                  animate={{ rotate: showFileDropdown ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </motion.div>
              </motion.button>

              {/* File Dropdown Menu */}
              <AnimatePresence>
                {showFileDropdown && (
                  <motion.div
                    className="absolute top-full left-0 right-0 mt-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 z-50 min-w-80 max-h-96 overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-4">
                      {/* Dropdown Header */}
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2">
                          <Folder className="w-5 h-5 text-blue-500" />
                          <span className="font-semibold text-gray-800 dark:text-gray-200">
                            Project Files
                          </span>
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full font-medium">
                            {webProject.files.length}
                          </span>
                        </div>
                        
                        <motion.button
                          onClick={() => setShowAddFile(true)}
                          className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Add New File"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>
                      
                      {/* Files List */}
                      <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                        {webProject.files.map((file, index) => {
                          const fileInfo = getFileIcon(file.type);
                          const IconComponent = fileInfo.icon;
                          const isActive = file.id === webProject.activeFileId;
                          
                          return (
                            <motion.div
                              key={file.id}
                              className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                                isActive
                                  ? `bg-gradient-to-r ${fileInfo.color} text-white shadow-lg`
                                  : 'bg-white/50 dark:bg-gray-700/30 hover:bg-white/70 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                              }`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ scale: 1.02, x: 4 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {editingFileId === file.id ? (
                                <div className="flex items-center space-x-3 flex-1">
                                  <IconComponent className="w-5 h-5" />
                                  <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    onBlur={() => handleRename(file.id)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleRename(file.id);
                                      if (e.key === 'Escape') {
                                        setEditingFileId(null);
                                        setEditingName('');
                                      }
                                    }}
                                    className="bg-transparent border-none outline-none text-white placeholder-white/70 text-sm font-semibold flex-1"
                                    autoFocus
                                  />
                                </div>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleFileSelect(file.id)}
                                    className="flex items-center space-x-3 flex-1 text-left"
                                  >
                                    <motion.div
                                      animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                                      transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                                    >
                                      <IconComponent className="w-5 h-5" />
                                    </motion.div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-semibold text-sm truncate">
                                        {file.name}
                                      </div>
                                      <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {file.type.toUpperCase()} • {file.content.split('\n').length} lines • {Math.round(file.content.length / 1024) || 1}KB
                                      </div>
                                    </div>
                                  </button>
                                  
                                  {/* File Actions */}
                                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <motion.button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingFileId(file.id);
                                        setEditingName(file.name);
                                      }}
                                      className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      title="Rename"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </motion.button>
                                    
                                    {webProject.files.length > 1 && (
                                      <motion.button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteFile(file.id);
                                        }}
                                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        title="Delete"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </motion.button>
                                    )}
                                  </div>
                                </>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                      
                      {/* Quick Stats */}
                      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>Total Files: {webProject.files.length}</span>
                          <span>
                            {webProject.files.filter(f => f.type === 'html').length} HTML • {' '}
                            {webProject.files.filter(f => f.type === 'css').length} CSS • {' '}
                            {webProject.files.filter(f => f.type === 'js').length} JS
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <motion.button
              onClick={handleCopyCode}
              className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              title="Copy Current File"
            >
              <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </div>
        </div>

        {/* Add File Modal */}
        <AnimatePresence>
          {showAddFile && (
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white/10 dark:bg-gray-900/20 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 p-6 max-w-md w-full"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                    Add New File
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      File Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['html', 'css', 'js'] as const).map((type) => {
                        const info = getFileIcon(type);
                        return (
                          <motion.button
                            key={type}
                            onClick={() => setNewFileType(type)}
                            className={`flex flex-col items-center space-y-2 p-4 rounded-xl transition-all ${
                              newFileType === type
                                ? `bg-gradient-to-r ${info.color} text-white shadow-lg`
                                : 'bg-white/10 text-gray-600 dark:text-gray-400 hover:bg-white/20'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <info.icon className="w-6 h-6" />
                            <span className="text-sm font-medium">{type.toUpperCase()}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      File Name
                    </label>
                    <input
                      type="text"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      placeholder={`Enter filename (e.g., style.${newFileType})`}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddFile();
                        if (e.key === 'Escape') setShowAddFile(false);
                      }}
                      autoFocus
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <motion.button
                    onClick={handleAddFile}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create File
                  </motion.button>
                  <motion.button
                    onClick={() => setShowAddFile(false)}
                    className="flex-1 py-3 bg-gray-500/20 text-gray-600 dark:text-gray-400 rounded-xl font-medium hover:bg-gray-500/30 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Monaco Editor */}
        <div className="h-[calc(100%-140px)] sm:h-[calc(100%-160px)] relative">
          {currentFile ? (
            <Editor
              height="100%"
              language={getCurrentLanguage()}
              value={currentFile.content}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              theme={theme === 'dark' ? 'customDark' : 'customLight'}
              options={{
                padding: { top: 20, bottom: 20 },
              }}
              loading={
                <div className="flex items-center justify-center h-full bg-white/5 dark:bg-gray-900/20">
                  <motion.div
                    className="flex flex-col items-center space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <span className="text-gray-600 dark:text-gray-400 font-semibold">
                      Loading Monaco Editor...
                    </span>
                  </motion.div>
                </div>
              }
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                >
                  <Folder className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Select a File to Edit
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Choose a file from the dropdown above to start coding
                </p>
              </motion.div>
            </div>
          )}
        </div>
        
        {/* Enhanced Status Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl border-t border-white/10 dark:border-gray-700/20 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center space-x-4 sm:space-x-6 text-gray-600 dark:text-gray-400">
              {currentFile && (
                <>
                  <motion.span 
                    className="flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Layers className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold">Lines:</span>
                    <span className="text-blue-500 font-bold">{currentFile.content.split('\n').length}</span>
                  </motion.span>
                  
                  <span className="hidden sm:flex items-center space-x-2">
                    <span className="font-semibold">Characters:</span>
                    <span className="text-purple-500 font-bold">{currentFile.content.length}</span>
                  </span>
                  
                  <motion.span 
                    className="flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="font-semibold">File:</span>
                    <span className="text-green-500 font-bold">{currentFile.name}</span>
                  </motion.span>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-gray-600 dark:text-gray-400 font-semibold text-xs sm:text-sm">
                {webProject.files.length} file{webProject.files.length !== 1 ? 's' : ''}
              </span>
              <motion.div 
                className="w-2 h-2 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-gray-600 dark:text-gray-400 font-semibold text-xs sm:text-sm">
                Ready to code
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};