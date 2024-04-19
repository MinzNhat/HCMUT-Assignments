"use client"
import { useContext, useState } from 'react';
import { useThemeContext } from "@/providers/ThemeProvider";
import { DistanceContext } from '../context/DistanceContext';
import cars from '../variables/CarList.json'
import { IoMdPerson } from "react-icons/io";
import Image from 'next/image';
// @ts-ignore
const CarsList = ({ selectedType, setSelectedType }) => {
    const { theme, setTheme } = useThemeContext()
    // @ts-ignore
    const { distance, setDistance } = useContext(DistanceContext);

    const handleSelectType = (type: any) => {
        setSelectedType(type === selectedType ? null : type);
    };

    return (
        <div className="flex flex-col w-full gap-2 px-2 pb-2 mb-14">
            <div className="flex flex-col w-full gap-2 p-4 bg-white dark:bg-navy-900 rounded-xl shadow">
                <h1 className="text-xl w-full text-center font-bold text-gray-700 dark:text-gray-300 text-nowrap cursor-default pb-1">
                    Chọn loại xe
                </h1>
                <div className="flex flex-wrap justify-center gap-4">
                    {cars.map(car => (
                        <div key={car.type} className={`cursor-pointer flex gap-1 sm:gap-2 w-full border rounded-lg p-4 ${selectedType === car.type ? 'border-blue-500 dark:border-blue-500' : 'border-gray-200 dark:border-gray-300'}`} onClick={() => handleSelectType(car.type)}>
                            <div className='grow flex flex-col justify-between p-1'>
                                <div>
                                    <div className='flex flex-col md:flex-row md:gap-2 md:place-items-center mb-2 md:mb-0'>
                                        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{car.name}</h2>
                                        <div className='flex place-items-center gap-0.5 text-sm text-gray-500 dark:text-gray-400'>
                                            <IoMdPerson />
                                            <p className='pt-0.5 font-medium'>{car.person} (~{car.mass}kg)</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{car.description}</p>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 flex gap-1"><p className='font-semibold whitespace-nowrap hidden sm:block'>Chi phí: </p> <p className='font-semibold sm:font-normal'>{distance ? `${(car.amount * distance * 10000).toLocaleString('vi-VN')}đ` : '__.___ đ'}</p></div>
                            </div>
                            <div className='w-36 flex place-items-center py-2'>
                                <Image src={car.img} alt={car.name} layout="responsive" width={100} height={100} />
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CarsList;
