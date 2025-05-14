import './globals.css'
import LayoutWrapper from '../components/LayoutWrapper'

export const metadata = {
  title: 'Cartify - Buy and Sell Marketplace',
  description: 'A modern marketplace for buying and selling items',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}
