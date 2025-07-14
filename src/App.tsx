import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { ParticleBackground } from './components/Background/ParticleBackground';
import { Header } from './components/Layout/Header';
import { CodeEditor } from './components/Editor/CodeEditor';
import { WebProjectEditor } from './components/Editor/WebProjectEditor';
import { OutputConsole } from './components/Console/OutputConsole';
import { LivePreview } from './components/Preview/LivePreview';
import { WebProjectPreview } from './components/Preview/WebProjectPreview';
import { FloatingActionButton } from './components/FloatingActions/FloatingActionButton';
import { ThemeProvider } from './components/ThemeProvider/ThemeProvider';
import { useAppStore } from './store/useAppStore';

function App() {
  const { currentFile, webProject, previewOpen, createWebProject } = useAppStore();

  useEffect(() => {
    // Create a default Web Project if no files exist
    if (!currentFile && !webProject) {
      createWebProject();
    }
  }, [currentFile, webProject, createWebProject]);

  const canShowPreview = webProject || (currentFile && ['HTML', 'CSS', 'JavaScript'].includes(currentFile.language.name));

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-700">
        <ParticleBackground />
        
        <div className="relative z-10">
          <Header />
          
          {/* Main Layout - Responsive */}
          <div className="pt-16 sm:pt-20 h-screen flex flex-col">
            {/* Desktop/Tablet Layout */}
            <div className="hidden md:flex flex-1">
              {/* Code Editor - Left Side */}
              <motion.div
                className={`${canShowPreview && previewOpen ? 'w-1/2' : 'w-full'} p-2 lg:p-4 transition-all duration-300`}
                layout
              >
                {webProject ? <WebProjectEditor /> : <CodeEditor />}
              </motion.div>

              {/* Live Preview - Right Side */}
              {canShowPreview && previewOpen && (
                <motion.div
                  className="w-1/2 p-2 lg:p-4 border-l border-white/20 dark:border-gray-700/20"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  {webProject ? <WebProjectPreview /> : <LivePreview />}
                </motion.div>
              )}
            </div>

            {/* Mobile Layout - Stacked */}
            <div className="md:hidden flex-1 flex flex-col">
              {/* Mobile Tab Navigation */}
              <div className="flex bg-white/10 dark:bg-gray-900/20 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/20 px-4 py-2">
                <motion.button
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                    !previewOpen 
                      ? 'bg-primary-500 text-white shadow-lg' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-white/20'
                  }`}
                  onClick={() => useAppStore.getState().togglePreview()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📝 Code
                </motion.button>
                
                {canShowPreview && (
                  <motion.button
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ml-2 ${
                      previewOpen 
                        ? 'bg-green-500 text-white shadow-lg' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-white/20'
                    }`}
                    onClick={() => useAppStore.getState().togglePreview()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    👁️ Preview
                  </motion.button>
                )}
              </div>

              {/* Mobile Content Area */}
              <div className="flex-1 p-2">
                {previewOpen && canShowPreview ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    {webProject ? <WebProjectPreview /> : <LivePreview />}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    {webProject ? <WebProjectEditor /> : <CodeEditor />}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Output Console - Bottom (Responsive) */}
            <OutputConsole />
          </div>

          {/* Floating Action Button - Mobile Optimized */}
          <FloatingActionButton />
        </div>

        <Toaster
          position="top-right"
          toastOptions={{
            className: 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-sm',
            style: {
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '14px',
              padding: '12px',
            },
          }}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;