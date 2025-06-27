import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Hammer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import auctionImage from '/src/assets/hero_image.jpg';

export const Hero = () => {
  const [currentMetric, setCurrentMetric] = useState(0);
  // const navigate = useNavigate();

  const metrics = [
    { label: "Average CPM", value: "$3.42" },
    { label: "Auctions Today", value: "1.2M+" },
    { label: "Response Time", value: "<8ms" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetric((prev) => (prev + 1) % metrics.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.3, staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-8">
            <motion.div className="space-y-4" variants={itemVariants}>
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                Real-Time Ad Marketplace
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-black leading-tight">
                Revolutionize your <span className="text-orange-500">Ad Auctions</span>.
                <br /> Bid Smart. Win Big.
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Transform the way advertisers and publishers connect. Host real-time, transparent auctions for premium ad slots. Secure the best deals, optimize your ad reach, and stay ahead with intelligent bidding analytics.
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 flex items-center space-x-2"
                  // onClick={() => navigate('/login?next=post-ad')}
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Post an Ad</span>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="bg-black hover:bg-gray-800 text-white px-8 py-3 flex items-center space-x-2"
                  // onClick={() => navigate('/login?next=place-bid')}
                >
                  <Hammer className="w-5 h-5" />
                  <span>Place a Bid</span>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-8 pt-4"
              variants={itemVariants}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMetric}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-orange-500">
                    {metrics[currentMetric].value}
                  </div>
                  <div className="text-sm text-gray-600">{metrics[currentMetric].label}</div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          <motion.div 
            className="relative"
            variants={itemVariants}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', bounce: 0.4, duration: 0.8 }}
          >
            <HeroRight />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const HeroRight = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <img 
        src={auctionImage} 
        alt="Auction Item" 
        className="w-72 h-auto rounded-xl shadow-lg object-cover"
      />

      <div className="flex space-x-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white flex items-center space-x-2"
            onClick={() => window.location.href='/login?next=post-ad'}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Ad</span>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            className="bg-black hover:bg-gray-800 text-white flex items-center space-x-2"
            onClick={() => window.location.href='/login?next=place-bid'}
          >
            <Hammer className="w-4 h-4" />
            <span>Bid Now</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
