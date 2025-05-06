'use client'; // Add this at the top for Next.js 13+

import Link from "next/link";
import { motion } from "framer-motion"; // Fixed import (was "motion/react")

export default function Custom404() {  // Changed to default export
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
      },
    },
  };

  const wobble = {
    hidden: { rotate: 0 },
    show: {
      rotate: [0, -5, 5, -5, 5, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatDelay: 3,
      },
    },
  };

  const bounce = {
    hidden: { y: -20 },
    show: {
      y: [0, -30, 0, -15, 0, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 4,
      },
    },
  };

  return (
    <div className="flex items-center justify-center h-[100vh] bg-gray-100">
      <motion.div
        className="text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.h1 className="text-6xl font-bold text-red-500" variants={wobble}>
          404
        </motion.h1>
        
        <motion.p className="text-2xl mt-4 text-gray-700" variants={item}>
          Oops! Page not found.
        </motion.p>
        
        <motion.div variants={bounce}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/"
              className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Go Home
            </Link>
          </motion.div>
        </motion.div>
        
        <motion.p 
          className="mt-8 text-gray-500"
          variants={item}
          animate={{
            scale: [1, 1.1, 1],
            transition: {
              repeat: Infinity,
              duration: 2,
            },
          }}
        >
          The page you're looking for ran away!
        </motion.p>
        
        <motion.div
          className="mt-8"
          animate={{
            x: ["0%", "20%", "-20%", "10%", "-10%", "0%"],
            transition: {
              duration: 6,
              repeat: Infinity,
            },
          }}
        >
          <motion.div
            className="text-4xl"
            animate={{
              rotate: 360,
              transition: {
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              },
            }}
          >
            🏃‍♂️
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}