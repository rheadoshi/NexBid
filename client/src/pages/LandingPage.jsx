import React from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { JoinUs } from '@/components/landing/JoinUs';
import { Footer } from '@/components/Footer';

// Animation variants for page sections
const pageVariants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export default function LandingPage() {
  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <Navigation />
      <Hero />
      <Features />
      <HowItWorks />
      <JoinUs />
      <Footer />
    </motion.div>
  );
}