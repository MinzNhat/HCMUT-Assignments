"use client"
import React, { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { Button } from "@nextui-org/react";
import { FaPen } from "react-icons/fa6";
import MapExport from "./MapExport";
import { Address } from "@/library/libraryType/type";
// import MapPopup from "./MapPopup";

// interface DriverData {
//     driverName: string;
//     driverNumber: string;
//     driverAddress: Address;
//     driverStatus: number;
//     driverLicense: string[];
// }

interface AddPopupProps {
    onClose: () => void;
    // dataInitial: DriverData;
    // reloadData: () => void;
}

const AddPopup: React.FC<AddPopupProps> = ({ onClose }) => {
    const notificationRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);
    // const [data, setData] = useState<DriverData>(dataInitial);
    const [openModal, setOpenModal] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [openMap, setOpenMap] = useState(false);
    const [message, setMessage] = useState("");
    const source: Address = {
        address: "123 William St",
        latitude: 40.7094756,
        longitude: -74.0072955
    }
    const destination: Address = {
        address: "FDR Park",
        latitude: 39.90213749999999,
        longitude: -75.1838075
    }
    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
            // reloadData();
        }
    };

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
            {/* {openError && <NotiPopup message={message} onClose={() => { setOpenError(false); setIsEditing(false); }} />}
            {openModal && <SubmitPopup message={message} onClose={() => { setOpenModal(false); }} submit={handleChangeData} />}
            {openMap && <MapPopup onClose={() => { setOpenMap(false) }} dataInitial={data.driverAddress} setData={setData} data={data} />} */}
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
                        Thông tin lộ trình
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
                        {/*                         
                            <div className="flex">
                                <div className="w-1/2 font-bold text-base">
                                    Tên tài xế:
                                </div>
                                <div>{data.driverName}</div>
                            </div>
                    
                        
                            <div className="flex">
                                <div className="w-1/2 font-bold text-base">
                                    Số điện thoại:
                                </div>
                                <div>{data.driverNumber}</div>
                            </div>
            
                        
                            <div className="flex">
                                <div className="w-1/2 font-bold text-base">
                                    Địa chỉ cư trú:
                                </div>
                                <div className="w-1/2 line-clamp-3">{data.driverAddress.address}</div>
                            </div>
                            
                        <div className="flex lg:pb-4">
                            <div className="w-1/2 font-bold text-base">
                                Trạng thái:
                            </div>
                            <div>{data.driverStatus == 0 ? "Sẵn sàng" : "Đang nhận đơn"}</div>
                        </div> */}
                    </div>

                    <div className="flex flex-col lg:w-1/2 relative dark:bg-navy-900 bg-white rounded-xl p-4 pt-2 mt-6 lg:mt-0 h-full">
                        <span className="w-full text-center font-bold text-lg pb-2">
                            Vị trí hiện tại
                        </span>
                        <MapExport source={source} destination={destination} progress={45} />
                    </div>
                </div>

                <div className="w-full flex">
                    <Button
                        className="w-full rounded-lg mt-5 mb-1 py-3 text-[#545e7b] border-[#545e7b] hover:border-green-600 dark:hover:bg-green-700 
                            bg-transparent  hover:text-white border-2 hover:bg-green-600 dark:text-white dark:hover:border-green-700 
                            hover:shadow-md"
                    // onClick={handleEditClick}
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
