import { type Metadata } from "next";
import CheckTable from "./components/CheckTable";

import {
  columnsData,
} from "./variables/columnsData";
import tableData from "./variables/tableData.json";


export const metadata: Metadata = {
  title: 'HCMUT | Vehicle',
}

const DataTablesPage = () => {
  return (
    <div className="mt-5 grid min-h-[calc(100vh-126px)] grid-cols-1 gap-5">
      <CheckTable
        columnsData={columnsData}
        tableData={tableData}
      />
    </div>
  );
};

export default DataTablesPage;
