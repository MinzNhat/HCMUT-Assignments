import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface NotificationProps {
    onClose: () => void;
    message: string;
}

const Notification: React.FC<NotificationProps> = ({ onClose, message }) => {
    const notificationRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);

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

    const handleAnimationComplete = () => {
        if (!isVisible) {
            onClose();
        }
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-[#000000] bg-opacity-10 dark:bg-white dark:bg-opacity-5 z-50 inset-0 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={handleAnimationComplete}
            style={{
                backdropFilter: "blur(6px)",
            }}
        >
            <motion.div
                ref={notificationRef}
                className="relative max-w-80 h-44 xs:h-40 dark:bg-navy-900 bg-white rounded-xl py-4 px-8 flex flex-col justify-between"
                initial={{ scale: 0 }}
                animate={{ scale: isVisible ? 1 : 0 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div>
                    <h2 className="text-black dark:text-gray-600 text-2xl font-bold mb-2 text-center">Thông báo</h2>
                    <p className="text-black dark:text-gray-600 text-md">{message}</p>
                </div>


                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="py-2 w-2/3 max-w-[100px] self-center text-[#545e7b] border-[#545e7b] hover:border-red-600 dark:hover:bg-red-700 
                    bg-transparent  hover:text-white border-2 hover:bg-red-600 dark:text-white dark:hover:border-red-700 
                    hover:shadow-md rounded"
                    onClick={handleClose}
                >
                    Đóng
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default Notification;