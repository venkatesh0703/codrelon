import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Smartphone, Tablet, Monitor, Download, Maximize2, Minimize2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { PreviewSkeleton } from '../UI/SkeletonLoader';
import toast from 'react-hot-toast';
import JSZip from 'jszip';

export const WebProjectPreview: React.FC = () => {
  const { webProject } = useAppStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getPreviewContent = () => {
    if (!webProject) return '';

    // Find the main HTML file (first HTML file or one named index.html)
    const htmlFiles = webProject.files.filter(f => f.type === 'html');
    const mainHtmlFile = htmlFiles.find(f => f.name.toLowerCase().includes('index')) || htmlFiles[0];
    
    if (!mainHtmlFile) {
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>No HTML File</title>
            <style>
              body { 
                margin: 0; 
                padding: 40px; 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .container {
                background: white;
                border-radius: 20px;
                padding: 40px;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                max-width: 500px;
              }
              h2 { color: #333; margin-bottom: 16px; }
              p { color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>📄 No HTML file found</h2>
                <p>Please create an HTML file to see the preview.</p>
            </div>
        </body>
        </html>
      `;
    }

    let htmlContent = mainHtmlFile.content;
    
    // Enhanced custom scrollbar styles
    const customScrollbarCSS = `
      /* Enhanced Custom Scrollbar Styles */
      ::-webkit-scrollbar {
        width: 14px;
        height: 14px;
      }
      
      ::-webkit-scrollbar-track {
        background: linear-gradient(135deg, #f1f3f4, #e8eaed);
        border-radius: 12px;
        box-shadow: inset 0 0 8px rgba(0,0,0,0.1);
        border: 2px solid transparent;
      }
      
      ::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
        border-radius: 12px;
        border: 3px solid transparent;
        background-clip: content-box;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #5a67d8, #6b46c1, #ec4899);
        background-clip: content-box;
        transform: scale(1.1);
        box-shadow: 0 6px 12px rgba(0,0,0,0.4);
      }
      
      ::-webkit-scrollbar-thumb:active {
        background: linear-gradient(135deg, #4c51bf, #553c9a, #db2777);
        background-clip: content-box;
        transform: scale(1.2);
      }
      
      ::-webkit-scrollbar-corner {
        background: linear-gradient(135deg, #f1f3f4, #e8eaed);
        border-radius: 12px;
      }
      
      /* Enhanced Firefox scrollbar */
      * {
        scrollbar-width: thin;
        scrollbar-color: #667eea #f1f3f4;
      }
      
      /* Smooth scrolling with enhanced behavior */
      html {
        scroll-behavior: smooth;
        scroll-padding-top: 20px;
      }
    `;
    
    // Parse HTML to find referenced CSS and JS files
    const cssLinkRegex = /<link[^>]*href=["']([^"']*\.css)["'][^>]*>/gi;
    const jsScriptRegex = /<script[^>]*src=["']([^"']*\.js)["'][^>]*>/gi;
    
    let cssMatches = [];
    let jsMatches = [];
    let match;
    
    // Find all CSS file references
    while ((match = cssLinkRegex.exec(htmlContent)) !== null) {
      cssMatches.push(match[1]);
    }
    
    // Find all JS file references
    while ((match = jsScriptRegex.exec(htmlContent)) !== null) {
      jsMatches.push(match[1]);
    }
    
    // Replace CSS file references with inline styles
    cssMatches.forEach(cssFileName => {
      const cssFile = webProject.files.find(f => 
        f.type === 'css' && (f.name === cssFileName || f.name.endsWith(cssFileName))
      );
      
      if (cssFile) {
        const linkTag = new RegExp(`<link[^>]*href=["']${cssFileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>`, 'gi');
        const inlineStyle = `<style>\n/* ${cssFile.name} */\n${cssFile.content}\n</style>`;
        htmlContent = htmlContent.replace(linkTag, inlineStyle);
      } else {
        // If file not found, show warning in console
        const linkTag = new RegExp(`<link[^>]*href=["']${cssFileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>`, 'gi');
        const warningStyle = `<style>\n/* Warning: ${cssFileName} not found */\nbody::before { content: "⚠️ CSS file '${cssFileName}' not found"; position: fixed; top: 0; left: 0; right: 0; background: #ff6b6b; color: white; padding: 10px; text-align: center; z-index: 9999; font-family: Arial, sans-serif; }\n</style>`;
        htmlContent = htmlContent.replace(linkTag, warningStyle);
      }
    });
    
    // Replace JS file references with inline scripts
    jsMatches.forEach(jsFileName => {
      const jsFile = webProject.files.find(f => 
        f.type === 'js' && (f.name === jsFileName || f.name.endsWith(jsFileName))
      );
      
      if (jsFile) {
        const scriptTag = new RegExp(`<script[^>]*src=["']${jsFileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*></script>`, 'gi');
        const inlineScript = `<script>\n/* ${jsFile.name} */\n${jsFile.content}\n</script>`;
        htmlContent = htmlContent.replace(scriptTag, inlineScript);
      } else {
        // If file not found, show warning in console
        const scriptTag = new RegExp(`<script[^>]*src=["']${jsFileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*></script>`, 'gi');
        const warningScript = `<script>\nconsole.error("⚠️ JavaScript file '${jsFileName}' not found");\n</script>`;
        htmlContent = htmlContent.replace(scriptTag, warningScript);
      }
    });
    
    // Add custom scrollbar CSS if not already present
    if (!htmlContent.includes('webkit-scrollbar')) {
      if (htmlContent.includes('</head>')) {
        const cssInjection = `<style>\n${customScrollbarCSS}\n</style>`;
        htmlContent = htmlContent.replace('</head>', `${cssInjection}\n</head>`);
      }
    }

    return htmlContent;
  };

  useEffect(() => {
    if (iframeRef.current && webProject) {
      setIsLoading(true);
      const iframe = iframeRef.current;
      const content = getPreviewContent();
      
      iframe.onload = () => {
        setTimeout(() => setIsLoading(false), 300);
      };
      
      iframe.srcdoc = content;
    }
  }, [webProject?.files, webProject?.lastModified]);

  const getDeviceStyles = () => {
    if (isFullscreen) {
      return { width: '100%', height: '100%' };
    }
    
    switch (deviceMode) {
      case 'mobile':
        return { width: '375px', height: '100%', margin: '0 auto' };
      case 'tablet':
        return { width: '768px', height: '100%', margin: '0 auto' };
      default:
        return { width: '100%', height: '100%' };
    }
  };

  const handleDownloadZip = useCallback(async () => {
    if (!webProject) return;

    try {
      const zip = new JSZip();
      
      // Add all files to ZIP with their actual names
      webProject.files.forEach(file => {
        zip.file(file.name, file.content);
      });
      
      // Generate ZIP file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      // Create download link
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${webProject.name.replace(/\s+/g, '-').toLowerCase()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`ZIP downloaded!`, {
        duration: 2000,
        icon: '📦',
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontWeight: '600',
          padding: '8px 16px',
          fontSize: '14px'
        }
      });
    } catch (error) {
      console.error('Error creating ZIP file:', error);
      toast.error('Failed to create ZIP file', {
        style: {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontWeight: '600',
          padding: '8px 16px',
          fontSize: '14px'
        }
      });
    }
  }, [webProject]);

  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      const content = getPreviewContent();
      iframeRef.current.srcdoc = content;
      
      toast.success('Refreshed!', {
        icon: '🔄',
        duration: 1500,
        style: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '600',
          padding: '6px 12px',
          fontSize: '12px'
        }
      });
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    toast.success(isFullscreen ? 'Windowed' : 'Fullscreen', {
      icon: isFullscreen ? '🪟' : '🖥️',
      duration: 1500,
      style: {
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        padding: '6px 12px',
        fontSize: '12px'
      }
    });
  };

  if (!webProject) {
    return <PreviewSkeleton />;
  }

  return (
    <motion.div
      className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'h-full'} relative`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-full bg-white/5 dark:bg-gray-900/10 backdrop-blur-2xl rounded-lg sm:rounded-xl border border-white/20 dark:border-gray-700/20 overflow-hidden shadow-2xl">
        
        {/* Fixed Header with Increased Height - 52px on mobile, 56px on desktop */}
        <div className="flex items-center justify-end px-4 py-3 sm:px-5 sm:py-4 bg-white/10 dark:bg-gray-800/20 border-b border-white/10 dark:border-gray-700/20 min-h-[52px] sm:min-h-[56px]">
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Device Mode Toggles - Desktop Only */}
            {!isFullscreen && (
              <div className="hidden sm:flex items-center space-x-1.5 bg-white/10 dark:bg-gray-700/30 rounded-lg p-1.5">
                {[
                  { mode: 'mobile' as const, icon: Smartphone, color: 'from-pink-500 to-rose-500' },
                  { mode: 'tablet' as const, icon: Tablet, color: 'from-purple-500 to-indigo-500' },
                  { mode: 'desktop' as const, icon: Monitor, color: 'from-blue-500 to-cyan-500' }
                ].map(({ mode, icon: Icon, color }) => (
                  <motion.button
                    key={mode}
                    onClick={() => setDeviceMode(mode)}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      deviceMode === mode 
                        ? `bg-gradient-to-r ${color} text-white shadow-sm` 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-white/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.button>
                ))}
              </div>
            )}

            {/* Mobile Device Toggle */}
            <div className="sm:hidden">
              <motion.button
                onClick={() => {
                  const modes: ('mobile' | 'tablet' | 'desktop')[] = ['mobile', 'tablet', 'desktop'];
                  const currentIndex = modes.indexOf(deviceMode);
                  const nextMode = modes[(currentIndex + 1) % modes.length];
                  setDeviceMode(nextMode);
                }}
                className="p-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {deviceMode === 'mobile' && <Smartphone className="w-4 h-4" />}
                {deviceMode === 'tablet' && <Tablet className="w-4 h-4" />}
                {deviceMode === 'desktop' && <Monitor className="w-4 h-4" />}
              </motion.button>
            </div>

            <motion.button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </motion.button>

            <motion.button
              onClick={handleRefresh}
              className="p-2.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-sm"
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>

            <motion.button
              onClick={handleDownloadZip}
              className="p-2.5 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-200 shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Preview Content - Uses remaining space */}
        <div className="h-[calc(100%-52px)] sm:h-[calc(100%-56px)] p-2 sm:p-3 overflow-hidden relative">
          {isLoading && (
            <motion.div
              className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col items-center space-y-3">
                <motion.div
                  className="relative"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
                  <div className="absolute inset-0.5 bg-white dark:bg-gray-900 rounded-full"></div>
                  <motion.div
                    className="absolute inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                </motion.div>
                
                <motion.p
                  className="text-sm text-gray-600 dark:text-gray-400 font-medium"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  Loading...
                </motion.p>
              </div>
            </motion.div>
          )}
          
          <div className="h-full flex items-center justify-center">
            <motion.div
              className="bg-white rounded-lg shadow-xl overflow-hidden h-full relative border border-gray-200 dark:border-gray-700"
              style={getDeviceStyles()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Minimal Device Frame */}
              {!isFullscreen && deviceMode !== 'desktop' && (
                <div className="absolute inset-0 pointer-events-none z-10">
                  <div className="w-full h-full border border-gray-800 rounded-lg shadow-inner">
                    {deviceMode === 'mobile' && (
                      <>
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-800 rounded-full" />
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 border border-gray-800 rounded-full" />
                      </>
                    )}
                  </div>
                </div>
              )}
              
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0"
                title="Preview"
                sandbox="allow-scripts allow-same-origin allow-forms"
                style={{
                  borderRadius: isFullscreen ? '0' : '6px',
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};