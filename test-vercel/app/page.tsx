import dynamic from 'next/dynamic';
import { FC } from 'react';

// import MiniCalendar from "@/components/calendar/MiniCalendar";
import WeeklyRevenue from "./components/WeeklyRevenue";
import TotalSpent from "./components/TotalSpent";
import PieChartCard from "./components/PieChartCard";
import { MdBarChart } from "react-icons/md";

import { columnsDataCheck, columnsDataComplex } from "./variables/columnsData";

import Widget from "@/components/widget/Widget";
import ComplexTable from "./components/ComplexTable";
import DailyTraffic from "./components/DailyTraffic";
import TaskCard from "./components/TaskCard";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataComplex from "./variables/tableDataComplex.json";
import { FaCarSide, FaRoad } from "react-icons/fa";
import { IoPersonCircleSharp } from "react-icons/io5";

const MiniCalendar = dynamic(() => import("@/components/calendar/MiniCalendar"), {
    loading: () => <p className='mt-10'>Đang tải dữ liệu...</p>,
    ssr: false
})

type Props = {};

const DashboardPage: FC<Props> = () => {
    return (
        <div className="min-h-[calc(100vh-118px)]">
            {/* Card widget */}
            <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
                <Widget
                    icon={<FaCarSide className="h-7 w-7" />}
                    title={"Xe"}
                    subtitle={"Số lượng: 350"}
                />
                <Widget
                    icon={<IoPersonCircleSharp className="h-7 w-7" />}
                    title={"Tài xế"}
                    subtitle={"Số lượng: 240"}
                />
                <Widget
                    icon={<FaRoad className="h-7 w-7" />}
                    title={"Lộ trình"}
                    subtitle={"Số lượng: 574"}
                />
            </div>

            {/* Charts */}
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                <TotalSpent />
                <WeeklyRevenue />
            </div>

            {/* Tables & Charts */}
            <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
                {/* Traffic chart & Pie Chart */}
                <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
                    <DailyTraffic />
                    <PieChartCard />
                </div>
                {/* Task chart & Calendar */}
                <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
                    <TaskCard />
                    <div className="grid grid-cols-1 rounded-[20px]">
                        <MiniCalendar />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;