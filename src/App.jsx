import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import { ScrollToTop } from './components/Common.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import { BlogIndex, BlogPost } from './pages/Blog.jsx'
import Testimonials from './pages/Testimonials.jsx'
import Legal from './pages/Legal.jsx'
import BookingRedirect from './components/BookingRedirect.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contact" element={<BookingRedirect />} />
          <Route path="/privacy" element={<Legal title="Privacy Policy" />} />
          <Route path="/terms" element={<Legal title="Terms of Service" />} />
          {/* Routes from the previous design, kept so old links still resolve */}
          <Route path="/insights" element={<Navigate to="/blog" replace />} />
          <Route path="/insights/:slug" element={<Navigate to="/blog" replace />} />
          <Route path="/specializations/*" element={<Navigate to="/" replace />} />
          <Route path="/services/*" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
