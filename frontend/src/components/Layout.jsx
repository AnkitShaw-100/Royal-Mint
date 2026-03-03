import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      {/* Navbar */}
      <Navbar />

      {/* Main Content - Responsive padding */}
      <main className="flex-1 w-full mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8 max-w-7xl">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
