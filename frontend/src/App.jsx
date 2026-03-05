import { SignedIn, SignedOut, SignInButton, SignUpButton, useUser } from '@clerk/clerk-react'
import React, { useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Accounts from './pages/Accounts'
import Transfer from './pages/Transfer'
import History from './pages/History'
import Profile from './pages/Profile'
import AdminPanel from './pages/AdminPanel'
import TransactionDetail from './pages/TransactionDetail'
import { useSyncUserToDatabase } from './hooks/useSyncUserToDatabase'
import { Layout } from './components/Layout'
import { Building2 } from 'lucide-react'
import gsap from 'gsap'

// Protected Admin Route Component
function ProtectedAdminRoute({ children }) {
  const { user } = useUser()
  const [isAdmin, setIsAdmin] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (user) {
      const isAdminUser = user?.publicMetadata?.role === 'admin'
      setIsAdmin(isAdminUser)
      setLoading(false)
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-600">Admin access required</p>
        </div>
      </div>
    )
  }

  return children
}

// Landing Page Component with GSAP animations
function LandingPage() {
  const headerRef = useRef(null)
  const headingRef = useRef(null)
  const headingSpanRef = useRef(null)
  const descriptionRef = useRef(null)
  const button1Ref = useRef(null)
  const button2Ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from(headerRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.4,
      })
      .from(headingRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.4,
      }, '-=0.2')
      .from(headingSpanRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.4,
      }, '-=0.3')
      .from(descriptionRef.current, {
        y: 15,
        opacity: 0,
        duration: 0.4,
      }, '-=0.2')
      .from([button1Ref.current, button2Ref.current], {
        y: 20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.08,
      }, '-=0.2')
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="w-full px-6 py-4 max-w-7xl mx-auto">
      <div ref={headerRef} className="mb-4 flex items-center gap-3">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-lg">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Royal Mint</h1>
          <p className="text-xs text-gray-500">Online Banking</p>
        </div>
      </div>
      <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center py-8">
        <div className="text-center space-y-6 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
            <span ref={headingRef} className="inline-block">Your Complete Banking</span>
            <br />
            <span ref={headingSpanRef} className="text-blue-600 inline-block">
              Command Center
            </span>
          </h1>
          <p ref={descriptionRef} className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Access all your banking services in one secure location. Manage
            accounts, transfer funds, and track transactions with ease.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <div ref={button1Ref}>
              <SignInButton mode="modal">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all"
                >
                  Sign In to Your Account
                </Button>
              </SignInButton>
            </div>
            <div ref={button2Ref}>
              <SignUpButton mode="modal">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-6 text-base border-2 hover:bg-gray-50"
                >
                  Open New Account
                </Button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  useSyncUserToDatabase()

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
        {/* Signed Out - Welcome Page */}
        <SignedOut>
          <LandingPage />
        </SignedOut>

        {/* Signed In - Dashboard with Layout */}
        <SignedIn>
          <Routes>
            {/* Routes without navbar (have back buttons) */}
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/transaction/:id" element={<TransactionDetail />} />
            
            {/* Routes with navbar/layout */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/transfer" element={<Layout><Transfer /></Layout>} />
            <Route 
              path="/admin" 
              element={
                <Layout>
                  <ProtectedAdminRoute>
                    <AdminPanel />
                  </ProtectedAdminRoute>
                </Layout>
              } 
            />
          </Routes>
        </SignedIn>
      </div>
    </Router>
  )
}

export default App