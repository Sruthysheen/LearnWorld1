import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {Provider} from 'react-redux'
import { store , persistedStore} from './Store/store'
import { PersistGate } from 'redux-persist/integration/react'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store = {store}>
    <PersistGate persistor={persistedStore} loading={null}>
      <React.StrictMode>
      <App />
    </React.StrictMode>,
  </PersistGate>
  </Provider>
)
