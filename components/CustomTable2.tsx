import { Button } from "@/components/ui/button";
import { useDisableUserMutation, useEnableUserMutation } from "@/state/api";
import { format } from "date-fns";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

interface TableProps<T> {
  data: T[];
  columns: { key: keyof T; label: string }[];

  onCreate?: () => void;
  onView?: (_id: string) => void;
  onUpdateStatus?: (_id: string, status: string) => void;
  ITEMS_PER_PAGE: number;
  getIsActive?: (row: unknown) => boolean;
}

const CustomTable = <T extends { _id: string }>({
  data,
  columns,
  ITEMS_PER_PAGE,

  getIsActive,
}: TableProps<T>) => {
  const [searchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [ setUpdatedRowId] = useState<any | null>(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const [disableUser] = useDisableUserMutation();
  const [enableUser] = useEnableUserMutation();

  // Filter data based on search term
  const filteredData = data.filter((row) =>
    columns.some((col) => String(row[col.key]).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = String(a[sortColumn]).toLowerCase();
    const bValue = String(b[sortColumn]).toLowerCase();
    return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  });

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const paginatedData = sortedData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSort = (colKey: keyof T) => {
    if (sortColumn === colKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(colKey);
      setSortOrder("asc");
    }
  };

  const hanleClickUpdateStatus = async (id: string) => {
    const confirmed = window.confirm("Bạn có chắc muốn kích hoạt người dùng này?");
    if (!confirmed) return;

    try {
      await enableUser({ id }).unwrap();
      toast.success("Đã kích hoạt người dùng!");
      setUpdatedRowId(id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Kích hoạt thất bại!");
    }
  };

  const openReasonModal = (id: string) => {
    setSelectedRowId(id);
    setReason("");
    setShowReasonModal(true);
  };

  const handleSaveReason = async () => {
    if (selectedRowId) {
      const confirmed = window.confirm("Bạn có chắc muốn đình chỉ người dùng này?");
      if (!confirmed) return;

      try {
        await disableUser({ id: selectedRowId, message: reason }).unwrap();
        toast.success("Đã đình chỉ người dùng!");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Đình chỉ thất bại!");
      }
    }

    setShowReasonModal(false);
    setReason("");
    setSelectedRowId(null);
  };

  const handleCancel = () => {
    setShowReasonModal(false);
    setReason("");
    setSelectedRowId(null);
  };

  return (
    <div className="p-4 bg-customgreys-secondarybg">
      <div className="flex items-center gap-5 justify-center">
        {/* <input
          type="text"
          placeholder="Search..."
          className="mb-4 p-2 border rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        /> */}
        {/* {onCreate && (
          <button onClick={onCreate} className="mb-4 text-green-600 p-3">
            <PlusCircleIcon size={35} />
          </button>
        )} */}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => handleSort(col.key)}
                >
                  {col.label} {sortColumn === col.key ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
              ))}
              <th className="px-4 py-2 text-left border">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => {
                const isActive = getIsActive ? getIsActive(row) : false;

                return (
                  <tr key={rowIndex} className="border">
                    {columns.map((col) => {
                      return (
                        <td key={String(col.key)} className="px-4 py-2 border text-customgreys-blueGrey">
                          {typeof row[col.key] === "object" && React.isValidElement(row[col.key]) ? (
                            row[col.key]
                          ) : col.key === "picture" ? (
                            <Image
                              src={String(row[col.key])}
                              alt={String(row[col.key])}
                              width={50}
                              height={50}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : col.key === "createdAt" || col.key === "updatedAt" ? (
                            format(new Date(String(row[col.key])), "dd/MM/yyyy")
                          ) : typeof row[col.key] === "object" && row[col.key] !== null ? (
                            "name" in (row[col.key] as object) ? (
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              (row[col.key] as any).name
                            ) : (
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              ((row[col.key] as any)._id ?? "-")
                            )
                          ) : (
                            String(row[col.key])
                          )}
                        </td>
                      );
                    })}
                    <td className="px-4 py-2 border text-center">
                      {isActive ? (
                        <Button onClick={() => openReasonModal(row._id)} className="bg-red-500 text-white">
                          Đình chỉ
                        </Button>
                      ) : (
                        <Button onClick={() => hanleClickUpdateStatus(row._id)} className="bg-green-500 text-white">
                          Kích hoạt
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-2 text-center">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 text-black rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 text-black rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {showReasonModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="mb-4 text-lg font-semibold">Nhập lý do đình chỉ</h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border rounded h-24"
              placeholder="Nhập lý do..."
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button onClick={handleCancel} variant="outline">
                Hủy
              </Button>
              <Button onClick={handleSaveReason} disabled={!reason.trim()}>
                Lưu
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTable;
