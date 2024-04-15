"use client"
import React, { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { Button } from "@nextui-org/react";
import Dropzone from "./Dropzone";
import axios from "axios";
import InputWithError from "./Input";
import { FaPen } from "react-icons/fa6";
import { CarouselSlider } from "@/components/slider";

interface DriverData {
    driver_name: string;
    phone_num: string;
    address: string;
    status: number;
    license: string[];
}

interface AddPopupProps {
    onClose: () => void;
    dataInitial: DriverData;
}

const AddPopup: React.FC<AddPopupProps> = ({ onClose, dataInitial }) => {
    const notificationRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [files, setFiles] = useState<File[]>([]);
    const [data, setData] = useState<DriverData>(dataInitial);

    const [errors, setErrors] = useState({
        driver_name: "",
        phone_num: "",
        address: "",
        status: "",
        license: "",
    });

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const validatePhoneNumber = (phone: string) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    };

    const handleSaveClick = () => {
        const tempErrors = { ...errors };
        let hasError = false;

        if (data.driver_name.trim() === "") {
            tempErrors.driver_name = "Tên tài xế không được bỏ trống.";
            hasError = true;
        } else {
            tempErrors.driver_name = "";
        }

        if (data.phone_num.trim() === "" || !validatePhoneNumber(data.phone_num)) {
            tempErrors.phone_num = "Số điện thoại không hợp lệ.";
            hasError = true;
        } else {
            tempErrors.phone_num = "";
        }

        if (data.address.trim() === "") {
            tempErrors.address = "Địa chỉ không được bỏ trống.";
            hasError = true;
        } else {
            tempErrors.address = "";
        }

        if (data.license.length === 0) {
            tempErrors.license = "Giấy phép lái xe không được bỏ trống.";
            hasError = true;
        } else {
            tempErrors.license = "";
        }
        if (hasError) {
            setErrors(tempErrors);
        } else {
            setErrors({
                driver_name: "",
                phone_num: "",
                address: "",
                status: "",
                license: "",
            });
            setIsEditing(false)
        }
    };

    useEffect(() => {
        if (data.phone_num.match(/^\d{10}$/)) {
            setErrors(prevErrors => ({ ...prevErrors, phone_num: "" }));
        }
        if (data.driver_name !== "") {
            setErrors(prevErrors => ({ ...prevErrors, driver_name: "" }));
        }
        if (data.address !== "") {
            setErrors(prevErrors => ({ ...prevErrors, address: "" }));
        }
        if (data.license.length !== 0) {
            setErrors(prevErrors => ({ ...prevErrors, license: "" }));
        }
    }, [data]);

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
                        Thông tin tài xế
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
                        {!isEditing ?
                            <div className="flex">
                                <div className="w-1/2 font-bold text-base">
                                    Tên tài xế:
                                </div>
                                <div>{data.driver_name}</div>
                            </div>
                            :
                            <InputWithError
                                label="Tên tài xế"
                                value={data.driver_name}
                                onChange={(e) => setData({ ...data, driver_name: e.target.value })}
                                error={errors.driver_name}
                            />
                        }
                        {!isEditing ?
                            <div className="flex">
                                <div className="w-1/2 font-bold text-base">
                                    Số điện thoại:
                                </div>
                                <div>{data.phone_num}</div>
                            </div>
                            :
                            <InputWithError
                                label="Số điện thoại"
                                value={data.phone_num}
                                onChange={(e) => setData({ ...data, phone_num: e.target.value })}
                                error={errors.phone_num}
                            />
                        }
                        {!isEditing ?
                            <div className="flex">
                                <div className="w-1/2 font-bold text-base">
                                    Địa chỉ cụ thể:
                                </div>
                                <div>{data.address}</div>
                            </div>
                            :
                            <InputWithError
                                label="Địa chỉ cụ thể"
                                value={data.address}
                                onChange={(e) => setData({ ...data, address: e.target.value })}
                                error={errors.address}
                            />
                        }
                        <div className="flex lg:pb-4">
                            <div className="w-1/2 font-bold text-base">
                                Trạng thái:
                            </div>
                            <div>{data.status == 0 ? "Sẵn sàng" : "Đang nhận đơn"}</div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:w-1/2 relative dark:bg-navy-900 bg-white rounded-xl p-4 pt-2 mt-6 lg:mt-0 h-full">
                        <span className="w-full text-center font-bold text-lg pb-2">
                            Ảnh giấy phép lái xe
                        </span>
                        {isEditing ?
                            <>
                                {errors.license && <div className="text-red-500 absolute w-full text-center mt-12 -ml-4">{errors.license}</div>}
                                <Dropzone files={files} setFiles={setFiles} className={`${files.length == 0 ? "h-full" : "h-28 px-3"}  flex justify-center place-items-center mt-1`} />
                            </>
                            :
                            <div className="relative grow">
                                <CarouselSlider urls={data.license} />
                            </div>
                        }

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

export default AddPopup;
