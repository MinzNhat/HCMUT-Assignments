"use client"
import './globals.css'
import "@/components/calendar/MiniCalendar.css";
import ThemeProvider from '@/providers/ThemeProvider';
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import SidebarProvider from "@/providers/SidebarProvider";
import { usePathname } from 'next/navigation';
import MapExport from './(dashboard)/plan/component/MapExport';
import { LoadScript } from "@react-google-maps/api";
import Image from 'next/image';
import { useState } from 'react';
import { CollapseContext } from './(dashboard)/plan/context/CollapseContext';
import { DestinationContext } from './(dashboard)/plan/context/DestinationContext';
import { SourceContext } from './(dashboard)/plan/context/SourceContext';
import { DistanceContext } from './(dashboard)/plan/context/DistanceContext';
const CustomLoadingElement = () => {
    return (
        <div className='w-full h-screen flex flex-col gap-4 justify-center place-items-center'>
            <Image src="/logo.ico" alt="Your image" width={50} height={50} />
            <span className='text-xl'>Đang tải dữ liệu...</span>
        </div>
    );
};
const RootStructure = ({
    childrenProps,
}: {
    childrenProps: React.ReactNode;
}) => {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [source, setSource] = useState(null);
    const [destination, setDestination] = useState(null);
    const [distance, setDistance] = useState(0);
    return (
        <>
            <html lang="en">
                <body>
                    {/* @ts-ignore */}
                    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? ""} libraries={['places']} loadingElement={<CustomLoadingElement />}>
                        {/* @ts-ignore */}
                        <DistanceContext.Provider value={{ distance, setDistance }}>
                            {/* @ts-ignore */}
                            <CollapseContext.Provider value={{ isCollapsed, setIsCollapsed }}>
                                {/* @ts-ignore */}
                                <SourceContext.Provider value={{ source, setSource }}>
                                    {/* @ts-ignore */}
                                    <DestinationContext.Provider value={{ destination, setDestination }}>
                                        {pathname != "/auth" ?
                                            <ThemeProvider>
                                                <SidebarProvider>
                                                    <section className="flex h-full w-full">
                                                        <Sidebar />

                                                        {/* Navbar & Main Content */}
                                                        <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">

                                                            {/* Main Content */}
                                                            {pathname != "/plan" ?
                                                                <main className='mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]' >
                                                                    {/* Routes */}
                                                                    <div className="h-full">
                                                                        <Navbar />

                                                                        <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
                                                                            {childrenProps}
                                                                        </div>
                                                                    </div>
                                                                </main> : <main className='relative mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]' >
                                                                    {/* Routes */}
                                                                    <div className="h-full">
                                                                        <Navbar />

                                                                        <div className="pt-5s mx-auto mb-auto pt-2 md:pr-2">
                                                                            {childrenProps}
                                                                        </div>
                                                                    </div>
                                                                    <div className="absolute h-screen w-[calc(100%+75px)] top-0 -left-[63px]">
                                                                        <MapExport />
                                                                    </div>
                                                                </main>
                                                            }
                                                        </div>

                                                    </section>
                                                </SidebarProvider>
                                            </ThemeProvider>
                                            :
                                            <ThemeProvider>
                                                {childrenProps}
                                            </ThemeProvider>}
                                    </DestinationContext.Provider>
                                </SourceContext.Provider>
                            </CollapseContext.Provider>
                        </DistanceContext.Provider>
                    </LoadScript>
                </body>
            </html>
        </>
    );
}

export default RootStructure;