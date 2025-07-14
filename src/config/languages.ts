export interface Language {
  id: number;
  name: string;
  extension: string;
  monacoLanguage: string;
  defaultCode: string;
  icon: string;
  category: string;
}

export interface Category {
  name: string;
  description: string;
}

export const categories: Category[] = [
  { name: 'Web', description: 'Frontend technologies' },
  { name: 'Backend', description: 'Server-side languages' },
  { name: 'System', description: 'System programming' },
  { name: 'Mobile', description: 'Mobile development' },
];

export const languages: Language[] = [
  // Web Technologies - Connected Project
  {
    id: 1001,
    name: 'Web Project',
    extension: 'html',
    monacoLanguage: 'html',
    icon: '🌐',
    category: 'Web',
    defaultCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web Project</title>
    <style>
        /* Your CSS will appear here */
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1 class="title">Welcome to My Web Project</h1>
            <p class="subtitle">Built with HTML, CSS & JavaScript</p>
        </header>
        
        <main class="main-content">
            <section class="card">
                <h2>Interactive Demo</h2>
                <button id="colorBtn" class="btn">Change Colors</button>
                <button id="animateBtn" class="btn">Animate</button>
                <div id="demo-box" class="demo-box">
                    <p>Click the buttons to see magic happen!</p>
                </div>
            </section>
            
            <section class="card">
                <h2>Counter Example</h2>
                <div class="counter-container">
                    <button id="decrementBtn" class="counter-btn">-</button>
                    <span id="counter" class="counter-display">0</span>
                    <button id="incrementBtn" class="counter-btn">+</button>
                </div>
            </section>
        </main>
        
        <footer class="footer">
            <p>&copy; 2024 Code Compiler Pro</p>
        </footer>
    </div>

    <script>
        /* Your JavaScript will appear here */
    </script>
</body>
</html>`
  },
  
  // Individual Languages
  {
    id: 63,
    name: 'JavaScript',
    extension: 'js',
    monacoLanguage: 'javascript',
    icon: '🟨',
    category: 'Web',
    defaultCode: `// Welcome to JavaScript!
console.log("🚀 JavaScript is running!");

// Variables and Functions
const greeting = "Hello, World!";
let counter = 0;

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Array methods
const numbers = [1, 2, 3, 4, 5];
const squares = numbers.map(n => n * n);

console.log("Greeting:", greeting);
console.log("Squares:", squares);
console.log("Fibonacci(10):", fibonacci(10));

// Modern JavaScript features
const asyncExample = async () => {
    console.log("Async function executed!");
    return "Success!";
};

asyncExample().then(result => console.log(result));`
  },

  {
    id: 71,
    name: 'Python',
    extension: 'py',
    monacoLanguage: 'python',
    icon: '🐍',
    category: 'Backend',
    defaultCode: `# Welcome to Python!
print("🐍 Python is awesome!")

# Variables and data types
name = "Code Compiler Pro"
version = 1.0
features = ["syntax highlighting", "auto-completion", "real-time execution"]

print(f"Welcome to {name} v{version}")
print("Features:", ", ".join(features))

# Functions
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

def calculate_squares(numbers):
    return [x ** 2 for x in numbers]

# Main execution
if __name__ == "__main__":
    numbers = list(range(1, 6))
    squares = calculate_squares(numbers)
    
    print(f"Numbers: {numbers}")
    print(f"Squares: {squares}")
    print(f"Fibonacci(10): {fibonacci(10)}")
    
    # Dictionary example
    student = {
        "name": "Alice",
        "age": 20,
        "courses": ["Math", "Physics", "Computer Science"]
    }
    
    print(f"Student: {student['name']}, Age: {student['age']}")
    print("Courses:", ", ".join(student["courses"]))`
  },

  {
    id: 62,
    name: 'Java',
    extension: 'java',
    monacoLanguage: 'java',
    icon: '☕',
    category: 'Backend',
    defaultCode: `// Welcome to Java!
public class Main {
    public static void main(String[] args) {
        System.out.println("☕ Java is running!");
        
        // Variables
        String appName = "Code Compiler Pro";
        double version = 1.0;
        
        System.out.println("Welcome to " + appName + " v" + version);
        
        // Array and loops
        int[] numbers = {1, 2, 3, 4, 5};
        System.out.print("Numbers: ");
        for (int num : numbers) {
            System.out.print(num + " ");
        }
        System.out.println();
        
        // Method calls
        System.out.println("Factorial of 5: " + factorial(5));
        System.out.println("Fibonacci(10): " + fibonacci(10));
        
        // Object-oriented example
        Calculator calc = new Calculator();
        System.out.println("Calculator: 15 + 25 = " + calc.add(15, 25));
    }
    
    public static int factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }
    
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}

class Calculator {
    public int add(int a, int b) {
        return a + b;
    }
    
    public int multiply(int a, int b) {
        return a * b;
    }
}`
  },

  {
    id: 54,
    name: 'C++',
    extension: 'cpp',
    monacoLanguage: 'cpp',
    icon: '⚡',
    category: 'System',
    defaultCode: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

// Function declarations
int fibonacci(int n);
int factorial(int n);
void printVector(const vector<int>& vec);

int main() {
    cout << "⚡ C++ is powerful!" << endl;
    
    // Variables
    string appName = "Code Compiler Pro";
    double version = 1.0;
    
    cout << "Welcome to " << appName << " v" << version << endl;
    
    // Vector example
    vector<int> numbers = {1, 2, 3, 4, 5};
    cout << "Original numbers: ";
    printVector(numbers);
    
    // Transform vector
    vector<int> squares;
    transform(numbers.begin(), numbers.end(), back_inserter(squares),
              [](int n) { return n * n; });
    
    cout << "Squares: ";
    printVector(squares);
    
    // Function calls
    cout << "Factorial of 5: " << factorial(5) << endl;
    cout << "Fibonacci(10): " << fibonacci(10) << endl;
    
    return 0;
}

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

void printVector(const vector<int>& vec) {
    for (int num : vec) {
        cout << num << " ";
    }
    cout << endl;
}`
  },

  {
    id: 50,
    name: 'C',
    extension: 'c',
    monacoLanguage: 'c',
    icon: '🔧',
    category: 'System',
    defaultCode: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Function declarations
int fibonacci(int n);
int factorial(int n);
void printArray(int arr[], int size);

int main() {
    printf("🔧 C Programming Language!\\n");
    
    // Variables
    char appName[] = "Code Compiler Pro";
    float version = 1.0f;
    
    printf("Welcome to %s v%.1f\\n", appName, version);
    
    // Array example
    int numbers[] = {1, 2, 3, 4, 5};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    
    printf("Numbers: ");
    printArray(numbers, size);
    
    // Calculate squares
    printf("Squares: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", numbers[i] * numbers[i]);
    }
    printf("\\n");
    
    // Function calls
    printf("Factorial of 5: %d\\n", factorial(5));
    printf("Fibonacci(10): %d\\n", fibonacci(10));
    
    return 0;
}

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
}`
  },

  {
    id: 78,
    name: 'Kotlin',
    extension: 'kt',
    monacoLanguage: 'kotlin',
    icon: '🎯',
    category: 'Mobile',
    defaultCode: `// Welcome to Kotlin!
