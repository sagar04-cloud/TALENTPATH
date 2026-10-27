import { Outlet } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FloatingWhatsApp } from './FloatingWhatsApp';

export const PublicLayout = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen flex flex-col bg-brand-bgLight text-brand-darkText relative">
      {/* Top Reading Scroll Progress Bar with luminous indigo-purple gradient */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 z-50 origin-left shadow-[0_0_12px_rgba(79,70,229,0.7)]"
        style={{ scaleX }}
      />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};
