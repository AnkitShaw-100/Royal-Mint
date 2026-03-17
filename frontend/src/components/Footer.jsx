import { SignedIn } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import LogoImg from '@/assets/Logo.png'
import { 
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react'

export function Footer() {
  const navigate = useNavigate()

  const currentYear = new Date().getFullYear()

  const footerLinks = {
    'Product': [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Accounts', path: '/accounts' },
      { name: 'Transfers', path: '/transfer' },
      { name: 'History', path: '/history' },
    ],
    'Company': [
      { name: 'About Us', path: '#' },
      { name: 'Careers', path: '#' },
      { name: 'Blog', path: '#' },
      { name: 'Press', path: '#' },
    ],
    'Support': [
      { name: 'Help Center', path: '#' },
      { name: 'Contact Us', path: '#' },
      { name: 'FAQs', path: '#' },
      { name: 'Status', path: '#' },
    ],
    'Legal': [
      { name: 'Privacy Policy', path: '#' },
      { name: 'Terms of Service', path: '#' },
      { name: 'Security', path: '#' },
      { name: 'Compliance', path: '#' },
    ],
  }

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', url: '#' },
    { icon: Twitter, label: 'Twitter', url: '#' },
    { icon: Instagram, label: 'Instagram', url: '#' },
    { icon: Linkedin, label: 'LinkedIn', url: '#' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12 lg:py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-12 mb-8 md:mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2 lg:col-span-1 space-y-3 md:space-y-4">
            <div className="flex items-center gap-2 md:gap-3">
              <img src={LogoImg} alt="Royal Mint Logo" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
              <div>
                <h3 className="text-base md:text-lg font-bold">Royal Mint</h3>
                <p className="text-xs text-gray-400">Online Banking</p>
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
              Secure, modern banking solutions for everyone. Experience banking the way it should be.
            </p>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-2 md:space-y-4">
              <h4 className="text-sm md:text-base font-semibold text-white">{category}</h4>
              <ul className="space-y-1 md:space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Button
                      variant="link"
                      className="text-xs md:text-sm text-gray-400 hover:text-blue-400 p-0 h-auto font-normal justify-start"
                      onClick={() => link.path !== '#' && navigate(link.path)}
                    >
                      {link.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 py-6 md:py-8" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 md:gap-8">
          {/* Copyright */}
          <div className="text-xs md:text-sm text-gray-400 text-center sm:text-left">
            <p>&copy; {currentYear} Royal Mint. All rights reserved.</p>
            <p className="mt-1 md:mt-2">
              Protecting your financial future with{' '}
              <span className="text-blue-400 font-medium">enterprise-grade security</span>
            </p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center sm:justify-end gap-3 md:gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.label}
                  href={social.url}
                  className="text-gray-400 hover:text-blue-400 transition-colors p-2 hover:bg-gray-800 rounded-lg"
                  title={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                </a>
              )
            })}
          </div>
        </div>
      </div>

    </footer>
  )
}
