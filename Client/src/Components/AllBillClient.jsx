import React from 'react'
import { motion } from 'framer-motion'
export default function AllBillClient() {
  return (
   <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
       all bill
    </motion.div>
  )
}
