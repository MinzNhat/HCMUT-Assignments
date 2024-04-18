"use client";
import "@/app/globals.css";
import "@/components/calendar/MiniCalendar.css";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import SidebarProvider from "@/providers/SidebarProvider";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import MapExport from "./plan/component/MapExport";
import { CollapseContext } from "./plan/context/CollapseContext";
import { DestinationContext } from "./plan/context/DestinationContext";
import { DistanceContext } from "./plan/context/DistanceContext";
import { SourceContext } from "./plan/context/SourceContext";
import CustomLoadingElement from "./loading";
import CustomLoadingElement2 from "../loading";
import { UsersOperation } from "@/library/account";
const RootStructure = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(0);
  const route = useRouter()
  const user = new UsersOperation()
  useEffect(() => {
    const fetchData = async () => {
      const loggedIn2 = await user.checkUserLoggedIn();
      if (!loggedIn2.data) route.push("/")
    };
    fetchData();
  }, []);
  return (
    <>
      {/* {loggedIn ? */}
      <>{/* @ts-ignore */}
        <DistanceContext.Provider value={{ distance, setDistance }}>
          {/* @ts-ignore */}
          <CollapseContext.Provider value={{ isCollapsed, setIsCollapsed }}>
            {/* @ts-ignore */}
            <SourceContext.Provider value={{ source, setSource }}>
              {/* @ts-ignore */}
              <DestinationContext.Provider value={{ destination, setDestination }} >
                <SidebarProvider>
                  <section className="flex h-full w-full">
                    <Sidebar />

                    {/* Navbar & Main Content */}
                    <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
                      {/* Main Content */}
                      {pathname != "/plan" ? (
                        <main className="mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]">
                          {/* Routes */}
                          <div className="h-full">
                            <Navbar />
                            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
                              <Suspense fallback={<CustomLoadingElement />}>
                                {children}
                              </Suspense>
                            </div>
                          </div>
                        </main>
                      ) : (
                        <main className="relative mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]">
                          {/* Routes */}
                          <div className="h-full">
                            <Navbar />

                            <div className="pt-5s mx-auto mb-auto pt-2 md:pr-2">
                              <Suspense fallback={<CustomLoadingElement />}>
                                {children}
                              </Suspense>
                            </div>
                          </div>
                          <div className="absolute h-screen w-[calc(100%+75px)] top-0 -left-[63px]">
                            <MapExport />
                          </div>
                        </main>
                      )}
                    </div>
                  </section>
                </SidebarProvider>
              </DestinationContext.Provider>
            </SourceContext.Provider>
          </CollapseContext.Provider>
        </DistanceContext.Provider>
      </>
      {/* : <CustomLoadingElement2 />
      } */}
    </>
  );
};

export default RootStructure;
