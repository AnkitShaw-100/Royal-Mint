import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Accounts from './pages/Accounts'
import Transfer from './pages/Transfer'
import History from './pages/History'
import { useSyncUserToDatabase } from './hooks/useSyncUserToDatabase'
import { Layout } from './components/Layout'
import { Building2 } from 'lucide-react'

function App() {
  useSyncUserToDatabase()

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
        {/* Signed Out - Welcome Page */}
        <SignedOut>
          <div className="w-full px-6 py-8 max-w-7xl mx-auto">
            <div className="mb-8 flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Royal Mint</h1>
                <p className="text-xs text-gray-500">Online Banking</p>
              </div>
            </div>
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
              <div className="text-center space-y-6 max-w-3xl">
                <div className="inline-block p-4 bg-blue-100 rounded-2xl mb-4">
                  <Building2 className="w-16 h-16 text-blue-600" />
                </div>
                <h2 className="text-6xl font-bold text-gray-900">
                  Welcome to <span className="text-blue-600">Royal Mint</span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  Experience modern banking with enterprise-grade security. 
                  Manage your finances with confidence and ease.
                </p>
                <div className="flex gap-4 justify-center pt-4">
                  <SignInButton mode="modal">
                    <Button size="lg" variant="outline" className="text-base px-8">
                      Sign In to Your Account
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-base px-8">
                      Open New Account
                    </Button>
                  </SignUpButton>
                </div>
                <div className="pt-8 grid grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">99.9%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">256-bit</div>
                    <div className="text-sm text-gray-600">Encryption</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">24/7</div>
                    <div className="text-sm text-gray-600">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SignedOut>

        {/* Signed In - Dashboard with Layout */}
        <SignedIn>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/transfer" element={<Transfer />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </Layout>
        </SignedIn>
      </div>
    </Router>
  )
}

export default App