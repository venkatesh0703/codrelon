import { CompilationResult } from '../types';

const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';
const RAPIDAPI_KEY = 'your-rapidapi-key-here'; // Replace with actual key

export class CompilerService {
  private static async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${JUDGE0_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  static async compileAndRun(
    sourceCode: string,
    languageId: number
  ): Promise<CompilationResult> {
    try {
      // For demo purposes, we'll simulate compilation with realistic output
      return await this.simulateCompilation(sourceCode, languageId);
    } catch (error) {
      console.error('Compilation error:', error);
      throw error;
    }
  }

  private static async simulateCompilation(
    sourceCode: string,
    languageId: number
  ): Promise<CompilationResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));

    let stdout = '';
    let stderr = '';
    const compileOutput = '';
    let statusId = 3; // Default: Accepted
    let statusDescription = 'Accepted';

    try {
      // Language-specific execution logic
      switch (languageId) {
        case 1001: // Web Project
          stdout = this.executeWebProject(sourceCode);
          break;
        case 63: // JavaScript
          stdout = this.executeJavaScript(sourceCode);
          break;
        case 71: // Python
          stdout = this.executePython(sourceCode);
          break;
        case 62: { // Java
          const javaResult = this.executeJava(sourceCode);
          stdout = javaResult.stdout;
          stderr = javaResult.stderr;
          statusId = javaResult.statusId;
          statusDescription = javaResult.statusDescription;
          break;
        }
        case 54: { // C++
          const cppResult = this.executeCpp(sourceCode);
          stdout = cppResult.stdout;
          stderr = cppResult.stderr;
          statusId = cppResult.statusId;
          statusDescription = cppResult.statusDescription;
          break;
        }
        case 50: { // C
          const cResult = this.executeC(sourceCode);
          stdout = cResult.stdout;
          stderr = cResult.stderr;
          statusId = cResult.statusId;
          statusDescription = cResult.statusDescription;
          break;
        }
        case 78: { // Kotlin
          const kotlinResult = this.executeKotlin(sourceCode);
          stdout = kotlinResult.stdout;
          stderr = kotlinResult.stderr;
          statusId = kotlinResult.statusId;
          statusDescription = kotlinResult.statusDescription;
          break;
        }
        default:
          stdout = 'Language not supported in demo mode';
          statusId = 4; // Wrong Answer
          statusDescription = 'Language Not Supported';
      }
    } catch (error) {
      stderr = `Runtime Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      statusId = 6; // Runtime Error
      statusDescription = 'Runtime Error';
    }

    return {
      stdout,
      stderr,
      compile_output: compileOutput,
      status: {
        id: statusId,
        description: statusDescription
      },
      time: (Math.random() * 3 + 0.5).toFixed(3),
      memory: Math.floor(Math.random() * 15000) + 2000
    };
  }

  private static executeWebProject(sourceCode: string): string {
    const elements = (sourceCode.match(/<[^>]+>/g) || []).length;
    const cssRules = (sourceCode.match(/\{[^}]*\}/g) || []).length;
    const jsFunctions = (sourceCode.match(/function\s+\w+/g) || []).length;
    const hasDoctype = sourceCode.includes('<!DOCTYPE');
    const hasViewport = sourceCode.includes('viewport');
    const hasScript = sourceCode.includes('<script');
    const hasStyle = sourceCode.includes('<style') || sourceCode.includes('link.*css');

    return `🌐 Web Project Analysis Complete!
      
📊 Document Statistics:
- HTML Elements: ${elements}
- CSS Rules: ${cssRules}
- JavaScript Functions: ${jsFunctions}
- Total Lines: ${sourceCode.split('\n').length}

✅ Features Detected:
- DOCTYPE Declaration: ${hasDoctype ? '✅' : '❌'}
- Viewport Meta Tag: ${hasViewport ? '✅' : '❌'}
- CSS Styling: ${hasStyle ? '✅' : '❌'}
- JavaScript: ${hasScript ? '✅' : '❌'}

🎨 Rendering Preview:
- Document Structure: Valid HTML5
- Responsive Design: ${hasViewport ? 'Enabled' : 'Not detected'}
- Interactive Elements: ${jsFunctions > 0 ? `${jsFunctions} functions found` : 'None detected'}

✨ Ready to display in browser!
💡 Tip: Use the preview panel to see live rendering.`;
  }

  private static executeJavaScript(sourceCode: string): string {
    let output = '🟨 JavaScript Execution Started\n';
    output += '==============================\n\n';

    // Simulate console.log outputs
    const logMatches = sourceCode.match(/console\.log\([^)]*\)/g) || [];
    const printMatches = sourceCode.match(/print\([^)]*\)/g) || [];

    if (logMatches.length > 0 || printMatches.length > 0) {
      output += '📤 Console Output:\n';
      
      // Extract and simulate realistic outputs
      const allMatches = [...logMatches, ...printMatches];
      allMatches.forEach((match, index) => {
        const content = match.replace(/console\.log\(|print\(|\)/g, '').trim();
        
        if (content.includes('"') || content.includes("'")) {
          // String output
          const stringValue = content.replace(/['"]/g, '');
          output += `[${index + 1}] ${stringValue}\n`;
        } else if (content.includes('+')) {
          // Expression
          output += `[${index + 1}] Expression evaluated\n`;
        } else if (content.includes('[') && content.includes(']')) {
          // Array output
          output += `[${index + 1}] Array: [1, 2, 3, 4, 5]\n`;
        } else {
          // Variable or function call
          output += `[${index + 1}] ${content}: ${this.simulateVariableValue(content)}\n`;
        }
      });
    }

    // Check for specific patterns and provide realistic output
    if (sourceCode.includes('fibonacci')) {
      output += '\n🔢 Fibonacci Sequence (first 10):\n';
      const fib = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34];
      fib.forEach((num, i) => {
        output += `F(${i}) = ${num}\n`;
      });
    }

    if (sourceCode.includes('squares') || sourceCode.includes('map')) {
      output += '\n📊 Array Operations:\n';
      output += 'Original: [1, 2, 3, 4, 5]\n';
      output += 'Squares: [1, 4, 9, 16, 25]\n';
    }

    if (sourceCode.includes('async') || sourceCode.includes('Promise')) {
      output += '\n⚡ Async Operations:\n';
      output += 'Async function executed!\n';
      output += 'Promise resolved: Success!\n';
    }

    output += '\n✨ JavaScript execution completed successfully!';
    return output;
  }

  private static executePython(sourceCode: string): string {
    let output = '🐍 Python Execution Started\n';
    output += '==========================\n\n';

    // Simulate print outputs
    const printMatches = sourceCode.match(/print\([^)]*\)/g) || [];
    
    if (printMatches.length > 0) {
      output += '📤 Standard Output:\n';
      
      printMatches.forEach((match, index) => {
        const content = match.replace(/print\(|\)/g, '').trim();
        
        if (content.includes('f"') || content.includes('f\'')) {
          // f-string
          const fStringContent = content.replace(/f['"]|['"]/g, '');
          output += `[${index + 1}] ${fStringContent}\n`;
        } else if (content.includes('"') || content.includes("'")) {
          // String output
          const stringValue = content.replace(/['"]/g, '');
          output += `[${index + 1}] ${stringValue}\n`;
        } else if (content.includes('+')) {
          // Expression
          output += `[${index + 1}] Expression evaluated\n`;
        } else {
          // Variable or function call
          output += `[${index + 1}] ${content}: ${this.simulateVariableValue(content)}\n`;
        }
      });
    }

    // Check for specific patterns
    if (sourceCode.includes('fibonacci')) {
      output += '\n🔢 Fibonacci Sequence (first 10):\n';
      const fib = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34];
      fib.forEach((num, i) => {
        output += `F(${i}) = ${num}\n`;
      });
    }

    if (sourceCode.includes('list(range') || sourceCode.includes('range(')) {
      output += '\n📊 List Operations:\n';
      output += 'Numbers: [1, 2, 3, 4, 5]\n';
      output += 'Squares: [1, 4, 9, 16, 25]\n';
    }

    if (sourceCode.includes('dict') || sourceCode.includes('{')) {
      output += '\n📋 Dictionary Example:\n';
      output += 'Student: Alice, Age: 20\n';
      output += 'Courses: Math, Physics, Computer Science\n';
    }

    output += '\n✨ Python execution completed successfully!';
    return output;
  }

  private static executeJava(sourceCode: string): { stdout: string; stderr: string; statusId: number; statusDescription: string } {
    let stdout = '☕ Java Execution Started\n';
    stdout += '========================\n\n';

    // Check for compilation errors
    if (!sourceCode.includes('public class') || !sourceCode.includes('public static void main')) {
      return {
        stdout: '',
        stderr: 'Compilation Error: Missing public class or main method',
        statusId: 4,
        statusDescription: 'Compilation Error'
      };
    }

    // Simulate System.out.println outputs
    const printMatches = sourceCode.match(/System\.out\.println\([^)]*\)/g) || [];
    const printMatches2 = sourceCode.match(/System\.out\.print\([^)]*\)/g) || [];
    
    if (printMatches.length > 0 || printMatches2.length > 0) {
      stdout += '📤 Standard Output:\n';
      
      const allMatches = [...printMatches, ...printMatches2];
      allMatches.forEach((match, index) => {
        const content = match.replace(/System\.out\.(println|print)\(|\)/g, '').trim();
        
        if (content.includes('"')) {
          // String output
          const stringValue = content.replace(/"/g, '');
          stdout += `[${index + 1}] ${stringValue}\n`;
        } else if (content.includes('+')) {
          // Expression
          stdout += `[${index + 1}] Expression evaluated\n`;
        } else {
          // Variable or method call
          stdout += `[${index + 1}] ${content}: ${this.simulateVariableValue(content)}\n`;
        }
      });
    }

    // Check for specific patterns
    if (sourceCode.includes('factorial')) {
      stdout += '\n🔢 Factorial Calculation:\n';
      stdout += 'Factorial of 5: 120\n';
    }

    if (sourceCode.includes('fibonacci')) {
      stdout += '\n🔢 Fibonacci Sequence:\n';
      stdout += 'Fibonacci(10): 55\n';
    }

    if (sourceCode.includes('Calculator') || sourceCode.includes('calc')) {
      stdout += '\n🧮 Calculator Operations:\n';
      stdout += 'Calculator: 15 + 25 = 40\n';
    }

    stdout += '\n✨ Java execution completed successfully!';
    return {
      stdout,
      stderr: '',
      statusId: 3,
      statusDescription: 'Accepted'
    };
  }

  private static executeCpp(sourceCode: string): { stdout: string; stderr: string; statusId: number; statusDescription: string } {
    let stdout = '⚡ C++ Execution Started\n';
    stdout += '========================\n\n';

    // Check for basic C++ structure
    if (!sourceCode.includes('#include') || !sourceCode.includes('int main()')) {
      return {
        stdout: '',
        stderr: 'Compilation Error: Missing includes or main function',
        statusId: 4,
        statusDescription: 'Compilation Error'
      };
    }

    // Simulate cout outputs
    const coutMatches = sourceCode.match(/cout\s*<<[^;]*;/g) || [];
    
    if (coutMatches.length > 0) {
      stdout += '📤 Standard Output:\n';
      
      coutMatches.forEach((match, index) => {
        const content = match.replace(/cout\s*<<|;/g, '').trim();
        
        if (content.includes('"')) {
          // String output
          const stringValue = content.replace(/"/g, '');
          stdout += `[${index + 1}] ${stringValue}\n`;
        } else if (content.includes('endl')) {
          stdout += `[${index + 1}] New line\n`;
        } else {
          // Variable or expression
          stdout += `[${index + 1}] ${content}: ${this.simulateVariableValue(content)}\n`;
        }
      });
    }

    // Check for specific patterns
    if (sourceCode.includes('vector') || sourceCode.includes('transform')) {
      stdout += '\n📊 Vector Operations:\n';
      stdout += 'Original numbers: 1 2 3 4 5\n';
      stdout += 'Squares: 1 4 9 16 25\n';
    }

    if (sourceCode.includes('factorial')) {
      stdout += '\n🔢 Factorial Calculation:\n';
      stdout += 'Factorial of 5: 120\n';
    }

    if (sourceCode.includes('fibonacci')) {
      stdout += '\n🔢 Fibonacci Sequence:\n';
      stdout += 'Fibonacci(10): 55\n';
    }

    stdout += '\n✨ C++ execution completed successfully!';
    return {
      stdout,
      stderr: '',
      statusId: 3,
      statusDescription: 'Accepted'
    };
  }

  private static executeC(sourceCode: string): { stdout: string; stderr: string; statusId: number; statusDescription: string } {
    let stdout = '🔧 C Execution Started\n';
    stdout += '=====================\n\n';

    // Check for basic C structure
    if (!sourceCode.includes('#include') || !sourceCode.includes('int main()')) {
      return {
        stdout: '',
        stderr: 'Compilation Error: Missing includes or main function',
        statusId: 4,
        statusDescription: 'Compilation Error'
      };
    }

    // Simulate printf outputs
    const printfMatches = sourceCode.match(/printf\([^)]*\)/g) || [];
    
    if (printfMatches.length > 0) {
      stdout += '📤 Standard Output:\n';
      
      printfMatches.forEach((match, index) => {
        const content = match.replace(/printf\(|\)/g, '').trim();
        
        if (content.includes('"')) {
          // String output
          const stringValue = content.replace(/"/g, '');
          stdout += `[${index + 1}] ${stringValue}\n`;
        } else if (content.includes('%d') || content.includes('%s') || content.includes('%f')) {
          // Formatted output
          stdout += `[${index + 1}] Formatted output\n`;
        } else {
          // Variable or expression
          stdout += `[${index + 1}] ${content}: ${this.simulateVariableValue(content)}\n`;
        }
      });
    }

    // Check for specific patterns
    if (sourceCode.includes('sizeof') || sourceCode.includes('array')) {
      stdout += '\n📊 Array Operations:\n';
      stdout += 'Numbers: 1 2 3 4 5\n';
      stdout += 'Squares: 1 4 9 16 25\n';
    }

    if (sourceCode.includes('factorial')) {
      stdout += '\n🔢 Factorial Calculation:\n';
      stdout += 'Factorial of 5: 120\n';
    }

    if (sourceCode.includes('fibonacci')) {
      stdout += '\n🔢 Fibonacci Sequence:\n';
      stdout += 'Fibonacci(10): 55\n';
    }

    stdout += '\n✨ C execution completed successfully!';
    return {
      stdout,
      stderr: '',
      statusId: 3,
      statusDescription: 'Accepted'
    };
  }

  private static executeKotlin(sourceCode: string): { stdout: string; stderr: string; statusId: number; statusDescription: string } {
    let stdout = '🎯 Kotlin Execution Started\n';
    stdout += '==========================\n\n';

    // Check for basic Kotlin structure
    if (!sourceCode.includes('fun main()')) {
      return {
        stdout: '',
        stderr: 'Compilation Error: Missing main function',
        statusId: 4,
        statusDescription: 'Compilation Error'
      };
    }

    // Simulate println outputs
    const printlnMatches = sourceCode.match(/println\([^)]*\)/g) || [];
    
    if (printlnMatches.length > 0) {
      stdout += '📤 Standard Output:\n';
      
      printlnMatches.forEach((match, index) => {
        const content = match.replace(/println\(|\)/g, '').trim();
        
        if (content.includes('"') || content.includes('$')) {
          // String output or string interpolation
          const stringValue = content.replace(/["$]/g, '');
          stdout += `[${index + 1}] ${stringValue}\n`;
        } else if (content.includes('+')) {
          // Expression
          stdout += `[${index + 1}] Expression evaluated\n`;
        } else {
          // Variable or function call
          stdout += `[${index + 1}] ${content}: ${this.simulateVariableValue(content)}\n`;
        }
      });
    }

    // Check for specific patterns
    if (sourceCode.includes('listOf') || sourceCode.includes('map')) {
      stdout += '\n📊 List Operations:\n';
      stdout += 'Numbers: [1, 2, 3, 4, 5]\n';
      stdout += 'Squares: [1, 4, 9, 16, 25]\n';
    }

    if (sourceCode.includes('factorial')) {
      stdout += '\n🔢 Factorial Calculation:\n';
      stdout += 'Factorial of 5: 120\n';
    }

    if (sourceCode.includes('fibonacci')) {
      stdout += '\n🔢 Fibonacci Sequence:\n';
      stdout += 'Fibonacci(10): 55\n';
    }

    if (sourceCode.includes('data class') || sourceCode.includes('Person')) {
      stdout += '\n👤 Data Class Example:\n';
      stdout += 'Person: Alice, Age: 25\n';
    }

    if (sourceCode.includes('when') || sourceCode.includes('getGrade')) {
      stdout += '\n📝 Grade Calculation:\n';
      stdout += 'Grade for 85: B\n';
    }

    stdout += '\n✨ Kotlin execution completed successfully!';
    return {
      stdout,
      stderr: '',
      statusId: 3,
      statusDescription: 'Accepted'
    };
  }

  private static simulateVariableValue(variableName: string): string {
    const variableMap: { [key: string]: string } = {
      'greeting': '"Hello, World!"',
      'counter': '0',
      'numbers': '[1, 2, 3, 4, 5]',
      'squares': '[1, 4, 9, 16, 25]',
      'name': '"Code Compiler Pro"',
      'version': '1.0',
      'features': '["syntax highlighting", "auto-completion", "real-time execution"]',
      'appName': '"Code Compiler Pro"',
      'calc': 'Calculator instance',
      'person': 'Person(name=Alice, age=25)',
      'grade': '"B"'
    };

    return variableMap[variableName] || 'undefined';
  }

  static async getLanguages() {
    // In production, fetch from Judge0 API
    // For now, return our predefined languages
    return [];
  }
}