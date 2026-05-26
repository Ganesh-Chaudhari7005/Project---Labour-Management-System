import React from 'react'
import { motion } from 'framer-motion'
export default function BillReceiptsClient() {
  return (
     <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
           receipt
        </motion.div>
  )
}
