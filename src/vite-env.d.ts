
/// <reference types="vite/client" />

// Add global window extensions
interface Window {
  handleTreeSelection: (level1: string, level2: string) => void;
}
