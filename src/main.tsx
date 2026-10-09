import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.jsx'
import './index.css'
import { AppProviders } from '@/app/providers/AppProviders.js'
import ToastProvider from '@/shared/components/providers/ToastProvider.js'
import "katex/dist/katex.min.css";

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AppProviders>
      <ToastProvider>

        <App />
      </ToastProvider>

    </AppProviders>
  </React.StrictMode>,
)