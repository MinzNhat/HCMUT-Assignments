import dynamic from "next/dynamic";
import { pieChartData, pieChartOptions } from "@/data/charts";
import Card from "@/components/card";

const PieChart = dynamic(() => import("@/components/charts/PieChart"), {
  loading: () => <p className='mt-10'>Đang tải dữ liệu...</p>,
  ssr: false
})

const PieChartCard = () => {
  return (
    <Card className="rounded-[20px] p-3">
      <div className="flex flex-row justify-between px-3 pt-2">
        <div className="w-full">
          <h4 className="text-lg font-bold text-navy-700 dark:text-white w-full text-center">
            Trạng thái tài xế
          </h4>
        </div>
      </div>

      <div className="mb-auto flex h-[220px] w-full items-center justify-center mt-10">
        <PieChart
          // @ts-ignore
          options={pieChartOptions}
          series={pieChartData}
        />
      </div>
      <div className="flex flex-row !justify-between rounded-2xl px-6 py-3 shadow-2xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-brand-500" />
            <p className="ml-1 text-sm font-normal text-gray-600">Sẵn sàng</p>
          </div>
          <p className="mt-px text-xl font-bold text-navy-700  dark:text-white">
            63%
          </p>
        </div>

        <div className="h-11 w-px bg-gray-300 dark:bg-white/10" />

        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-[#6AD2FF]" />
            <p className="ml-1 text-sm font-normal text-gray-600">Đang bận</p>
          </div>
          <p className="mt-px text-xl font-bold text-navy-700 dark:text-white">
            25%
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PieChartCard;
