import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

const Footer = () => {
  // Use your username from the requirement
  const username = "rheadoshi";
  
  const footerLinks = [
    {
      title: "Platform",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#" },
        { name: "Documentation", href: "#" },
        { name: "API", href: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Contact", href: "#" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", href: "#" },
        { name: "Publisher Guide", href: "#" },
        { name: "Status", href: "#" },
        { name: "Privacy Policy", href: "#" }
      ]
    }
  ];

  const columnVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: index => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5
      }
    })
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: index => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.3 + (index * 0.05),
        duration: 0.3
      }
    })
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <motion.div 
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={columnVariants}
            custom={0}
          >
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">AdAuction SSP</span>
            </motion.div>
            <p className="text-gray-400">
              The leading supply-side platform for maximizing publisher ad revenue through 
              real-time auction technology.
            </p>
            <div className="text-gray-400 text-sm">
              Developed by <span className="text-orange-400">{username}</span>
            </div>
          </motion.div>

          {footerLinks.map((column, columnIndex) => (
            <motion.div 
              key={column.title}
              className="space-y-4"
              initial="hidden"
              animate="visible"
              variants={columnVariants}
              custom={columnIndex + 1}
            >
              <h4 className="font-semibold text-white">{column.title}</h4>
              <div className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <motion.a 
                    key={link.name}
                    href={link.href} 
                    className="block text-gray-400 hover:text-orange-500 transition-colors"
                    variants={linkVariants}
                    custom={linkIndex}
                    whileHover={{ x: 5 }}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="border-t border-gray-800 mt-12 pt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <p className="text-gray-400">
            © 2025 AdAuction SSP. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Last updated: 2025-06-26
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;