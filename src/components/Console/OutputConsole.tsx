import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Maximize2, Minimize2, RotateCcw, Copy, Zap, CheckCircle, AlertTriangle, XCircle, Activity, Clock, HardDrive } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ConsoleSkeleton } from '../UI/SkeletonLoader';
import toast from 'react-hot-toast';

export const OutputConsole: React.FC = () => {
  const { consoleOpen, toggleConsole, compilationResult, isCompiling } = useAppStore();
  const consoleRef = useRef<HTMLDivElement>(null);
  const [isMaximized, setIsMaximized] = React.useState(false);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [compilationResult]);

  const formatOutput = (text: string) => {
    return text.split('\n').map((line, index) => (
      <div key={index} className="font-mono text-sm leading-relaxed">
        {line || '\u00A0'}
      </div>
    ));
  };

  const handleClearConsole = () => {
    toast.success('Console cleared', { icon: '🧹' });
  };

  const handleCopyOutput = () => {
    if (compilationResult) {
      const output = `${compilationResult.stdout || ''}${compilationResult.stderr || ''}`;
      navigator.clipboard.writeText(output);
      toast.success('Output copied to clipboard!', { icon: '📋' });
    }
  };

  const getStatusIcon = () => {
    if (!compilationResult) return <Terminal className="w-5 h-5" />;
    
    switch (compilationResult.status.id) {
      case 3: return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 6: return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = () => {
    if (!compilationResult) return 'from-blue-500 to-purple-500';
    
    switch (compilationResult.status.id) {
      case 3: return 'from-green-500 to-emerald-500';
      case 6: return 'from-red-500 to-rose-500';
      default: return 'from-yellow-500 to-orange-500';
    }
  };

  return (
    <AnimatePresence>
      {consoleOpen && (
        <motion.div
          className={`fixed bottom-0 left-0 right-0 bg-white/5 dark:bg-gray-900/10 backdrop-blur-xl border-t border-white/20 dark:border-gray-700/20 z-30 shadow-2xl ${
            isMaximized ? 'top-16' : ''
          }`}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className={`${isMaximized ? 'h-full' : 'h-80 sm:h-96'} flex flex-col`}>
            {/* Enhanced Console Header */}
            <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 bg-white/10 dark:bg-gray-800/20 border-b border-white/10 dark:border-gray-700/20">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <motion.div 
                  className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-r ${getStatusColor()}`}
                  animate={{ scale: isCompiling ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 1, repeat: isCompiling ? Infinity : 0 }}
                >
                  {getStatusIcon()}
                </motion.div>
                <div>
                  <span className="text-sm sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Output Console
                  </span>
                  {isCompiling ? (
                    <motion.div
                      className="flex items-center space-x-2 mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <span className="text-xs sm:text-sm text-accent-500 font-medium">Executing...</span>
                    </motion.div>
                  ) : compilationResult && (
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{compilationResult.time}s</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <HardDrive className="w-3 h-3" />
                        <span>{compilationResult.memory} KB</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Activity className="w-3 h-3" />
                        <span>{compilationResult.status.description}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-1 sm:space-x-2">
                <motion.button
                  onClick={handleClearConsole}
                  className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-gray-700/30 dark:hover:bg-gray-600/40 transition-all"
                  whileHover={{ scale: 1.05, rotate: 180 }}
                  whileTap={{ scale: 0.95 }}
                  title="Clear Console"
                >
                  <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                </motion.button>

                {compilationResult && (
                  <motion.button
                    onClick={handleCopyOutput}
                    className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-gray-700/30 dark:hover:bg-gray-600/40 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Copy Output"
                  >
                    <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                )}

                <motion.button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="hidden sm:block p-2 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-gray-700/30 dark:hover:bg-gray-600/40 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={isMaximized ? 'Minimize Console' : 'Maximize Console'}
                >
                  {isMaximized ? (
                    <Minimize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  )}
                </motion.button>

                <motion.button
                  onClick={toggleConsole}
                  className="p-1.5 sm:p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-500 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Close Console"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </motion.button>
              </div>
            </div>

            {/* Console Content with Custom Scrollbar */}
            <div className="flex-1 overflow-hidden">
              <div 
                ref={consoleRef}
                className="h-full overflow-y-auto p-3 sm:p-6 bg-gray-900/80 dark:bg-gray-900/90"
                style={{
                  backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.05) 2%, transparent 0%), 
                                   radial-gradient(circle at 75px 75px, rgba(255,255,255,0.05) 2%, transparent 0%)`,
                  backgroundSize: '100px 100px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#667eea #1a1a1a'
                }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    width: 12px;
                  }
                  div::-webkit-scrollbar-track {
                    background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
                    border-radius: 10px;
                  }
                  div::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border-radius: 10px;
                    border: 2px solid transparent;
                    background-clip: content-box;
                  }
                  div::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(135deg, #5a67d8, #6b46c1);
                    background-clip: content-box;
                  }
                `}</style>
                
                {isCompiling ? (
                  <ConsoleSkeleton />
                ) : compilationResult ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 sm:space-y-6"
                  >
                    {/* Enhanced Execution Status */}
                    <motion.div 
                      className="p-3 sm:p-4 bg-black/30 rounded-xl border border-white/10"
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                        <span className="font-semibold flex items-center space-x-2">
                          <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Execution Status</span>
                        </span>
                        <div className="flex space-x-3 sm:space-x-6">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{compilationResult.time}s</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <HardDrive className="w-3 h-3" />
                            <span>{compilationResult.memory} KB</span>
                          </span>
                        </div>
                      </div>
                      <div className={`flex items-center space-x-3 ${
                        compilationResult.status.id === 3 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        <motion.div 
                          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                            compilationResult.status.id === 3 ? 'bg-green-400' : 'bg-red-400'
                          }`}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="font-mono text-sm sm:text-lg font-semibold">
                          {compilationResult.status.description}
                        </span>
                      </div>
                    </motion.div>

                    {/* Enhanced Output Sections */}
                    {compilationResult.stdout && (
                      <motion.div 
                        className="space-y-2"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="flex items-center space-x-2 text-green-400">
                          <span className="text-xs sm:text-sm font-semibold">📤 Standard Output</span>
                          <div className="flex-1 h-px bg-green-400/20"></div>
                        </div>
                        <div className="bg-black/40 rounded-xl p-3 sm:p-4 text-green-300 border border-green-500/20">
                          {formatOutput(compilationResult.stdout)}
                        </div>
                      </motion.div>
                    )}

                    {compilationResult.stderr && (
                      <motion.div 
                        className="space-y-2"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="flex items-center space-x-2 text-red-400">
                          <span className="text-xs sm:text-sm font-semibold">❌ Standard Error</span>
                          <div className="flex-1 h-px bg-red-400/20"></div>
                        </div>
                        <div className="bg-black/40 rounded-xl p-3 sm:p-4 text-red-300 border border-red-500/20">
                          {formatOutput(compilationResult.stderr)}
                        </div>
                      </motion.div>
                    )}

                    {compilationResult.compile_output && (
                      <motion.div 
                        className="space-y-2"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center space-x-2 text-yellow-400">
                          <span className="text-xs sm:text-sm font-semibold">⚙️ Compilation Output</span>
                          <div className="flex-1 h-px bg-yellow-400/20"></div>
                        </div>
                        <div className="bg-black/40 rounded-xl p-3 sm:p-4 text-yellow-300 border border-yellow-500/20">
                          {formatOutput(compilationResult.compile_output)}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    className="flex flex-col items-center justify-center h-full text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="w-12 h-12 sm:w-16 sm:h-16 mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    >
                      <Terminal className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </motion.div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">
                      Ready to Execute
                    </h3>
                    <p className="text-gray-400 font-mono text-xs sm:text-sm max-w-md px-4">
                      Click the Run button or press Ctrl+Enter to compile and execute your code. 
                      Results will appear here with detailed output and execution statistics.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};