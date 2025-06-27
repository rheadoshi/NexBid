import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Badge } from '@/components/ui/badge';

export const HowItWorks = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const steps = [
    {
      number: "1️",
      title: "Create an Account",
      description: "Register as an advertiser or admin to get started."
    },
    {
      number: "2️",
      title: "Post Your Ad or Open a Slot",
      description: "List your ad details or open premium slots for bidding."
    },
    {
      number: "3️",
      title: "Join Live Auctions",
      description: "Place bids in real-time and secure your desired ad slots."
    },
    {
      number: "4️",
      title: "Track Performance",
      description: "Monitor ad reach, slot impressions, and engagement with live analytics."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-orange-50 to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <motion.div 
          className="text-center space-y-4 mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="bg-orange-100 text-orange-800">Getting Started</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-black">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started with NexBid in four simple steps and maximize your ad revenue effortlessly.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div 
          ref={ref}
          className="grid md:grid-cols-2 gap-10"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              className="text-center space-y-3"
              variants={stepVariants}
            >
              <div className="text-4xl">{step.number}</div>
              <h3 className="text-xl font-semibold text-black">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
        
      </div>
    </section>
  );
};
