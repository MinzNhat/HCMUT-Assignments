"use client"
import { useThemeContext } from "@/providers/ThemeProvider";
const SearchBox = () => {
    const { theme, setTheme } = useThemeContext()

    return (
        <div className="flex flex-col w-full gap-2 px-2 pb-2">
            <div className="flex flex-col w-full gap-2 p-4 bg-white dark:bg-navy-900 rounded-xl shadow h-[1000px]">
                <h1 className="text-xl w-full text-center font-bold text-gray-400 dark:text-gray-300 text-nowrap cursor-default">
                    Chọn loại xe
                </h1>

            </div>

        </div>
    );
}

export default SearchBox;