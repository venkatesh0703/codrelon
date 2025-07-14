import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'code';
  lines?: number;
  height?: string;
  width?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  variant = 'rectangular',
  lines = 1,
  height = 'h-4',
  width = 'w-full'
}) => {
  const baseClasses = `bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse rounded`;

  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return `${height} ${width} rounded-md`;
      case 'circular':
        return `w-12 h-12 rounded-full`;
      case 'code':
        return `${height} rounded-lg`;
      default:
        return `${height} ${width} rounded-lg`;
    }
  };

  if (variant === 'code') {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className={`${baseClasses} ${getVariantClasses()}`}
            style={{ width: `${Math.random() * 40 + 60}%` }}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.1,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    );
  }

  if (lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className={`${baseClasses} ${getVariantClasses()}`}
            style={{ width: index === lines - 1 ? '75%' : '100%' }}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.1,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  );
};

// Specialized skeleton components
export const CodeEditorSkeleton: React.FC = () => (
  <div className="h-full bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
    {/* Header Skeleton */}
    <div className="flex items-center justify-between px-6 py-4 bg-white/10 dark:bg-gray-800/20 border-b border-white/10 dark:border-gray-700/20">
      <div className="flex items-center space-x-3">
        <SkeletonLoader variant="circular" />
        <div className="space-y-2">
          <SkeletonLoader width="w-32" height="h-4" />
          <SkeletonLoader width="w-24" height="h-3" />
        </div>
      </div>
      <div className="flex space-x-2">
        <SkeletonLoader variant="circular" />
        <SkeletonLoader variant="circular" />
      </div>
    </div>
    
    {/* Editor Content Skeleton */}
    <div className="p-6">
      <SkeletonLoader variant="code" lines={15} height="h-5" />
    </div>
  </div>
);

export const PreviewSkeleton: React.FC = () => (
  <div className="h-full bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
    {/* Header Skeleton */}
    <div className="flex items-center justify-between px-6 py-4 bg-white/10 dark:bg-gray-800/20 border-b border-white/10 dark:border-gray-700/20">
      <div className="flex items-center space-x-3">
        <SkeletonLoader variant="circular" />
        <SkeletonLoader width="w-28" height="h-4" />
      </div>
      <div className="flex space-x-2">
        <SkeletonLoader width="w-20" height="h-8" />
        <SkeletonLoader variant="circular" />
      </div>
    </div>
    
    {/* Preview Content Skeleton */}
    <div className="p-4">
      <div className="bg-white rounded-lg h-full p-6">
        <SkeletonLoader width="w-48" height="h-8" className="mb-4" />
        <SkeletonLoader lines={3} className="mb-6" />
        <div className="grid grid-cols-2 gap-4 mb-6">
          <SkeletonLoader height="h-32" />
          <SkeletonLoader height="h-32" />
        </div>
        <SkeletonLoader lines={2} />
      </div>
    </div>
  </div>
);

export const ConsoleSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="flex items-center space-x-3">
      <SkeletonLoader variant="circular" />
      <SkeletonLoader width="w-32" height="h-4" />
    </div>
    <SkeletonLoader variant="code" lines={8} height="h-4" />
  </div>
);