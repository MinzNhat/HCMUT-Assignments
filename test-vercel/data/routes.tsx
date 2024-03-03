// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
} from "react-icons/md";
import { FaCar, FaRoad, FaChartPie } from "react-icons/fa";
import { FaPersonBiking } from "react-icons/fa6";

const routes = [
  {
    name: "Báo cáo thống kê",
    layout: "/",
    path: "/",
    icon: <FaChartPie className="h-5 w-5 ml-0.5" />,
  },
  {
    name: "Phương tiện",
    layout: "/dashboard",
    path: "vehicle",
    icon: <FaCar className="h-5 w-5 ml-0.5" />,
    secondary: true,
  },
  {
    name: "Lộ trình",
    layout: "/dashboard",
    icon: <FaRoad className="h-5 w-5 ml-0.5" />,
    path: "route",
  },
  {
    name: "Tài xế",
    layout: "/dashboard",
    path: "driver",
    icon: <FaPersonBiking className="h-5 w-5 ml-0.5" />,
  }
];

export default routes;
