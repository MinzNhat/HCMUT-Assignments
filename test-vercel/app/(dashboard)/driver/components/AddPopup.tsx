"use client"
import React, { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { Button } from "@nextui-org/react";
import Dropzone from "./Dropzone";
import axios from "axios";

interface DriverData {
    driver_name: string;
    phone_num: string;
    address: string;
    status: number;
    license: File[];
}

interface City {
    Id: string;
    Name: string;
    Districts: District[];
}

interface District {
    Id: string;
    Name: string;
    Wards: Ward[];
}

interface Ward {
    Id: string;
    Name: string;
}

interface AddPopupProps {
    onClose: () => void;
}

const AddPopup: React.FC<AddPopupProps> = ({ onClose }) => {
    const notificationRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [files, setFiles] = useState<File[]>([]);
    const [data, setData] = useState<DriverData>({
        driver_name: "",
        phone_num: "",
        address: "",
        status: 0,
        license: [],
    });

    const [errors, setErrors] = useState({
        driver_name: "",
        phone_num: "",
        address: "",
        status: "",
        license: "",
    });

    const [cities, setCities] = useState<City[]>([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");

    useEffect(() => {
        const fetchCities = async () => {
            const response = await axios.get(
                "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
            );
            setCities(response.data);
        };

        fetchCities();
    }, []);

    const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCity(event.target.value);
        setSelectedDistrict("");
    };

    const handleDistrictChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedDistrict(event.target.value);
    };

    const selectedCityObj = cities.find((city) => city.Id === selectedCity);
    const districts = selectedCityObj ? selectedCityObj.Districts : [];

    const selectedDistrictObj = districts.find(
        (district) => district.Id === selectedDistrict
    );
    const wards = selectedDistrictObj ? selectedDistrictObj.Wards : [];

    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                handleClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleSubmitClick = () => {

    };

    return (
        <motion.div
            className={`fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-[#000000] bg-opacity-10 dark:bg-white dark:bg-opacity-5 z-50`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                backdropFilter: "blur(6px)",
            }}
            onAnimationComplete={handleAnimationComplete}
        >
            <motion.div
                ref={notificationRef}
                className={`relative w-[98%] sm:w-9/12 dark:bg-navy-900 bg-white rounded-xl p-4 overflow-y-auto`}
                initial={{ scale: 0 }}
                animate={{ scale: isVisible ? 1 : 0 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="relative items-center justify-center flex-col flex h-10 w-full border-b-2 border-gray-200 dark:!border-navy-700 overflow-hidden">
                    <div className="font-bold text-lg lg:text-2xl pb-2 w-full text-center">
                        Thêm tài xế
                    </div>
                    <Button
                        className="absolute right-0 w-8 h-8 top-0 rounded-full mb-2 hover:bg-gray-200 dark:hover:text-navy-900"
                        onClick={handleClose}
                    >
                        <IoMdClose className="w-5/6 h-5/6" />
                    </Button>
                </div>
                <div className="h-96 mt-4 relative flex flex-col lg:flex-row bg-gray-200 bg-clip-border 
                 dark:!bg-navy-800 dark:text-white w-full overflow-y-scroll p-4 rounded-sm">
                    <div className="flex flex-col gap-5 lg:w-1/2 lg:pt-2 lg:pr-5">
                        <div className="flex">
                            <div className="w-1/2 font-bold text-base">
                                Tên tài xế:
                            </div>
                            <input
                                className="w-1/2 dark:text-[#000000] px-2 rounded"
                                type="text"
                                value={data.driver_name}
                                onChange={(e) => setData({ ...data, driver_name: e.target.value })}
                            />
                        </div>
                        <div className="flex">
                            <div className="w-1/2 font-bold text-base">
                                Số điện thoại:
                            </div>
                            <input
                                className="w-1/2 dark:text-[#000000] px-2 rounded"
                                type="text"
                                value={data.phone_num}
                                onChange={(e) => setData({ ...data, phone_num: e.target.value })}
                            />
                        </div>
                        <div className="flex">
                            <div className="w-1/2 font-bold text-base">
                                Địa chỉ cụ thể:
                            </div>
                            <input
                                className="w-1/2 dark:text-[#000000] px-2 rounded"
                                type="text"
                                value={data.address}
                                onChange={(e) => setData({ ...data, address: e.target.value })}
                            />
                        </div>
                        <div className="flex">
                            <div className="w-1/2 font-bold text-base">
                                Tỉnh thành:
                            </div>
                            <select
                                className="w-1/2 dark:text-[#000000] px-2 rounded"
                                id="city"
                                aria-label=".form-select-sm"
                                value={selectedCity}
                                onChange={handleCityChange}
                            >
                                <option value="">Chọn tỉnh thành</option>
                                {cities.map((city) => (
                                    <option key={city.Id} value={city.Id}>
                                        {city.Name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex">
                            <div className="w-1/2 font-bold text-base">
                                Quận/Huyện:
                            </div>
                            <select
                                className="w-1/2 dark:text-[#000000] px-2 rounded"
                                id="district"
                                aria-label=".form-select-sm"
                                value={selectedDistrict}
                                onChange={handleDistrictChange}
                            >
                                <option value="">Chọn quận huyện</option>
                                {districts.map((district) => (
                                    <option key={district.Id} value={district.Id}>
                                        {district.Name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex">
                            <div className="w-1/2 font-bold text-base">
                                Phường/Xã:
                            </div>
                            <select
                                className="w-1/2 dark:text-[#000000] px-2 rounded"
                                aria-label=".form-select-sm"
                                id="ward"
                            >
                                <option value="">Chọn phường xã</option>
                                {wards.map((ward) => (
                                    <option key={ward.Id} value={ward.Id}>
                                        {ward.Name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex">
                            <div className="w-1/2 font-bold text-base">
                                Trạng thái:
                            </div>
                            <select
                                className="w-1/2 dark:text-[#000000] px-2 rounded"
                                value={data.status}
                                onChange={(e) => setData({ ...data, status: parseInt(e.target.value) })}
                            >
                                <option value={0}>Sẵn sàng</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col lg:w-1/2 dark:bg-navy-900 bg-white rounded-xl p-4 pt-2 mt-6 lg:mt-0 h-full">
                        <span className="w-full text-center font-bold text-lg pb-2">
                            Thêm giấy phép lái xe
                        </span>
                        <Dropzone files={files} setFiles={setFiles} className={`${files.length == 0 ? "h-full" : "h-28 px-3"}  flex justify-center place-items-center mt-1`} />
                    </div>
                </div>

                <div className="w-full flex">
                    <Button
                        className="w-full rounded-lg mt-5 mb-1 py-3 text-[#545e7b] border-[#545e7b] hover:border-green-600 dark:hover:bg-green-700 
                        bg-transparent  hover:text-white border-2 hover:bg-green-600 dark:text-white dark:hover:border-green-700 
                        hover:shadow-md"
                        onClick={handleSubmitClick}
                    >
                        <span>
                            Xác nhận
                        </span>
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AddPopup;
