import { type Metadata } from "next";
import MapExport from "./component/MapExport";
import AddPanel from "./component/addPanel";

export const metadata: Metadata = {
    title: 'HCMUT | Vehicle',
}

const DataTablesPage = () => {
    return (
        <div className="mt-5 grid min-h-[calc(100vh-208px)] md:min-h-[calc(100vh-126px)] grid-cols-1 gap-5">
            <AddPanel />
        </div>
    );
};

export default DataTablesPage;
