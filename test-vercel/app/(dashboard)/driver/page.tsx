'use client'
import CheckTable from "./components/CheckTable";
import { motion } from "framer-motion";
import {
  columnsData,
} from "./variables/columnsData";
import { useCallback, useEffect, useState } from "react";
import { DriverOperation } from "@/library/driver";
import CustomLoadingElement from "../loading";

const DriverManager = () => {
  const [tableData, setTableData] = useState<any>(null)
  const driver = new DriverOperation();

  const handlerFetchDriver = async () => {
    const response = await driver.viewAllDriver();
    console.log(response)
    setTableData(response.data)
  }

  useEffect(() => {
    handlerFetchDriver()
  }, []);

  const reloadData = useCallback(() => {
    handlerFetchDriver();
  }, []);
  return (
    <div className="mt-5 grid min-h-[calc(100vh-126px)] grid-cols-1 gap-5">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {tableData ? <CheckTable
          columnsData={columnsData}
          tableData={tableData}
          reloadData={reloadData}
        /> : <CustomLoadingElement />}
      </motion.div>
    </div>
  );
};

export default DriverManager;

