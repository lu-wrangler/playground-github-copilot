import { type JSX } from 'react';
import { SearchDemo } from './components/SearchDemo';
import './App.css';

function App(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <SearchDemo className="w-full" />

        <footer className="mt-16 text-center text-sm text-gray-600">
          <p>Built with React, TypeScript, TailwindCSS, and best practices</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
