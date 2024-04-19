'use client'
import CheckTable from "./components/CheckTable";
import { motion } from "framer-motion";
import {
  columnsData,
} from "./variables/columnsData";
import { VehicleOperation } from "@/library/vehicle";
import { useEffect, useState } from "react";

const DataTablesPage = () => {
  const [tableData, setTableData] = useState<any>(null)
  const vehice = new VehicleOperation();

  const handleFetchVehicle = async () => {
    const response = await vehice.viewAllVehicle();
    console.log(response)
    setTableData(response.data)
  }

  useEffect(() => {
    handleFetchVehicle()
  }, []);

  return (
    <div className="mt-5 grid min-h-[calc(100vh-126px)] grid-cols-1 gap-5">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {tableData && <CheckTable
          columnsData={columnsData}
          tableData={tableData}
        />}
      </motion.div>
    </div>
  );
};

export default DataTablesPage;

