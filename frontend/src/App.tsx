import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import AppNavigation from './navigation/Navigation'
import { Provider } from 'react-redux'
import store from './redux/store'
import { CurrencyProvider } from './contexts/CurrencyContext'
import { AuthProvider } from './contexts/AuthContext'
import { WishlistProvider } from './contexts/WishlistContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <WishlistProvider>
            <CurrencyProvider>
              <HelmetProvider>
                <div className="dance-academy-app">
                  <AppNavigation />
                  <ToastContainer position="bottom-right" theme="dark" />
                </div>
              </HelmetProvider>
            </CurrencyProvider>
          </WishlistProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  )
}

export default App

