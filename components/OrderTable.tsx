import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

interface TableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    label: string;
    render?: (value?: unknown, row?: T) => React.ReactNode;
  }[];
  ITEMS_PER_PAGE: number;
  getIsActive?: (row: T) => boolean;
  onUpdateStatus?: (_id: string, status: string, reason?: string) => void;
}

const OrderTable = <T extends { _id?: string; statusOrder?: string }>({
  data,
  columns,
  ITEMS_PER_PAGE,
  onUpdateStatus,
}: TableProps<T>) => {
  const [searchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRejectId, setSelectedRejectId] = useState<string | null>(null);

  const filteredData = data.filter((row) =>
    columns.some((col) =>
      String(row[col.key]).toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = String(a[sortColumn]).toLowerCase();
    const bValue = String(b[sortColumn]).toLowerCase();
    return sortOrder === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSort = (colKey: keyof T) => {
    if (sortColumn === colKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(colKey);
      setSortOrder("asc");
    }
  };

  const handleRejectClick = (id: string) => {
    setSelectedRejectId(id);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const handleSaveRejectReason = () => {
    if (selectedRejectId && onUpdateStatus) {
      onUpdateStatus(selectedRejectId, "Cancel", rejectReason);
      toast.success("Đơn hàng đã bị từ chối!");
    }
    setShowRejectModal(false);
    setRejectReason("");
    setSelectedRejectId(null);
  };

  const handleCancelReject = () => {
    setShowRejectModal(false);
    setRejectReason("");
    setSelectedRejectId(null);
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
                  {col.label}{" "}
                  {sortColumn === col.key
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
              ))}
              <th className="px-4 py-2 text-left border">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => {
                return (
                  <tr key={rowIndex} className="border">
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        className="px-4 py-2 border text-customgreys-blueGrey"
                      >
                        {col.render ? (
                          col.render(row[col.key], row)
                        ) : col.key === "picture" ? (
                          <Image
                            src={String(row[col.key])}
                            alt="Picture"
                            width={50}
                            height={50}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : col.key === "createdAt" ||
                          col.key === "updatedAt" ? (
                          format(new Date(String(row[col.key])), "dd/MM/yyyy")
                        ) : typeof row[col.key] === "object" &&
                          row[col.key] !== null ? (
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
                    <td className="px-4 py-2 border text-center space-x-2">
                      {row.statusOrder === "Processing" && (
                        <>
                          <Button
                            className="bg-blue-500 text-white"
                            onClick={() =>
                              onUpdateStatus?.((row as any)._id, "Shipping")
                            }
                          >
                            Giao hàng
                          </Button>
                          <Button
                            className="bg-red-500 text-white"
                            onClick={() => handleRejectClick((row as any)._id)}
                          >
                            Từ chối
                          </Button>
                        </>
                      )}
                      {row.statusOrder === "Shipping" && (
                        <Button
                          className="bg-green-500 text-white"
                          onClick={() =>
                            onUpdateStatus?.((row as any)._id, "Done")
                          }
                        >
                          Hoàn thành
                        </Button>
                      )}
                      {/* Nếu là Done thì không hiển thị nút */}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-2 text-center"
                >
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
          Trang {currentPage} của {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 text-black rounded disabled:opacity-50"
        >
          Sau
        </button>
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="mb-4 text-lg font-semibold">
              Lý do từ chối đơn hàng
            </h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-2 border rounded h-24"
              placeholder="Nhập lý do..."
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button onClick={handleCancelReject} variant="outline">
                Hủy
              </Button>
              <Button
                onClick={handleSaveRejectReason}
                disabled={!rejectReason.trim()}
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
