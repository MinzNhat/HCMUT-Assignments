import dynamic from "next/dynamic";
import {
  MdArrowDropUp,
  MdOutlineCalendarToday,
  MdBarChart,
} from "react-icons/md";
import Card from "@/components/card";
import {
  lineChartDataTotalSpent,
  lineChartOptionsTotalSpent,
} from "@/data/charts";
import { Button } from "@nextui-org/react";

const LineChart = dynamic(() => import("@/components/charts/LineChart"), {
  loading: () => <p className='mt-10'>Đang tải dữ liệu...</p>,
  ssr: false
})

const TotalSpent = () => {
  return (
    <Card className="!p-[20px] text-center">
      <div className="flex justify-between">
        <Button className="linear mt-1 flex items-center justify-center gap-2 rounded-lg bg-lightPrimary p-2 text-gray-600 transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:hover:opacity-90 dark:active:opacity-80">
          <MdOutlineCalendarToday />
          <span className="text-sm font-medium text-gray-600">Theo ngày</span>
        </Button>
        <button className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10">
          <MdBarChart className="h-6 w-6" />
        </button>
      </div>

      <div className="flex h-full w-full flex-col sm:flex-row gap-2 justify-between 2xl:overflow-hidden">
        <div className="flex gap-2 justify-between sm:justify-start sm:flex-col">
          <p className="mt-[10px] sm:mt-[20px] text-3xl font-bold text-navy-700 dark:text-white flex">
            ...<p className="mt-1">₫</p>
          </p>
          <div className="flex flex-col items-end sm:items-start">
            <p className="mt-2 text-sm text-gray-600 whitespace-nowrap">Tổng lợi nhuận</p>
            <div className="flex flex-row items-center justify-center">
              <MdArrowDropUp className="font-medium text-green-500" />
              <p className="text-sm font-bold text-green-500"> +...% </p>
            </div>
          </div>
        </div>
        <div className="h-full min-h-[200px] w-full">
          <LineChart
            // @ts-ignore
            options={lineChartOptionsTotalSpent}
            series={lineChartDataTotalSpent}
          />
        </div>
      </div>
    </Card>
  );
};

export default TotalSpent;
