'use client'
import { motion } from "framer-motion";
import {
  columnsData,
} from "./variables/columnsData";
import routeData from "./variables/routeData.json";
import CheckTable from "./components/CheckTable";

const DriverManager = () => {
  return (
    <div className="mt-5 grid min-h-[calc(100vh-126px)] grid-cols-1 gap-5">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CheckTable
          columnsData={columnsData}
          tableData={routeData}
        />
      </motion.div>
    </div>
  );
};

export default DriverManager;