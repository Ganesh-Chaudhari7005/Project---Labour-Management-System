import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

export default function EquipmentsDash() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3>All Equipments</h3>
      </motion.div>
    </>
  );
}
