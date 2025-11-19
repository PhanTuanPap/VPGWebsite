import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactBubbles from '@/components/ContactBubbles'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <ContactBubbles />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
