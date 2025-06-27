import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShieldCheck, BarChartBig } from 'lucide-react';

export const Features = () => {
  const features = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Real-Time Bidding Engine",
      description: "Experience lightning-fast, live auctions with instant bid updates and competitive pricing."
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Verified Advertisers & Slots",
      description: "Only authenticated advertisers and premium ad slots for a trustworthy, high-quality auction environment."
    },
    {
      icon: <BarChartBig className="w-8 h-8" />,
      title: "Data-Driven Insights",
      description: "Track bidding patterns, pricing trends, and slot performance with intuitive analytics dashboards."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = (index) => ({
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1, duration: 0.5, type: 'spring', stiffness: 100 }
    }
  });

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <motion.div 
          className="text-center space-y-4 mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="bg-orange-100 text-orange-800">Platform Features</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-black">Why Choose NexBid?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A platform tailored for publishers and advertisers to trade premium ad inventory with transparency, speed, and data-backed precision.
          </p>
        </motion.div>

        {/* 3 Feature Cards */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={cardVariants(index)}>
              <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-orange-200 h-full">
                <CardHeader className="space-y-4">
                  <motion.div 
                    className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300"
                    whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                  >
                    {feature.icon}
                  </motion.div>
                  <CardTitle className="text-xl text-black">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
