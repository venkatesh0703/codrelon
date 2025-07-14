import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { languages } from '../../config/languages';
import toast from 'react-hot-toast';

interface FileUploadProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ isOpen, onClose }) => {
  const { addFile } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getLanguageByExtension = (extension: string) => {
    const ext = extension.toLowerCase();
    return languages.find(lang => lang.extension === ext) || languages[0];
  };

  const handleFileUpload = async (files: FileList) => {
    const uploadedFiles = Array.from(files);
    
    for (const file of uploadedFiles) {
      try {
        const content = await file.text();
        const extension = file.name.split('.').pop() || '';
        const language = getLanguageByExtension(extension);
        
        const newFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          content,
          language,
          lastModified: new Date(),
        };
        
        addFile(newFile);
        toast.success(`${file.name} uploaded successfully!`);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    
    onClose();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const supportedExtensions = languages.map(lang => `.${lang.extension}`).join(', ');

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white/10 dark:bg-gray-900/20 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 p-8 max-w-2xl w-full shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Upload Files
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Upload your code files to start editing
              </p>
            </div>
          </div>
          
          <motion.button
            onClick={onClose}
            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-500 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Upload Area */}
        <motion.div
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center bg-white/5 dark:bg-gray-800/10 hover:bg-white/10 dark:hover:bg-gray-800/20 transition-all cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          >
            <File className="w-10 h-10 text-white" />
          </motion.div>
          
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Drop files here or click to browse
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Upload multiple files at once. We'll automatically detect the language.
          </p>
          
          <motion.button
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Choose Files
          </motion.button>
        </motion.div>

        {/* Supported Formats */}
        <div className="mt-8 p-6 bg-white/5 dark:bg-gray-800/10 rounded-xl">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              Supported File Types
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {languages.slice(0, 12).map((lang) => (
              <div
                key={lang.id}
                className="flex items-center space-x-2 p-3 bg-white/10 dark:bg-gray-700/20 rounded-lg"
              >
                <span className="text-xl">{lang.icon}</span>
                <div>
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {lang.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    .{lang.extension}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Tip:</strong> Files will be automatically categorized by their extension. 
                Maximum file size: 10MB per file.
              </span>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={supportedExtensions}
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden"
        />
      </motion.div>
    </motion.div>
  );
};