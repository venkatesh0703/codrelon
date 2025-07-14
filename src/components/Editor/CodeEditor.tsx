import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { useAppStore } from '../../store/useAppStore';
import { Code2, Copy, Download, Zap, FileText, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

export const CodeEditor: React.FC = () => {
  const { currentFile, updateFile, theme } = useAppStore();
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Configure editor options
    editor.updateOptions({
      fontSize: window.innerWidth > 768 ? 16 : 14,
      fontFamily: 'JetBrains Mono, Monaco, Consolas, "Courier New", monospace',
      lineHeight: 1.8,
      minimap: { enabled: window.innerWidth > 1024, scale: 0.8 },
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
        verticalScrollbarSize: window.innerWidth > 768 ? 8 : 6,
        horizontalScrollbarSize: window.innerWidth > 768 ? 8 : 6,
      },
    });

    // Enhanced custom themes
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
        { token: 'interface', foreground: 'B8D7A3' },
        { token: 'enum', foreground: 'B8D7A3' },
        { token: 'operator', foreground: 'D4D4D4' },
        { token: 'delimiter', foreground: 'D4D4D4' },
      ],
      colors: {
        'editor.background': '#0D1117',
        'editor.foreground': '#E6EDF3',
        'editorLineNumber.foreground': '#7D8590',
        'editor.selectionBackground': '#264F78',
        'editor.lineHighlightBackground': '#161B22',
        'editorCursor.foreground': '#58A6FF',
        'editor.findMatchBackground': '#FFA657',
        'editor.findMatchHighlightBackground': '#FFA65740',
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
        { token: 'interface', foreground: '0E7490' },
        { token: 'enum', foreground: '0E7490' },
        { token: 'operator', foreground: '000000' },
        { token: 'delimiter', foreground: '000000' },
      ],
      colors: {
        'editor.background': '#FFFFFF',
        'editor.foreground': '#24292F',
        'editorLineNumber.foreground': '#656D76',
        'editor.selectionBackground': '#0969DA40',
        'editor.lineHighlightBackground': '#F6F8FA',
        'editorCursor.foreground': '#0969DA',
        'editor.findMatchBackground': '#FFDF5D',
        'editor.findMatchHighlightBackground': '#FFDF5D40',
      }
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (currentFile && value !== undefined) {
      updateFile(currentFile.id, value);
    }
  };

  const handleCopyCode = () => {
    if (currentFile) {
      navigator.clipboard.writeText(currentFile.content);
      toast.success('Code copied to clipboard!', { icon: '📋' });
    }
  };

  const handleDownloadCode = () => {
    if (currentFile) {
      const blob = new Blob([currentFile.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = currentFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Code downloaded!', { icon: '💾' });
    }
  };

  if (!currentFile) {
    return (
      <motion.div
        className="h-full flex items-center justify-center p-4 sm:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center max-w-lg">
          <motion.div
            className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 rounded-full bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 flex items-center justify-center shadow-2xl"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            }}
          >
            <Code2 className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
          </motion.div>
          
          <motion.h3 
            className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-4 sm:mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Welcome to Code Compiler Pro
          </motion.h3>
          
          <motion.p 
            className="text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Select a programming language from the dropdown above to start coding.
            Supports web technologies, backend languages, and system programming.
          </motion.p>
          
          <motion.div
            className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Real-time execution</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <span>Syntax highlighting</span>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-green-500" />
              <span>Auto-completion</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="h-full relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-full bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden shadow-2xl">
        
        {/* Editor Header */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 bg-white/10 dark:bg-gray-800/20 border-b border-white/10 dark:border-gray-700/20">
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="text-2xl sm:text-3xl">{currentFile.language.icon}</div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">
                  {currentFile.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {currentFile.language.name} • Ready to compile
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <motion.button
              onClick={handleCopyCode}
              className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 dark:bg-gray-700/30 dark:hover:bg-gray-600/40 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Copy Code"
            >
              <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>

            <motion.button
              onClick={handleDownloadCode}
              className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 dark:bg-gray-700/30 dark:hover:bg-gray-600/40 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Download Code"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="h-[calc(100%-120px)] sm:h-[calc(100%-140px)]">
          <Editor
            height="100%"
            language={currentFile.language.monacoLanguage}
            value={currentFile.content}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            theme={theme === 'dark' ? 'customDark' : 'customLight'}
            options={{
              padding: { top: 12, bottom: 12 },
            }}
            loading={
              <div className="flex items-center justify-center h-full bg-white/5 dark:bg-gray-900/20">
                <motion.div
                  className="flex flex-col items-center space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-primary-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <span className="text-gray-600 dark:text-gray-400 font-medium text-sm sm:text-lg">
                    Loading Monaco Editor...
                  </span>
                </motion.div>
              </div>
            }
          />
        </div>
        
        {/* Enhanced Status Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm border-t border-white/10 dark:border-gray-700/20 px-3 sm:px-6 py-2 sm:py-3">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center space-x-3 sm:space-x-6 text-gray-600 dark:text-gray-400">
              <span className="flex items-center space-x-1 sm:space-x-2">
                <span className="font-medium">Lines:</span>
                <span className="text-primary-500 font-semibold">{currentFile.content.split('\n').length}</span>
              </span>
              <span className="hidden sm:flex items-center space-x-2">
                <span className="font-medium">Characters:</span>
                <span className="text-secondary-500 font-semibold">{currentFile.content.length}</span>
              </span>
              <span className="flex items-center space-x-1 sm:space-x-2">
                <span className="font-medium">Language:</span>
                <span className="text-accent-500 font-semibold">{currentFile.language.name}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <motion.div 
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-gray-600 dark:text-gray-400 font-medium text-xs sm:text-sm">Ready to compile</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};