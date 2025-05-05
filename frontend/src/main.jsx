import React from 'react'
import ReactDOM from 'react-dom/client'
import NormalizeCSS from 'normalize.css'
import App from './App'
import './index.css'
import { store } from './components/store'
import { Provider } from 'react-redux'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Provider store={store}>
          <App />
      </Provider>

  </React.StrictMode>
)
