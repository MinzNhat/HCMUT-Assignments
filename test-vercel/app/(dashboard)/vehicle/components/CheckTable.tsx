"use client"
import React, { useMemo, useState } from "react";
import Card from "@/components/card";
import Checkbox from "@/components/checkbox";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import {
  MdCheckCircle,
  MdCancel,
  MdOutlineError,
  MdAddCircleOutline,
  MdNavigateNext,
  MdNavigateBefore,
  MdOutlineRemoveCircleOutline,
} from "react-icons/md";
import Progress from "@/components/progress";
import { Button, useDisclosure } from "@nextui-org/react";
import DetailPopup from "./DetailPopup";
import { IoAddOutline } from "react-icons/io5";
import AddPopup from "./AddPopup";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";

interface VehicleData {
  type: string;
  licenseplate: string;
  enginefuel: string;
  height: string;
  length: string;
  width: string;
  mass: string;
  status: string;
}

type Props = {
  columnsData: any[];
  tableData: VehicleData[];
};

const CheckTable = (props: Props) => {
  const { columnsData, tableData } = props;
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [openModal, setOpenModal] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const handleClodeModal = () => {
    setOpenModal(false);
  };

  const handleClodeAddModal = () => {
    setOpenAdd(false);
  };

  const toggleRowSelection = (rowIndex: number) => {
    const newSelectedRows = new Set(selectedRows);
    if (selectedRows.has(rowIndex)) {
      newSelectedRows.delete(rowIndex);
    } else {
      newSelectedRows.add(rowIndex);
    }
    setSelectedRows(newSelectedRows);
  };

  const selectAllRows = () => {
    if (selectedRows.size === tableData.length) {
      setSelectedRows(new Set<number>());
    } else {
      const newSelectedRows = new Set<number>();
      tableData.forEach((_, index) => newSelectedRows.add(index));
      setSelectedRows(newSelectedRows);
    }
  };

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);
  const [searchValue, setSearchValue] = useState("");

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        selectedRowIds: Array.from(selectedRows).reduce((acc: any, val) => {
          acc[val] = true;
          return acc;
        }, {}),
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    state: { pageIndex },
    setGlobalFilter,
  } = tableInstance;

  const [dataRow, setDataRow] = useState({
    type: "",
    licenseplate: "",
    enginefuel: "",
    height: "",
    length: "",
    width: "",
    mass: "",
    status: ""
  })
  return (
    <Card className={"w-full sm:overflow-auto p-4"}>
      {openAdd && (
        <AddPopup
          onClose={handleClodeAddModal}
        />
      )}
      {openModal && (
        <DetailPopup
          onClose={handleClodeModal}
          dataInitial={dataRow}
        />
      )}
      <div className="flex justify-between items-center flex-col lg:flex-row">
        <div className="flex flex-col lg:flex-row gap-3 h-full mb-2 lg:mb-0 w-full place-items-center">
          <div
            className={`relative flex items-center bg-lightPrimary rounded-full text-navy-700 dark:bg-navy-900 dark:text-white lg:w-[300px] w-full`}
          >
            <motion.button
              className={`text-xl h-10 w-8 px-2 ml-2 flex justify-center rounded-full place-items-center`}
              initial={{ left: 2 }}
            >
              <FiSearch
                className={`h-4 w-4 text-[#1488DB]`}
              />
            </motion.button>
            <input
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setGlobalFilter(e.target.value)
              }}
              type="text"
              placeholder="Tìm kiếm theo biển số..."
              className={`block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-[#1488DB] placeholder:text-[#1488DB]
            outline-none dark:bg-navy-900 dark:text-[#1488DB] pl-1 pr-3`}
            />
          </div>
          <div className="flex gap-2">
            <Button className={`flex items-center text-md hover:cursor-pointer bg-lightPrimary p-2 text-[#1488DB] border 
            border-gray-200 dark:!border-navy-700 hover:bg-gray-100 dark:bg-navy-900 dark:hover:bg-white/20 dark:active:bg-white/10
              linear justify-center rounded-lg font-medium transition duration-200`}
              onClick={() => setOpenAdd(true)}>
              <MdAddCircleOutline className="mr-1" />Thêm
              <p className={`sm:block ${selectedRows.size != 0 ? "hidden" : "block"}`}>&nbsp;phương tiện</p>
            </Button>
            {selectedRows.size != 0 &&
              <Button className={`flex items-center text-md hover:cursor-pointer bg-lightPrimary p-2 text-[#1488DB] border 
            border-gray-200 dark:!border-navy-700 hover:bg-gray-100 dark:bg-navy-900 dark:hover:bg-white/20 dark:active:bg-white/10
              linear justify-center rounded-lg font-medium transition duration-200`}>
                <MdOutlineRemoveCircleOutline className="mr-1" />Xoá đã chọn
              </Button>}
          </div>
        </div>
        <div className="flex gap-2 h-full">
          <Button className={`flex items-center text-md hover:cursor-pointer bg-lightPrimary p-2 text-[#1488DB] border 
            border-gray-200 dark:!border-navy-700 hover:bg-gray-100 dark:bg-navy-900 dark:hover:bg-white/20 dark:active:bg-white/10
              linear justify-center rounded-full font-bold transition duration-200`} onClick={() => previousPage()} disabled={!canPreviousPage}>
            <MdNavigateBefore className="w-6 h-6" />
          </Button>
          <Button className={`flex items-center text-md hover:cursor-pointer bg-lightPrimary p-2 text-[#1488DB] border 
            border-gray-200 dark:!border-navy-700 hover:bg-gray-100 dark:bg-navy-900 dark:hover:bg-white/20 dark:active:bg-white/10
              linear justify-center rounded-full font-bold transition duration-200`} onClick={() => nextPage()} disabled={!canNextPage}>
            <MdNavigateNext className="w-6 h-6" />
          </Button>
        </div>
      </div>
      <div className="mt-4 sm:mt-8 overflow-x-auto">
        <table {...getTableProps()} className="w-full" color="gray-500">
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={`border-b border-gray-200 pb-[10px] dark:!border-navy-700`}
                    key={index}
                  >
                    <div className={`text-xs font-bold tracking-wide text-gray-600 lg:text-xs whitespace-nowrap ${column.render("Header") == "Chi tiết" ? "text-end" : "text-start pr-4 lg:pr-0"}`}>
                      {column.render("Header") == "Checkbox" ? <Checkbox checked={selectedRows.size === tableData.length} onChange={() => selectAllRows()} />
                        : column.render("Header")}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, rowIndex) => {
              prepareRow(row);
              const isSelected = selectedRows.has(rowIndex);
              const rowClassName = isSelected
                ? `dark:bg-navy-900 bg-gray-200 dark:!border-navy-700 border-b`
                : `dark:!border-navy-700 border-b`;
              return (
                <tr
                  {...row.getRowProps()}
                  key={rowIndex}
                  className={rowClassName}
                >
                  {row.cells.map((cell, cellIndex) => {
                    let renderData;
                    if (cell.column.Header === "Checkbox") {
                      renderData = (
                        <Checkbox
                          checked={isSelected}
                          onChange={() => toggleRowSelection(rowIndex)}
                        />
                      );
                    } else if (cell.column.Header === "Loại phương tiện") {
                      renderData = (
                        <p className="mt-1 text-sm font-bold text-navy-700 dark:text-white pr-4 whitespace-nowrap">
                          {cell.value === "Bus"
                            ? "Xe khách"
                            : cell.value === "Container Truck"
                              ? "Xe Container"
                              : "Xe tải"}
                        </p>
                      );
                    } else if (cell.column.Header === "Trạng thái") {
                      renderData = (
                        <div className="flex items-center gap-2">
                          <div className={`rounded-full text-xl`}>
                            {cell.value === "Active" ? (
                              <MdCheckCircle className="text-green-500" />
                            ) : cell.value === "Inactive" ? (
                              <MdCancel className="text-red-500" />
                            ) : cell.value === "Maintenance" ? (
                              <MdOutlineError className="text-orange-500" />
                            ) : null}
                          </div>
                          <p className="mt-0.5 text-sm font-bold text-navy-700 dark:text-white pr-4 whitespace-nowrap">
                            {cell.value === "Active"
                              ? "Đang hoạt động"
                              : cell.value === "Inactive"
                                ? "Không hoạt động"
                                : "Đang bảo trì"}
                          </p>
                        </div>
                      );
                    } else if (cell.column.Header === "PROGRESS") {
                      renderData = (
                        <Progress width="w-[68px]" value={cell.value} />
                      );
                    } else if (cell.column.Header === "Biển số xe") {
                      renderData = (
                        <p className="mt-1 text-sm font-bold text-navy-700 dark:text-white pr-4 whitespace-nowrap">
                          {cell.value}
                        </p>
                      );
                    } else if (cell.column.Header === "Loại động cơ") {
                      renderData = (
                        <p className="mt-1 text-sm font-bold text-navy-700 dark:text-white pr-4 whitespace-nowrap">
                          {cell.value}
                        </p>
                      );
                    } else if (cell.column.Header === "Chi tiết") {
                      renderData = (
                        <div className="w-full flex justify-end">
                          <Button
                            onClick={() => {
                              setDataRow(row.original)
                              setOpenModal(true);
                            }}
                            className={`flex items-center hover:cursor-pointer bg-lightPrimary p-2 h-8 w-8 rounded-full text-[#1488DB] border 
                            border-gray-200 dark:!border-navy-700 hover:bg-gray-100 dark:bg-navy-700 dark:hover:bg-white/20 dark:active:bg-white/10
                              linear justify-center font-bold transition duration-200 mr-2`}
                          >
                            <IoAddOutline className="w-full h-full" />
                          </Button>

                        </div>
                      );
                    }
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={cellIndex}
                        className="pt-[14px] pb-[16px] sm:text-[14px]"
                      >
                        {renderData}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CheckTable;
