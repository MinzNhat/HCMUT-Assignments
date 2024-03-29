import dynamic from 'next/dynamic';
import { FC } from 'react';
import WeeklyRevenue from "./components/WeeklyRevenue";
import TotalSpent from "./components/TotalSpent";
import PieChartCard from "./components/PieChartCard";
import Widget from "@/components/widget/Widget";
import DailyTraffic from "./components/DailyTraffic";
import TaskCard from "./components/TaskCard";
import { FaCarSide, FaRoad } from "react-icons/fa";
import { IoPersonCircleSharp } from "react-icons/io5";
import CarsData from "./(dashboard)/vehicle/variables/carsData.json"

const MiniCalendar = dynamic(() => import("@/components/calendar/MiniCalendar"), {
    loading: () => <p className='mt-10'>Đang tải dữ liệu...</p>,
    ssr: false
})

type Props = {};

const DashboardPage: FC<Props> = () => {
    return (
        <div className="min-h-[calc(100vh-118px)]">
            <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
                <Widget
                    icon={<FaCarSide className="h-7 w-7" />}
                    title={"Xe"}
                    subtitle={"Số lượng: " + CarsData.length}
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

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
                    <DailyTraffic />
                    <PieChartCard />
                </div>
                <TotalSpent />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
                <WeeklyRevenue />
                <div className="grid grid-cols-1 gap-5 rounded-[20px]">
                    <TaskCard />
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;