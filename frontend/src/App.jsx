import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'
import React from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Accounts from './pages/Accounts'
import Transfer from './pages/Transfer'
import History from './pages/History'
import { useSyncUserToDatabase } from './hooks/useSyncUserToDatabase'
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowLeftRight, 
  Receipt, 
  History as HistoryIcon,
  Building2
} from 'lucide-react'

function Header() {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { name: 'Home', path: '/', icon: Building2 },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Accounts', path: '/accounts', icon: Wallet },
    { name: 'Transfer', path: '/transfer', icon: ArrowLeftRight },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'History', path: '/history', icon: HistoryIcon },
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-lg group-hover:shadow-lg transition-all">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SecureBank</h1>
              <p className="text-xs text-gray-500">Online Banking</p>
            </div>
          </div>

          {/* Navigation - Only show when signed in */}
          <SignedIn>
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className={`gap-2 ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 font-semibold' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => navigate(item.path)}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Button>
                )
              })}
            </nav>
          </SignedIn>

          {/* Auth Buttons */}
          <div className="flex gap-3 items-center">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-gray-700">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 ring-2 ring-gray-200 hover:ring-blue-500 transition-all"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  )
}

function App() {
  useSyncUserToDatabase()

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <SignedOut>
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
              <div className="text-center space-y-6 max-w-3xl">
                <div className="inline-block p-4 bg-blue-100 rounded-2xl mb-4">
                  <Building2 className="w-16 h-16 text-blue-600" />
                </div>
                <h2 className="text-6xl font-bold text-gray-900">
                  Welcome to <span className="text-blue-600">SecureBank</span>
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
          </SignedOut>

          <SignedIn>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/transfer" element={<Transfer />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </SignedIn>
        </main>
      </div>
    </Router>
  )
}

export default App