'use client'
import { Button } from '@nextui-org/react';
import React, { useContext, useState, useEffect } from 'react';
import { FaAngleDoubleLeft } from "react-icons/fa";
import { CollapseContext } from '../context/CollapseContext';
import SearchBox from './SearchBox';
import CarList from './CarList';

const AddPanel = () => {
    //@ts-ignore
    const { isCollapsed, setIsCollapsed } = useContext(CollapseContext);
    const [selectedType, setSelectedType] = useState(null);

    const handleToggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    useEffect(() => {
        setIsCollapsed(false);
        return () => {
            setIsCollapsed(true);
        };
    }, []);

    return (
        <div className={`relative ${isCollapsed ? 'w-full h-8 sm:w-8 sm:h-full' : ' w-full h-[calc(100vh-208px)] md:h-[calc(100vh-126px)] sm:w-2/3 md:w-[550px]'} sticky z-40 transition-all duration-500 ease-in-out`}>
            <div className={`border-8 border-white dark:border-navy-900 shadow-xl shadow-shadow-500 dark:shadow-none rounded-xl sm:rounded-tr-none sm:rounded-l-xl h-[calc(100vh-208px)] md:h-[calc(100vh-126px)] transition-opacity duration-500 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`} style={{ transitionDelay: isCollapsed ? '0ms' : '200ms' }}>
                <div className={`bg-white/10 backdrop-blur-sm dark:bg-[#0b14374d] h-full transition-opacity rounded-[4px] sm:rounded-tr-none sm:rounded-l-[4px] duration-200 border-b-2 dark:border-b border-white/10 dark:border-white/30 flex flex-col overflow-y-scroll no-scrollbar ${isCollapsed ? 'opacity-0' : 'opacity-100'}`} style={{ transitionDelay: isCollapsed ? '0ms' : '400ms' }}>
                    <SearchBox />
                    <CarList selectedType={selectedType} setSelectedType={setSelectedType} />
                </div>
            </div>
            <Button
                className={`absolute bottom-2 h-12 text-white bg-blue-500 w-[calc(100%-16px)] mx-2 dark:bg-[#032B91]
                hover:cursor-pointer rounded-md flex outline-8 outline-white dark:outline-navy-900 transition-transform duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}
                // onClick={handleToggleCollapse}
                style={{ transitionDelay: isCollapsed ? '0ms' : '300ms', outlineOffset: '-1px' }}
            >
                Xác nhận tạo lộ trình
            </Button>
            <Button
                className={`absolute -bottom-3 sm:top-[21px] dark:text-white text-gray-400
                hover:cursor-pointer rounded-full flex focus:outline-none transition-all duration-500
                ${isCollapsed ? 'transform -translate-y-1/2 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-0 shadow h-8 w-8 bg-white dark:bg-navy-800' :
                        'transform right-1/2 translate-x-1/2 sm:-translate-y-[calc(50%+0.5px)] sm:translate-x-0 bottom-12 sm:border-none h-8 w-8 sm:-right-5 sm:w-14 sm:h-10 sm:justify-end'}`}
                onClick={handleToggleCollapse}
            >
                <div className='absolute w-full top-0 h-1/3 bg-white dark:bg-navy-900 sm:hidden'></div>

                <FaAngleDoubleLeft className={`transition-transform duration-500 bg-white dark:text-gray-300 dark:bg-navy-900 h-10  ${isCollapsed ? "-rotate-90 sm:rotate-180" : "rotate-90 sm:rotate-0 mb-2 sm:mb-0 sm:pr-2 sm:pl-1 sm:w-[45%]"}`} />
            </Button>
        </div >
    );
}

export default AddPanel;