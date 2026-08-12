import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.jsx'
import './index.css'
import { AppProviders } from '@/app/providers/AppProviders.js'
import ToastProvider from '@/shared/components/providers/ToastProvider.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProviders>
      <ToastProvider>

        <App />
      </ToastProvider>

    </AppProviders>
  </React.StrictMode>,
)