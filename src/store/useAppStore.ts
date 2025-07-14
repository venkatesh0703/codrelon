import { create } from 'zustand';
import { AppState, CodeFile, CompilationResult, Language, WebProject, WebProjectFile } from '../types';

interface AppStore extends AppState {
  setCurrentFile: (file: CodeFile | null) => void;
  addFile: (file: CodeFile) => void;
  updateFile: (id: string, content: string) => void;
  deleteFile: (id: string) => void;
  setCompiling: (isCompiling: boolean) => void;
  setCompilationResult: (result: CompilationResult | null) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  toggleConsole: () => void;
  togglePreview: () => void;
  createNewFile: (language: Language) => void;
  createWebProject: () => void;
  addWebProjectFile: (type: 'html' | 'css' | 'js', name?: string) => void;
  updateWebProjectFile: (fileId: string, content: string) => void;
  deleteWebProjectFile: (fileId: string) => void;
  setActiveWebFile: (fileId: string) => void;
  renameWebProjectFile: (fileId: string, newName: string) => void;
  runCode: () => Promise<void>;
}

const createDefaultWebProject = (): WebProject => {
  const htmlFileId = 'html-1';
  const cssFileId = 'css-1';
  const jsFileId = 'js-1';

  return {
    id: 'web-project-1',
    name: 'My Web Project',
    activeFileId: htmlFileId,
    files: [
      {
        id: htmlFileId,
        name: 'index.html',
        type: 'html',
        lastModified: new Date(),
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Chat Bot</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="chat-container">
        <div class="chat-header">
            Simple Chat Bot
        </div>
        <div class="chat-messages" id="chat-messages">
            <div class="message bot-message">Hello! I'm a simple chat bot. How can I help you today?</div>
        </div>
        <div class="chat-input">
            <input type="text" id="user-input" placeholder="Type your message..." autocomplete="off">
            <button id="send-button">Send</button>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>`
      },
      {
        id: cssFileId,
        name: 'styles.css',
        type: 'css',
        lastModified: new Date(),
        content: `body {
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background-color: #f5f5f5;
}

.chat-container {
    width: 350px;
    height: 500px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
}

.chat-header {
    background-color: #4CAF50;
    color: white;
    padding: 15px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    text-align: center;
}

.chat-messages {
    flex: 1;
    padding: 15px;
    overflow-y: auto;
}

.message {
    margin-bottom: 15px;
    max-width: 80%;
    padding: 10px;
    border-radius: 5px;
    word-wrap: break-word;
}

.bot-message {
    background-color: #e9e9e9;
    align-self: flex-start;
}

.user-message {
    background-color: #4CAF50;
    color: white;
    align-self: flex-end;
    margin-left: auto;
}

.chat-input {
    display: flex;
    padding: 10px;
    border-top: 1px solid #ddd;
}

#user-input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    outline: none;
}

#send-button {
    margin-left: 10px;
    padding: 10px 15px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

#send-button:hover {
    background-color: #45a049;
}`
      },
      {
        id: jsFileId,
        name: 'script.js',
        type: 'js',
        lastModified: new Date(),
        content: `document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    
    // Add event listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Bot responses
    const botResponses = {
        "hello": "Hello there! How can I assist you?",
        "hi": "Hi! What can I do for you today?",
        "how are you": "I'm just a bot, but I'm functioning well! How about you?",
        "what's your name": "I'm Simple Chat Bot, nice to meet you!",
        "bye": "Goodbye! Have a great day!",
        "thanks": "You're welcome! Is there anything else I can help with?",
        "help": "I can respond to simple greetings and questions. Try saying hello, asking my name, or saying goodbye.",
        "default": "I'm not sure I understand. Could you try asking something else?"
    };
    
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessage(message, 'user-message');
        userInput.value = '';
        
        // Simulate bot thinking
        setTimeout(() => {
            const botMessage = getBotResponse(message.toLowerCase());
            addMessage(botMessage, 'bot-message');
        }, 500);
    }
    
    function addMessage(text, className) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', className);
        messageElement.textContent = text;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function getBotResponse(message) {
        for (const key in botResponses) {
            if (message.includes(key)) {
                return botResponses[key];
            }
        }
        return botResponses['default'];
    }
});`
      }
    ],
    lastModified: new Date()
  };
};

export const useAppStore = create<AppStore>((set) => ({
  currentFile: null,
  files: [],
  webProject: null,
  isCompiling: false,
  compilationResult: null,
  theme: 'dark',
  sidebarOpen: true,
  consoleOpen: false,
  previewOpen: false,

  setCurrentFile: (file) => set({ currentFile: file }),

  addFile: (file) => set((state) => ({ 
    files: [...state.files, file],
    currentFile: file
  })),

  updateFile: (id, content) => set((state) => ({
    files: state.files.map(f => f.id === id ? { ...f, content, lastModified: new Date() } : f),
    currentFile: state.currentFile?.id === id ? { ...state.currentFile, content, lastModified: new Date() } : state.currentFile,
  })),

  deleteFile: (id) => set((state) => {
    const remainingFiles = state.files.filter(f => f.id !== id);
    const newCurrentFile = state.currentFile?.id === id 
      ? (remainingFiles.length > 0 ? remainingFiles[0] : null)
      : state.currentFile;
    
    return {
      files: remainingFiles,
      currentFile: newCurrentFile,
    };
  }),

  setCompiling: (isCompiling) => set({ isCompiling }),

  setCompilationResult: (result) => set({ compilationResult: result }),

  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  toggleConsole: () => set((state) => ({ consoleOpen: !state.consoleOpen })),

  togglePreview: () => set((state) => ({ previewOpen: !state.previewOpen })),

  createNewFile: (language) => {
    const timestamp = Date.now();
    const newFile: CodeFile = {
      id: `file-${timestamp}`,
      name: `main.${language.extension}`,
      content: language.defaultCode,
      language,
      lastModified: new Date(),
    };
    
    set((state) => ({
      files: [...state.files, newFile],
      currentFile: newFile,
      webProject: null, // Clear web project when creating individual file
    }));
  },

  createWebProject: () => {
    const newProject = createDefaultWebProject();
    set(() => ({
      webProject: newProject,
      currentFile: null, // Clear individual file when creating web project
      previewOpen: true,
    }));
  },

  addWebProjectFile: (type, name) => set((state) => {
    if (!state.webProject) return state;

    const timestamp = Date.now();
    const defaultNames = {
      html: 'page.html',
      css: 'style.css',
      js: 'script.js'
    };

    const defaultContent = {
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Page</title>
</head>
<body>
    <h1>New HTML Page</h1>
    <p>Start building your page here!</p>
</body>
</html>`,
      css: `/* New CSS File */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
}

h1 {
    color: #333;
}`,
      js: `// New JavaScript File
console.log('New JS file loaded!');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ready!');
});`
    };

    const newFile: WebProjectFile = {
      id: `${type}-${timestamp}`,
      name: name || defaultNames[type],
      type,
      content: defaultContent[type],
      lastModified: new Date()
    };

    return {
      webProject: {
        ...state.webProject,
        files: [...state.webProject.files, newFile],
        activeFileId: newFile.id,
        lastModified: new Date()
      }
    };
  }),

  updateWebProjectFile: (fileId, content) => set((state) => {
    if (!state.webProject) return state;

    return {
      webProject: {
        ...state.webProject,
        files: state.webProject.files.map(file =>
          file.id === fileId ? { ...file, content, lastModified: new Date() } : file
        ),
        lastModified: new Date()
      }
    };
  }),

  deleteWebProjectFile: (fileId) => set((state) => {
    if (!state.webProject) return state;

    const remainingFiles = state.webProject.files.filter(f => f.id !== fileId);
    const newActiveFileId = state.webProject.activeFileId === fileId
      ? (remainingFiles.length > 0 ? remainingFiles[0].id : '')
      : state.webProject.activeFileId;

    return {
      webProject: {
        ...state.webProject,
        files: remainingFiles,
        activeFileId: newActiveFileId,
        lastModified: new Date()
      }
    };
  }),

  setActiveWebFile: (fileId) => set((state) => {
    if (!state.webProject) return state;

    return {
      webProject: {
        ...state.webProject,
        activeFileId: fileId
      }
    };
  }),

  renameWebProjectFile: (fileId, newName) => set((state) => {
    if (!state.webProject) return state;

    return {
      webProject: {
        ...state.webProject,
        files: state.webProject.files.map(file =>
          file.id === fileId ? { ...file, name: newName, lastModified: new Date() } : file
        ),
        lastModified: new Date()
      }
    };
  }),

  runCode: async () => {
    const { currentFile, webProject, setCompiling, setCompilationResult, consoleOpen, toggleConsole } = useAppStore.getState();
    
    if (!currentFile && !webProject) {
      console.error('No file selected');
      return;
    }

    if (!consoleOpen) {
      toggleConsole();
    }

    setCompiling(true);
    setCompilationResult(null);

    try {
      const { CompilerService } = await import('../services/compilerService');
      let result;
      
      if (webProject) {
        result = await CompilerService.compileAndRun(
          webProject.files.find(f => f.type === 'html')?.content || '',
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
      }
    } catch (error) {
      console.error('Compilation error:', error);
      setCompilationResult({
        stdout: '',
        stderr: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        compile_output: '',
        status: { id: 6, description: 'Runtime Error' },
        time: '0.000',
        memory: 0
      });
    } finally {
      setCompiling(false);
    }
  },
}));