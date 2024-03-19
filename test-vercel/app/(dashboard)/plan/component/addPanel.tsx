'use client'
import { Button } from '@nextui-org/react';
import React, { useState } from 'react';
import { FaAngleDoubleLeft } from "react-icons/fa";

const AddPanel = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleToggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`relative ${isCollapsed ? 'w-full h-8 sm:w-8' : 'h-full w-full sm:w-2/3 md:w-[550px]'} sticky z-50 transition-all duration-500 ease-in-out`}>
            <div className={`bg-white shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none rounded-xl h-full transition-opacity duration-500 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`} style={{ transitionDelay: isCollapsed ? '0ms' : '200ms' }}>

            </div>
            <Button
                className={`absolute -bottom-2 sm:top-1/2 bg-white dark:text-white text-[#1488DB] border-2 border-[#1488DB] dark:border-white 
                hover:cursor-pointer dark:bg-navy-800 rounded-full w-8 h-8 flex items-center justify-center focus:outline-none transition-all duration-500 
                ${isCollapsed ? 'transform -translate-y-1/2 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-0' :
                        'transform right-1/2 translate-x-1/2 sm:-translate-y-1/2 sm:translate-x-0 sm:-right-4'}`}
                onClick={handleToggleCollapse}
            >
                <FaAngleDoubleLeft className={`transition-transform duration-500 ${isCollapsed ? "-rotate-90 sm:rotate-180" : "rotate-90 sm:rotate-0"}`} />
            </Button>
        </div>
    );
}

export default AddPanel;
