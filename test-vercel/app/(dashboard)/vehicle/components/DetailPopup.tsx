"use client"
import React, { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { Button } from "@nextui-org/react";
import { FaTrash, FaPen } from "react-icons/fa";
import MiniCalendar from "@/components/calendar/MiniCalendar";

interface VehicleData {
    type: string;
    licenseplate: string;
    enginefuel: string;
    height: string;
    length: string;
    width: string;
    mass: string;
    status: string;
}

interface DetailPopupProps {
    onClose: () => void;
    dataInitial: VehicleData;
}

const DetailPopup: React.FC<DetailPopupProps> = ({ onClose, dataInitial }) => {
    const notificationRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [data, setData] = useState(dataInitial);

    const [isEditing, setIsEditing] = useState(false);
    const [missing, setMissing] = useState({
        licenseplate: false,
        height: false,
        length: false,
        width: false,
        mass: false,
    });

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        let tempMissing = {
            licenseplate: false,
            height: false,
            length: false,
            width: false,
            mass: false,
        };

        if (data.licenseplate === "") tempMissing.licenseplate = true;
        if (data.height === "" || data.height === "0") tempMissing.height = true;
        if (data.length === "" || data.length === "0") tempMissing.length = true;
        if (data.width === "" || data.width === "0") tempMissing.width = true;
        if (data.mass === "" || data.mass === "0") tempMissing.mass = true;

        setMissing(tempMissing);

        const anyMissing = Object.values(tempMissing).some(value => value);
        if (anyMissing) {
            alert("Vui lòng nhập đầy đủ các trường thông tin.");
        } else {
            setIsEditing(false);
        }
    };

    useEffect(() => {
        let tempMissing: { licenseplate: boolean; height: boolean; length: boolean; width: boolean; mass: boolean } = {
            licenseplate: false,
            height: false,
            length: false,
            width: false,
            mass: false,
        };

        if (data.licenseplate === "" || data.height === "0" || data.length === "0" || data.width === "0" || data.mass === "0") {
            if (data.licenseplate === "") tempMissing = { ...tempMissing, licenseplate: true };
            if (data.height === "0" || data.height === "") tempMissing = { ...tempMissing, height: true };
            if (data.length === "0" || data.length === "") tempMissing = { ...tempMissing, length: true };
            if (data.width === "0" || data.width === "") tempMissing = { ...tempMissing, width: true };
            if (data.mass === "0" || data.mass === "") tempMissing = { ...tempMissing, mass: true };
        }

        setMissing(tempMissing);
    }, [data]);

    // Hàm xử lý nhập cho các trường số
    const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Kiểm tra nếu giá trị nhập vào chỉ chứa số hoặc dấu chấm
        if (/^\d*\.?\d*$/.test(value)) {
            // Cập nhật giá trị của trường số
            setData({ ...data, [name]: value });
        }
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
        >
            <motion.div
                ref={notificationRef}
                className={`relative w-[98%] sm:w-9/12 dark:bg-navy-900 bg-white rounded-xl p-4`}
                initial={{ scale: 0 }}
                animate={{ scale: isVisible ? 1 : 0 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="relative items-center justify-center flex-col flex h-10 w-full border-b-2 border-gray-200 dark:!border-navy-700 overflow-hidden">
                    <div className="font-bold text-lg sm:text-2xl pb-2 w-full text-center">
                        Thông tin xe
                    </div>
                    <Button
                        className="absolute right-0 w-8 h-8 top-0 rounded-full mb-2 hover:bg-gray-200 dark:hover:text-navy-900"
                        onClick={() => onClose()}
                    >
                        <IoMdClose className="w-5/6 h-5/6" />
                    </Button>
                </div>
                <div className="h-96 mt-4 relative flex flex-col lg:flex-row bg-gray-200 bg-clip-border 
                 dark:!bg-navy-800 dark:text-white w-full overflow-y-scroll p-4 rounded-sm">
                    <div className="flex flex-col gap-5 lg:w-1/2 lg:pt-2 lg:pr-5">
                        {/* Các trường thông tin xe */}
                        <div className="flex">
                            <div className="w-1/2 font-bold text-base">
                                Phân loại:
                            </div>
                            {isEditing ? (
                                <select
                                    className="w-1/2 dark:text-[#000000] pl-2 rounded"
                                    value={data.type}
                                    onChange={(e) =>
                                        setData({ ...data, type: e.target.value })
                                    }
                                >
                                    <option value="Bus">Xe khách</option>
                                    <option value="Container Truck">Xe Container</option>
                                    <option value="Truck">Xe tải</option>
                                </select>
                            ) : (
                                <div>{data.type === "Bus" ? "Xe khách" : (data.type === "Container Truck" ? "Xe Container" : "Xe tải")}</div>
                            )}
                        </div>
                        <div className="flex">
                            <div className="w-1/2 font-bold text-base">
                                Biển số xe:
                            </div>
                            {isEditing ? (
                                <input
                                    className={`w-1/2 dark:text-[#000000] pl-2 rounded ${missing.licenseplate ? "border-2 border-red-500" : ""}`}
                                    type="text"
                                    value={data.licenseplate}
                                    onChange={(e) =>
                                        setData({ ...data, licenseplate: e.target.value })
                                    }
                                />
                            ) : (
                                <div>{data.licenseplate}</div>
                            )}
                        </div>
                        <div className="flex">
                            <div className="w-1/2 font-bold text-base">
                                Loại động cơ:
                            </div>
                            {isEditing ? (
                                <select
                                    className="w-1/2 dark:text-[#000000] pl-2 rounded"
                                    value={data.enginefuel}
                                    onChange={(e) =>
                                        setData({ ...data, enginefuel: e.target.value })
                                    }
                                >
                                    <option value="Gasoline">Gasoline</option>
                                    <option value="Diesel">Diesel</option>
                                </select>
                            ) : (
                                <div>{data.enginefuel}</div>
                            )}
                        </div>
                        <div className="flex">
                            <div className="w-1/2 font-bold text-base">
                                Trạng thái:
                            </div>
                            {isEditing ? (
                                <select
                                    className="w-1/2 dark:text-[#000000] pl-2 rounded"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData({ ...data, status: e.target.value })
                                    }
                                >
                                    <option value="Active">Đang hoạt động</option>
                                    <option value="Inactive">Không hoạt động</option>
                                    <option value="Maintenance">Đang bảo trì</option>
                                </select>
                            ) : (
                                <div>{data.status === "Active" ? "Đang hoạt động" : (data.status === "Inactive" ? "Không hoạt động" : "Đang bảo trì")}</div>
                            )}
                        </div>
                        <div className="flex">
                            <div className="w-1/2 font-bold text-base">
                                Tải trọng:
                            </div>
                            {isEditing ? (
                                <input
                                    className={`w-1/2 dark:text-[#000000] pl-2 rounded ${missing.mass ? "border-2 border-red-500" : ""}`}
                                    type="text" // Thay đổi type từ number sang text
                                    name="mass"
                                    value={data.mass}
                                    onChange={handleNumericInputChange} // Sử dụng hàm xử lý nhập mới
                                />
                            ) : (
                                <div>{data.mass}</div>
                            )}
                        </div>
                        <div className="flex ">
                            <div className="w-1/2 font-bold text-base">
                                Chiều dài:
                            </div>
                            {isEditing ? (
                                <input
                                    className={`w-1/2 dark:text-[#000000] pl-2 rounded ${missing.length ? "border-2 border-red-500" : ""}`}
                                    type="text" // Thay đổi type từ number sang text
                                    name="length"
                                    value={data.length}
                                    onChange={handleNumericInputChange} // Sử dụng hàm xử lý nhập mới
                                />
                            ) : (
                                <div>{data.length}</div>
                            )}
                        </div>
                        <div className="flex">
                            <div className="w-1/2 font-bold text-base">
                                Chiều rộng:
                            </div>
                            {isEditing ? (
                                <input
                                    className={`w-1/2 dark:text-[#000000] pl-2 rounded ${missing.width ? "border-2 border-red-500" : ""}`}
                                    type="text" // Thay đổi type từ number sang text
                                    name="width"
                                    value={data.width}
                                    onChange={handleNumericInputChange} // Sử dụng hàm xử lý nhập mới
                                />
                            ) : (
                                <div>{data.width}</div>
                            )}
                        </div>
                        <div className="flex">
                            <div className="w-1/2 font-bold text-base">
                                Chiều cao:
                            </div>
                            {isEditing ? (
                                <input
                                    className={`w-1/2 dark:text-[#000000] pl-2 rounded ${missing.height ? "border-2 border-red-500" : ""}`}
                                    type="text" // Thay đổi type từ number sang text
                                    name="height"
                                    value={data.height}
                                    onChange={handleNumericInputChange} // Sử dụng hàm xử lý nhập mới
                                />
                            ) : (
                                <div>{data.height}</div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col lg:w-1/2 dark:bg-navy-900 bg-white rounded-xl p-4 mt-4 lg:mt-0">
                        <span className="w-full text-center font-bold text-base pb-2">
                            Đặt lịch bảo dưỡng định kỳ
                        </span>
                        <MiniCalendar />
                    </div>
                </div>

                <div className="w-full flex">
                    {!isEditing ? (
                        <Button
                            className="w-full rounded-lg mt-5 mb-1 py-3 text-[#545e7b] border-[#545e7b] hover:border-green-600 dark:hover:bg-green-700 
                            bg-transparent  hover:text-white border-2 hover:bg-green-600 dark:text-white dark:hover:border-green-700 
                            hover:shadow-md flex sm:gap-2"
                            onClick={handleEditClick}
                        >
                            <FaPen />
                            <span>
                                Chỉnh sửa
                            </span>
                        </Button>
                    ) : (
                        <Button
                            className="w-full rounded-lg mt-5 mb-1 py-3 border-green-400 hover:border-green-600 dark:border-green-700 dark:hover:bg-green-700 text-green-500
                            bg-transparent  hover:text-white border-2 hover:bg-green-600
                            hover:shadow-md flex sm:gap-2"
                            onClick={handleSaveClick}
                        >
                            <FaPen className="xs:mr-2" />
                            <span className="xs:block">
                                Lưu
                            </span>
                        </Button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DetailPopup;