fun main() {
    println("🎯 Kotlin is modern!")
    
    // Variables
    val appName = "Code Compiler Pro"
    val version = 1.0
    
    println("Welcome to $appName v$version")
    
    // Lists and higher-order functions
    val numbers = listOf(1, 2, 3, 4, 5)
    val squares = numbers.map { it * it }
    
    println("Numbers: $numbers")
    println("Squares: $squares")
    
    // Function calls
    println("Factorial of 5: \${factorial(5)}")
    println("Fibonacci(10): \${fibonacci(10)}")
    
    // Data class example
    val person = Person("Alice", 25)
    println("Person: \${person.name}, Age: \${person.age}")
    
    // When expression
    val grade = getGrade(85)
    println("Grade for 85: $grade")
}

fun fibonacci(n: Int): Int {
    return if (n <= 1) n else fibonacci(n - 1) + fibonacci(n - 2)
}

fun factorial(n: Int): Int {
    return if (n <= 1) 1 else n * factorial(n - 1)
}

fun getGrade(score: Int): String {
    return when {
        score >= 90 -> "A"
        score >= 80 -> "B"
        score >= 70 -> "C"
        score >= 60 -> "D"
        else -> "F"
    }
}

data class Person(val name: String, val age: Int)`
  }
];

export const getLanguagesByCategory = (category: string): Language[] => {
  return languages.filter(lang => lang.category === category);
};

export const getLanguageById = (id: number): Language | undefined => {
  return languages.find(lang => lang.id === id);
};