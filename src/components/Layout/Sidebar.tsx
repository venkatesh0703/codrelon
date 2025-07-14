import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, File, Trash2, Settings, Code, FolderOpen, Search, Globe, Server, Smartphone, Wrench, Upload, Download, Share2, Eye } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { languages, categories, getLanguagesByCategory } from '../../config/languages';
import { FileUpload } from '../FileUpload/FileUpload';

export const Sidebar: React.FC = () => {
  const { 
    files, 
    currentFile, 
    setCurrentFile, 
    deleteFile, 
    createNewFile,
    togglePreview,
    previewOpen
  } = useAppStore();

  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleCreateFile = (languageId: number) => {
    const language = languages.find(lang => lang.id === languageId);
    if (language) {
      createNewFile(language);
      setShowLanguageMenu(false);
    }
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.language.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Web': return <Globe className="w-4 h-4" />;
      case 'Backend': return <Server className="w-4 h-4" />;
      case 'System': return <Wrench className="w-4 h-4" />;
      case 'Mobile': return <Smartphone className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  const filteredLanguages = selectedCategory === 'all' 
    ? languages 
    : getLanguagesByCategory(selectedCategory);

  const handleExportProject = () => {
    if (files.length === 0) return;
    
    const projectData = {
      name: 'Code Compiler Project',
      created: new Date().toISOString(),
      files: files.map(file => ({
        name: file.name,
        content: file.content,
        language: file.language.name,
        extension: file.language.extension
      }))
    };
    
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Static Sidebar - Always Visible */}
      <div className="fixed left-0 top-16 bottom-0 w-80 bg-white/10 dark:bg-gray-900/20 backdrop-blur-xl border-r border-white/20 dark:border-gray-700/20 z-40 shadow-2xl">
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                Project Files
              </h2>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="relative">
              <motion.button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 transition-all shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">New</span>
              </motion.button>
              
              <AnimatePresence>
                {showLanguageMenu && (
                  <motion.div
                    className="absolute left-0 top-full mt-2 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 dark:border-gray-700/20 z-50 max-h-96 overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-4">
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-2">
                        <Code className="w-4 h-4" />
                        <span>Create New File</span>
                      </div>
                      
                      {/* Category Filter */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <button
                          onClick={() => setSelectedCategory('all')}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                            selectedCategory === 'all'
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          All
                        </button>
                        {categories.map((category) => (
                          <button
                            key={category.name}
                            onClick={() => setSelectedCategory(category.name)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center space-x-1 ${
                              selectedCategory === category.name
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            {getCategoryIcon(category.name)}
                            <span>{category.name}</span>
                          </button>
                        ))}
                      </div>
                      
                      {/* Languages List */}
                      <div className="space-y-1 max-h-64 overflow-y-auto">
                        {filteredLanguages.map((language) => (
                          <motion.button
                            key={language.id}
                            onClick={() => handleCreateFile(language.id)}
                            className="w-full flex items-center space-x-3 px-3 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-all"
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="text-xl">{language.icon}</span>
                            <div className="flex-1 text-left">
                              <div className="font-medium">{language.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                                <span>.{language.extension}</span>
                                <span>•</span>
                                <span>{language.category}</span>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm font-medium">Upload</span>
            </motion.button>
          </div>

          {/* Preview Toggle */}
          <motion.button
            onClick={togglePreview}
            className={`w-full flex items-center justify-center space-x-2 p-3 rounded-lg mb-6 transition-all shadow-lg ${
              previewOpen 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                : 'bg-white/10 hover:bg-white/20 dark:bg-gray-700/30 dark:hover:bg-gray-600/40 text-gray-700 dark:text-gray-300'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">
              {previewOpen ? 'Hide Preview' : 'Show Preview'}
            </span>
          </motion.button>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/20 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
            />
          </div>

          {/* Files List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            <AnimatePresence>
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file, index) => (
                  <motion.div
                    key={file.id}
                    className={`group flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                      currentFile?.id === file.id
                        ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 shadow-lg'
                        : 'bg-white/5 hover:bg-white/10 dark:bg-gray-800/20 dark:hover:bg-gray-700/30 border border-transparent hover:border-white/20'
                    }`}
                    onClick={() => setCurrentFile(file)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="text-2xl">{file.language.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                          {file.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                          <span>{file.language.name}</span>
                          <span>•</span>
                          <span>{file.language.category}</span>
                          <span>•</span>
                          <span>{file.content.split('\n').length} lines</span>
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Modified {file.lastModified.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(file.id);
                      }}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  >
                    <File className="w-8 h-8 text-white" />
                  </motion.div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {searchTerm ? 'No files match your search' : 'No files yet'}
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                    {searchTerm ? 'Try a different search term' : 'Create your first file to get started'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-white/20 dark:border-gray-700/20 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                onClick={handleExportProject}
                className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 dark:bg-gray-800/20 dark:hover:bg-gray-700/30 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={files.length === 0}
              >
                <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Export</span>
              </motion.button>

              <motion.button
                className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 dark:bg-gray-800/20 dark:hover:bg-gray-700/30 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Share</span>
              </motion.button>
            </div>

            <motion.button
              className="flex items-center space-x-3 w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 dark:bg-gray-800/20 dark:hover:bg-gray-700/30 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Settings & Preferences
              </span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* File Upload Modal */}
      <FileUpload 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
      />
    </>
  );
};