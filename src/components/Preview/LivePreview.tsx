import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, RotateCcw, Download, Smartphone, Tablet, Monitor } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const LivePreview: React.FC = () => {
  const { currentFile } = useAppStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isLoading, setIsLoading] = useState(false);

  const getPreviewContent = () => {
    if (!currentFile) return '';

    switch (currentFile.language.name) {
      case 'HTML':
        return currentFile.content;
      
      case 'CSS':
        return `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>CSS Preview</title>
            <style>
              body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
              .preview-container { max-width: 1200px; margin: 0 auto; }
              .demo-content { padding: 20px; background: #f8f9fa; border-radius: 8px; margin: 20px 0; }
              ${currentFile.content}
            </style>
          </head>
          <body>
            <div class="preview-container">
              <h1>CSS Preview</h1>
              <div class="demo-content">
                <h2>Sample Content</h2>
                <p>This is a preview of your CSS styles applied to sample content.</p>
                <button class="btn">Sample Button</button>
                <div class="card">
                  <h3>Sample Card</h3>
                  <p>Your styles are applied to this content.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;
      
      case 'JavaScript':
        return `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>JavaScript Preview</title>
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
              }
              .container { 
                max-width: 800px; 
                margin: 0 auto; 
                background: white; 
                border-radius: 12px; 
                padding: 30px; 
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              }
              .output { 
                background: #f8f9fa; 
                border: 1px solid #e9ecef; 
                border-radius: 8px; 
                padding: 15px; 
                margin: 20px 0; 
                font-family: 'Courier New', monospace;
                white-space: pre-wrap;
              }
              button {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                margin: 5px;
                transition: transform 0.2s;
              }
              button:hover { transform: translateY(-2px); }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🚀 JavaScript Live Preview</h1>
              <p>Your JavaScript code is running below:</p>
              <div id="output" class="output">Ready to execute...</div>
              <button onclick="runCode()">Run Code</button>
              <button onclick="clearOutput()">Clear Output</button>
            </div>
            <script>
              const originalLog = console.log;
              const outputDiv = document.getElementById('output');
              
              console.log = function(...args) {
                originalLog.apply(console, args);
                outputDiv.innerHTML += args.join(' ') + '\\n';
              };
              
              function clearOutput() {
                outputDiv.innerHTML = 'Output cleared...\\n';
              }
              
              function runCode() {
                clearOutput();
                try {
                  ${currentFile.content}
                } catch (error) {
                  outputDiv.innerHTML += 'Error: ' + error.message + '\\n';
                }
              }
              
              setTimeout(runCode, 500);
            </script>
          </body>
          </html>
        `;
      
      case 'React':
        return `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>React Preview</title>
            <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
            <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
            <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            <style>
              body { 
                margin: 0; 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
              }
              #root { 
                max-width: 1200px; 
                margin: 0 auto; 
                background: white; 
                border-radius: 12px; 
                min-height: 80vh;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              }
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script type="text/babel">
              ${currentFile.content}
              
              const rootElement = document.getElementById('root');
              if (typeof App !== 'undefined') {
                ReactDOM.render(<App />, rootElement);
              } else {
                ReactDOM.render(<div style={{padding: '40px', textAlign: 'center'}}>
                  <h2>🎉 React Component Ready!</h2>
                  <p>Define an App component to see your React code in action.</p>
                </div>, rootElement);
              }
            </script>
          </body>
          </html>
        `;
      
      default:
        return `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Code Preview</title>
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
                border-radius: 12px;
                padding: 40px;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                max-width: 600px;
              }
              .code-block {
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                font-family: 'Courier New', monospace;
                text-align: left;
                white-space: pre-wrap;
                overflow-x: auto;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>📝 ${currentFile.language.name} Code</h2>
              <p>Live preview not available for this language type.</p>
              <div class="code-block">${currentFile.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
            </div>
          </body>
          </html>
        `;
    }
  };

  useEffect(() => {
    if (iframeRef.current && currentFile) {
      setIsLoading(true);
      const iframe = iframeRef.current;
      const content = getPreviewContent();
      
      iframe.onload = () => {
        setIsLoading(false);
      };
      
      iframe.srcdoc = content;
    }
  }, [currentFile?.content, currentFile?.language]);

  const getDeviceStyles = () => {
    switch (deviceMode) {
      case 'mobile':
        return { width: '375px', height: '100%', margin: '0 auto' };
      case 'tablet':
        return { width: '768px', height: '100%', margin: '0 auto' };
      default:
        return { width: '100%', height: '100%' };
    }
  };

  const handleDownloadPreview = () => {
    if (currentFile && (currentFile.language.name === 'HTML' || currentFile.language.name === 'CSS' || currentFile.language.name === 'JavaScript')) {
      const content = getPreviewContent();
      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `preview-${currentFile.name.split('.')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="h-full bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden shadow-2xl">
      {/* Preview Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/10 dark:bg-gray-800/20 border-b border-white/10 dark:border-gray-700/20">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Live Preview
            </span>
            {currentFile && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {currentFile.name} • {currentFile.language.name}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Device Mode Toggles */}
          <div className="flex items-center space-x-1 bg-white/10 dark:bg-gray-700/30 rounded-lg p-1">
            <motion.button
              onClick={() => setDeviceMode('mobile')}
              className={`p-2 rounded-md transition-all ${deviceMode === 'mobile' ? 'bg-primary-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-white/20'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => setDeviceMode('tablet')}
              className={`p-2 rounded-md transition-all ${deviceMode === 'tablet' ? 'bg-primary-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-white/20'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => setDeviceMode('desktop')}
              className={`p-2 rounded-md transition-all ${deviceMode === 'desktop' ? 'bg-primary-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-white/20'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </motion.button>
          </div>

          <motion.button
            onClick={() => window.location.reload()}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-gray-700/30 dark:hover:bg-gray-600/40 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Refresh Preview"
          >
            <RotateCcw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </motion.button>

          <motion.button
            onClick={handleDownloadPreview}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-gray-700/30 dark:hover:bg-gray-600/40 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Download Preview"
          >
            <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </motion.button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="h-[calc(100%-80px)] p-4 overflow-hidden">
        <div className="h-full flex items-center justify-center">
          {isLoading && (
            <motion.div
              className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col items-center space-y-4">
                <motion.div
                  className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Loading Preview...
                </span>
              </div>
            </motion.div>
          )}
          
          <motion.div
            className="bg-white rounded-xl shadow-2xl overflow-hidden h-full"
            style={getDeviceStyles()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0"
              title="Live Preview"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};