"use client"
import './globals.css'
// import "react-calendar/dist/Calendar.css";
import "@/components/calendar/MiniCalendar.css";
import ThemeProvider from '@/providers/ThemeProvider';
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import SidebarProvider from "@/providers/SidebarProvider";
import { usePathname } from 'next/navigation';
import MapExport from './(dashboard)/plan/component/MapExport';

export default function RootLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname()

  return (
    <>
      {pathname != "/auth" ?
        <html lang="en">
          <body>
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
                            {children}
                          </div>
                        </div>
                      </main> : <main className='relative mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]' >
                        {/* Routes */}
                        <div className="h-full">
                          <Navbar />

                          <div className="pt-5s mx-auto mb-auto p-2 sm:p-0 sm:pt-2 md:pr-2">
                            {children}
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
          </body>
        </html> :
        <html lang="en">
          <body>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </body>
        </html>}
    </>
  );
}