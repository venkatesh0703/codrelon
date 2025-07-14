import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Moon, Sun, Play, ChevronDown, Globe, Server, Smartphone, Wrench, Menu, X, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { languages, categories, getLanguagesByCategory } from '../../config/languages';

export const Header: React.FC = () => {
  const { theme, toggleTheme, isCompiling, currentFile, webProject, createNewFile, createWebProject, runCode } = useAppStore();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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

  const handleLanguageSelect = (languageId: number) => {
    const language = languages.find(lang => lang.id === languageId);
    if (language) {
      if (language.id === 1001) {
        createWebProject();
      } else {
        createNewFile(language);
      }
      setShowLanguageDropdown(false);
      setShowMobileMenu(false);
    }
  };

  const getCurrentDisplayInfo = () => {
    if (webProject) {
      return {
        icon: '🌐',
        name: 'Web Project',
        subtitle: 'HTML + CSS + JS'
      };
    } else if (currentFile) {
      return {
        icon: currentFile.language.icon,
        name: currentFile.language.name,
        subtitle: currentFile.name
      };
    } else {
      return {
        icon: '💻',
        name: 'Select Language',
        subtitle: 'Choose a programming language'
      };
    }
  };

  const displayInfo = getCurrentDisplayInfo();

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-white/5 dark:bg-gray-900/5 backdrop-blur-2xl border-b border-white/10 dark:border-gray-700/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-between px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* Enhanced Logo */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <motion.div
            className="relative p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Code className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 opacity-0"
              whileHover={{ opacity: 0.3 }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
          
          <div className="hidden sm:block">
            <motion.h1 
              className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Codrelon
            </motion.h1>
            <motion.p 
              className="text-xs text-gray-500 dark:text-gray-400 font-medium"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Modern Development Environment
            </motion.p>
          </div>
          
          <div className="sm:hidden">
            <h1 className="text-sm font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Codrelon
            </h1>
          </div>
        </div>

        {/* Enhanced Desktop Language Selector */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <motion.button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="w-full flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4 bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl text-gray-800 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-gray-700/30 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3 lg:space-x-4">
                <motion.span 
                  className="text-2xl lg:text-3xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  {displayInfo.icon}
                </motion.span>
                <div className="text-left">
                  <div className="font-semibold text-sm lg:text-base">{displayInfo.name}</div>
                  <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                    {displayInfo.subtitle}
                  </div>
                </div>
              </div>
              <motion.div
                animate={{ rotate: showLanguageDropdown ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {showLanguageDropdown && (
                <motion.div
                  className="absolute top-full left-0 right-0 mt-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 z-50 max-h-96 overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-6">
                    {/* Enhanced Category Filter */}
                    <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <motion.button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                          selectedCategory === 'all'
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Sparkles className="w-3 h-3 inline mr-1" />
                        All
                      </motion.button>
                      {categories.map((category) => (
                        <motion.button
                          key={category.name}
                          onClick={() => setSelectedCategory(category.name)}
                          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 flex items-center space-x-1 ${
                            selectedCategory === category.name
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {getCategoryIcon(category.name)}
                          <span>{category.name}</span>
                        </motion.button>
                      ))}
                    </div>
                    
                    {/* Enhanced Languages Grid */}
                    <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto custom-scrollbar">
                      {filteredLanguages.map((language, index) => (
                        <motion.button
                          key={language.id}
                          onClick={() => handleLanguageSelect(language.id)}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700/60 rounded-xl transition-all duration-300 text-left group"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="text-xl group-hover:scale-110 transition-transform duration-300">{language.icon}</span>
                          <div className="flex-1">
                            <div className="font-semibold">{language.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {language.id === 1001 ? 'HTML + CSS + JS' : `.${language.extension}`}
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
        </div>

        {/* Enhanced Mobile Menu Button */}
        <div className="md:hidden">
          <motion.button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-gray-800/30 dark:hover:bg-gray-700/40 transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: showMobileMenu ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {showMobileMenu ? (
                <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </motion.div>
          </motion.button>
        </div>

        {/* Enhanced Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
          {/* Enhanced Run Button */}
          <motion.button
            onClick={runCode}
            className="flex items-center space-x-2 px-4 lg:px-6 py-3 lg:py-3.5 rounded-xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-semibold hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm lg:text-base"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            disabled={isCompiling || (!currentFile && !webProject)}
          >
            <motion.div
              animate={isCompiling ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: isCompiling ? Infinity : 0, ease: 'linear' }}
            >
              <Play className="w-4 h-4 lg:w-5 lg:h-5" />
            </motion.div>
            <span className="hidden lg:inline">{isCompiling ? 'Running...' : 'Run Code'}</span>
            <span className="lg:hidden">Run</span>
          </motion.button>

          {/* Enhanced Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            className="p-3 lg:p-3.5 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-gray-800/30 dark:hover:bg-gray-700/40 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
            title="Toggle Theme"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: theme === 'dark' ? 0 : 180 }}
              transition={{ duration: 0.5 }}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Enhanced Mobile Menu Dropdown */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="md:hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl border-t border-white/20 dark:border-gray-700/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 space-y-6">
              {/* Enhanced Current Selection */}
              <motion.div 
                className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700/20 dark:to-gray-600/20 rounded-2xl border border-blue-200/50 dark:border-gray-600/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <motion.span 
                  className="text-3xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {displayInfo.icon}
                </motion.span>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">{displayInfo.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{displayInfo.subtitle}</div>
                </div>
              </motion.div>

              {/* Enhanced Category Filter */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                      selectedCategory === 'all'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    All
                  </motion.button>
                  {categories.map((category) => (
                    <motion.button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`px-3 py-2 rounded-full text-xs font-semibold transition-all duration-300 flex items-center space-x-1 ${
                        selectedCategory === category.name
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {getCategoryIcon(category.name)}
                      <span>{category.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Enhanced Languages List */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Languages</h3>
                <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-2">
                  {filteredLanguages.map((language, index) => (
                    <motion.button
                      key={language.id}
                      onClick={() => handleLanguageSelect(language.id)}
                      className="w-full flex items-center space-x-4 p-4 text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700/60 rounded-xl transition-all duration-300 text-left group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{language.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold">{language.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {language.id === 1001 ? 'HTML + CSS + JS' : `.${language.extension}`}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Enhanced Mobile Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-white/20 dark:border-gray-700/20">
                <motion.button
                  onClick={runCode}
                  className="flex-1 flex items-center justify-center space-x-2 py-4 rounded-xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-semibold shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isCompiling || (!currentFile && !webProject)}
                >
                  <Play className="w-5 h-5" />
                  <span>{isCompiling ? 'Running...' : 'Run Code'}</span>
                </motion.button>

                <motion.button
                  onClick={toggleTheme}
                  className="p-4 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-gray-700/30 dark:hover:bg-gray-600/40 transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.05, rotate: 15 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-6 h-6 text-yellow-500" />
                  ) : (
                    <Moon className="w-6 h-6 text-gray-700" />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};