import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { PlusCircleIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

type Column<T> = {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
};

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];

  onUpdateStatus?: (_id: string, status: string) => void;
  ITEMS_PER_PAGE: number;
  getIsActive?: (row: T) => boolean;
  onDisable: (_id: string, reason: string) => void;
  onEnable: (_id: string) => void;
  onCreate?: () => void;
  onUpdate?: (row: T) => void;
}

const UitlTable = <T extends { _id: string }>({
  data,
  columns,
  ITEMS_PER_PAGE,
  getIsActive,
  onDisable,
  onEnable,
  onCreate,
  onUpdate,
}: TableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const filteredData = data.filter((row) =>
    columns.some((col) => String(row[col.key]).toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  const handleClickEnable = async (id: string) => {
    const confirmed = window.confirm("Bạn có chắc muốn kích hoạt ?");
    if (!confirmed) return;

    try {
      console.log("onEnable", id);

      onEnable(id); // <--- Sai: onEnable nhận 1 param kiểu string (id), bạn đang truyền object {id}
    } catch (err) {
      toast.error("Kích hoạt thất bại!");
    }
  };

  const handleClickCreate = () => {
    onCreate();
  };

  const openReasonModal = (id: string) => {
    setSelectedRowId(id);
    setReason("");
    setShowReasonModal(true);
  };

  const handleSaveReason = async () => {
    if (selectedRowId) {
      const confirmed = window.confirm("Bạn có chắc muốn đình chỉ?");
      if (!confirmed) return;

      try {
        onDisable(selectedRowId, reason);

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
        <input
          type="text"
          placeholder="Tìm..."
          className="mb-4 p-2 border rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {onCreate && (
          <button onClick={handleClickCreate} className="mb-4 text-green-600 p-3">
            <PlusCircleIcon size={35} />
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-customgreys-secondarybg text-white-100 text-center">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-4 py-2 text-left border cursor-pointer"
                  onClick={() => handleSort(col.key)}
                >
                  {col.label} {sortColumn === col.key ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
              ))}
              <th className="px-4 py-2 text-left border">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => {
                const isActive = getIsActive ? getIsActive(row) : false;
                console.log("Row ID:", row._id, "isActive:", isActive);
                return (
                  <tr key={row._id} className="border">
                    {columns.map((col) => (
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
                            (row[col.key] as any).name
                          ) : (
                            ((row[col.key] as any)._id ?? "-")
                          )
                        ) : (
                          String(row[col.key])
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-2 border text-center flex justify-center gap-3">
                      {isActive ? (
                        <button
                          onClick={() => openReasonModal(row._id)}
                          className="bg-red-600 hover:bg-red-700 transition text-white font-semibold py-1.5 px-4 rounded-md shadow"
                          title="Đình chỉ"
                        >
                          Đình chỉ
                        </button>
                      ) : (
                        <button
                          onClick={() => handleClickEnable(row._id)}
                          className="bg-green-600 hover:bg-green-700 transition text-white font-semibold py-1.5 px-4 rounded-md shadow"
                          title="Kích hoạt"
                        >
                          Kích hoạt
                        </button>
                      )}

                      <button
                        onClick={() => onUpdate?.(row)}
                        className="bg-yellow-500 hover:bg-yellow-600 transition text-white font-semibold py-1.5 px-4 rounded-md shadow"
                        title="Chỉnh sửa"
                      >
                        Chỉnh sửa
                      </button>
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
          Trước
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 text-black rounded disabled:opacity-50"
        >
          Kế
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

export default UitlTable;
