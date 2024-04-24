
import { barChartDataDailyTraffic, past7DaysData } from "@/data/charts";
import { barChartOptionsDailyTraffic } from "@/data/charts";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import Card from "@/components/card";
import dynamic from "next/dynamic";

const BarChart = dynamic(() => import("@/components/charts/BarChart"), {
  loading: () => <p className='mt-10'>Đang tải dữ liệu...</p>,
  ssr: false
})

const DailyTraffic = () => {
  const calculateTotalTrips7Days = () => {
    let totalTrips = 0;
    const changePercentage = ((past7DaysData[6]?.tripsCount - past7DaysData[5]?.tripsCount) / past7DaysData[5]?.tripsCount) * 100;
    past7DaysData.forEach(dayData => {
      totalTrips += dayData.tripsCount;
    });
    return totalTrips;
  };
  const percentage = past7DaysData[5]?.tripsCount != 0 ? ((past7DaysData[6]?.tripsCount - past7DaysData[5]?.tripsCount) / past7DaysData[5]?.tripsCount) * 100 : 0;
  return (
    <Card className="pb-7 p-[20px] grow">
      <div className="flex flex-row justify-between">
        <div className="ml-1 pt-2">
          <p className="text-sm font-medium leading-4 text-gray-600">
            Lộ trình theo ngày
          </p>
          <p className="text-[34px] font-bold text-navy-700 dark:text-white">
            {calculateTotalTrips7Days()}{" "}
            <span className="text-sm font-medium leading-6 text-gray-600">
              chuyến xe
            </span>
          </p>
        </div>
        <div className="mt-2 flex items-start">
          <div className={`flex items-center text-sm ${percentage > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {percentage > 0 ? <MdArrowDropUp className="h-5 w-5" /> : <MdArrowDropDown className="h-5 w-5" />}
            <p className="font-bold"> {percentage > 0 ? `+${percentage.toFixed(2)}%` : `${percentage.toFixed(2)}%`} </p>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full pt-10 pb-0">
        <BarChart
          chartData={barChartDataDailyTraffic}
          // @ts-ignore
          chartOptions={barChartOptionsDailyTraffic}
        />
      </div>
    </Card>
  );
};

export default DailyTraffic;
