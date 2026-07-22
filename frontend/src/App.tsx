import { HelmetProvider } from 'react-helmet-async'

import AppNavigation from './navigation/Navigation'
import { Provider } from 'react-redux'
import store from './redux/store'
import { CurrencyProvider } from './contexts/CurrencyContext'
import { AuthProvider } from './contexts/AuthContext'
import { WishlistProvider } from './contexts/WishlistContext'
import { SiteDataProvider } from './contexts/SiteDataContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './styles/share-actions.css'

function App() {
  return (
    <Provider store={store}>
      
        <AuthProvider>
          <WishlistProvider>
            <CurrencyProvider>
              <SiteDataProvider>
              <HelmetProvider>
                <div className="dance-studio-app">
                  <AppNavigation />
                  <ToastContainer position="bottom-right" theme="dark" />
                </div>
              </HelmetProvider>
              </SiteDataProvider>
            </CurrencyProvider>
          </WishlistProvider>
        </AuthProvider>
      
    </Provider>
  )
}

export default App

