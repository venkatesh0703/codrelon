import React from 'react';
import { motion } from 'framer-motion';
import { Play, Square, Eye, EyeOff, Terminal, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { CompilerService } from '../../services/compilerService';
import toast from 'react-hot-toast';

export const FloatingActionButton: React.FC = () => {
  const { 
    currentFile, 
    webProject,
    isCompiling, 
    setCompiling, 
    setCompilationResult,
    consoleOpen,
    toggleConsole,
    previewOpen,
    togglePreview
  } = useAppStore();

  const handleRunCode = async () => {
    if (!currentFile && !webProject) {
      toast.error('No file selected', {
        style: {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontWeight: '600'
        }
      });
      return;
    }

    if (!consoleOpen) {
      toggleConsole();
    }

    setCompiling(true);
    setCompilationResult(null);

    try {
      let result;
      if (webProject) {
        result = await CompilerService.compileAndRun(
          webProject.htmlContent,
          1001
        );
      } else if (currentFile) {
        result = await CompilerService.compileAndRun(
          currentFile.content,
          currentFile.language.id
        );
      }
      
      if (result) {
        setCompilationResult(result);
        
        if (result.status.id === 3) {
          toast.success('Code executed successfully!', {
            icon: '🚀',
            style: {
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600'
            }
          });
        } else {
          toast.error(`Execution failed: ${result.status.description}`, {
            style: {
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600'
            }
          });
        }
      }
    } catch (error) {
      toast.error('Failed to compile code', {
        style: {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontWeight: '600'
        }
      });
      console.error('Compilation error:', error);
    } finally {
      setCompiling(false);
    }
  };

  const handleStopExecution = () => {
    setCompiling(false);
    toast.success('Execution stopped', {
      icon: '⏹️',
      style: {
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontWeight: '600'
      }
    });
  };

  const canShowPreview = webProject || (currentFile && ['HTML', 'CSS', 'JavaScript', 'React', 'Angular', 'Vue.js'].includes(currentFile.language.name));

  return (
    <motion.div
      className="fixed bottom-6 sm:bottom-8 right-6 sm:right-8 z-50"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="flex flex-col space-y-3 sm:space-y-4">
        {/* Enhanced Secondary Actions */}
        <motion.div
          className="hidden sm:flex flex-col space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Enhanced Console Toggle */}
          <motion.button
            onClick={toggleConsole}
            className={`relative w-14 h-14 rounded-2xl backdrop-blur-2xl border-2 border-white/30 dark:border-gray-600/30 flex items-center justify-center transition-all duration-300 shadow-xl overflow-hidden ${
              consoleOpen 
                ? 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white' 
                : 'bg-white/20 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/50'
            }`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            title={consoleOpen ? 'Hide Console' : 'Show Console'}
          >
            <Terminal className="w-6 h-6 relative z-10" />
            {consoleOpen && (
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-2xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>

          {/* Enhanced Preview Toggle */}
          {canShowPreview && (
            <motion.button
              onClick={togglePreview}
              className={`relative w-14 h-14 rounded-2xl backdrop-blur-2xl border-2 border-white/30 dark:border-gray-600/30 flex items-center justify-center transition-all duration-300 shadow-xl overflow-hidden ${
                previewOpen 
                  ? 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white' 
                  : 'bg-white/20 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/50'
              }`}
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              title={previewOpen ? 'Hide Preview' : 'Show Preview'}
            >
              {previewOpen ? <EyeOff className="w-6 h-6 relative z-10" /> : <Eye className="w-6 h-6 relative z-10" />}
              {previewOpen && (
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-2xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          )}
        </motion.div>

        {/* Enhanced Primary Action - Run Code */}
        <motion.button
          className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center text-white font-bold shadow-2xl transition-all duration-300 overflow-hidden ${
            isCompiling
              ? 'bg-gradient-to-br from-red-500 via-pink-500 to-rose-500 hover:from-red-600 hover:via-pink-600 hover:to-rose-600'
              : 'bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600'
          }`}
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={isCompiling ? handleStopExecution : handleRunCode}
          disabled={!currentFile && !webProject}
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
          
          {/* Sparkle effects */}
          <motion.div
            className="absolute top-2 right-2"
            animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 text-white/80" />
          </motion.div>
          
          {isCompiling ? (
            <motion.div
              className="relative z-10"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Square className="w-7 h-7 sm:w-8 sm:h-8" />
            </motion.div>
          ) : (
            <motion.div
              className="relative z-10"
              whileHover={{ scale: 1.1 }}
            >
              <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1" />
            </motion.div>
          )}
        </motion.button>

        {/* Enhanced Mobile Quick Actions */}
        <div className="sm:hidden flex space-x-3">
          <motion.button
            onClick={toggleConsole}
            className={`w-12 h-12 rounded-xl backdrop-blur-2xl border-2 border-white/30 dark:border-gray-600/30 flex items-center justify-center transition-all duration-300 shadow-lg ${
              consoleOpen 
                ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white' 
                : 'bg-white/20 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300'
            }`}
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Terminal className="w-5 h-5" />
          </motion.button>

          {canShowPreview && (
            <motion.button
              onClick={togglePreview}
              className={`w-12 h-12 rounded-xl backdrop-blur-2xl border-2 border-white/30 dark:border-gray-600/30 flex items-center justify-center transition-all duration-300 shadow-lg ${
                previewOpen 
                  ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white' 
                  : 'bg-white/20 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300'
              }`}
              whileHover={{ scale: 1.05, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              {previewOpen ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};