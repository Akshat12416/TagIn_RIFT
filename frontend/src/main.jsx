import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import "./wallet-theme.css"
import "./wallet-override.css"



import {
  NetworkId,
  WalletId,
  WalletManager,
  WalletProvider
} from '@txnlab/use-wallet-react'

import {
  WalletUIProvider
} from '@txnlab/use-wallet-ui-react'

import App from './App.jsx'
import './index.css'

// ✅ Create Wallet Manager
const walletManager = new WalletManager({
  wallets: [
    WalletId.LUTE
  ],
  defaultNetwork: NetworkId.TESTNET
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WalletProvider manager={walletManager}>
      <WalletUIProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </WalletUIProvider>
    </WalletProvider>
  </StrictMode>
)
