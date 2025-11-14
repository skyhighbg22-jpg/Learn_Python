// Pyodide integration for Python execution in browser
// This utility provides a safe Python execution environment

export interface PyodideOptions {
  output?: (output: string) => void;
  error?: (error: string) => void;
  stdout?: (stdout: string) => void;
  stderr?: (stderr: string) => void;
}

export class PyodideRunner {
  private module: any = null;
  private initialized = false;

  constructor() {
    this.initializePyodide();
  }

  private async initializePyodide() {
    if (this.initialized) return;

    try {
      // Load Pyodide from CDN
      await this.loadPyodideScript();

      // Initialize Pyodide
      if ((window as any).pyodide) {
        this.module = await (window as any).pyodide.loadPackage('pyodide-python');

        // Set up Python standard library
        await this.module.runPythonAsync(`
import sys
import io
import json
import math
import random
import datetime
import re
from typing import List, Dict, Any, Optional

# Enhanced print function for Pyodide output
def print_wrapper(*args, **kwargs):
    \"\"\"\"\"Built-in print function that captures output for the editor\"\"\"\"
    global _pyodide_output

    if _pyodide_output is None:
        _pyodide_output = []

    _pyodide_output.append(str(args) if len(args) == 1 else ' '.join(map(str, args)))

    # Try to capture the actual output
    try:
        # Redirect stdout to our capture system
        output = ' '.join(map(str, args)) if len(args) == 1 else str(args)
        print(output)
    except:
        print(str(args))

# Make print_wrapper globally available
globals()['print'] = print_wrapper

# Test function to verify it works
print("Pyodide initialized successfully")
        `);

        this.initialized = true;
      }
    } catch (error) {
      console.error('Failed to initialize Pyodide:', error);
    }
  }

  private async loadPyodideScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).pyodide) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23/pyodide.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async runPython(code: string, options: PyodideOptions = {}): Promise<{
    success: boolean;
    output: string;
    error?: string;
  }> {
    if (!this.initialized) {
      await this.initializePyodide();
    }

    return new Promise((resolve) => {
      if (!this.module) {
        resolve({ success: false, error: 'Pyodide not initialized' });
        return;
      }

      // Set up output capture
      let capturedOutput = '';
      let capturedError = '';

      const outputStream = {
        write: (output: string) => {
          capturedOutput += output;
          options.stdout?.(output);
        }
      };

      const errorStream = {
        write: (error: string) => {
          capturedError = error;
          options.error?.(error);
        }
      };

      try {
        // Run the Python code with custom output streams
        await this.module.runPythonAsync(code, {
          stdout: outputStream,
          stderr: errorStream,
        });

        // Wait a bit for execution to complete
        await new Promise(resolve => setTimeout(resolve, 100));

        const result = {
          success: !capturedError,
          output: capturedError || capturedOutput,
          error: capturedError,
        };

        resolve(result);
      } catch (error) {
        resolve({ success: false, error: error.toString() });
      }
    });
  }

  // Check if Pyodide is available
  static isAvailable(): boolean {
    return typeof (window as any).pyodide !== 'undefined';
  }

  // Get Python standard library version
  static getPythonVersion(): string {
    return (window as any).pyodide?.py_version || '3.11+';
  }
}