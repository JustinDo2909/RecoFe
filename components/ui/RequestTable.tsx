import { Button } from "@/components/ui/button";
import { useUpdateStatusRequestMutation } from "@/state/api";
import { format } from "date-fns";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

interface TableProps<T> {
  data: T[];
  columns: { key: keyof T; label: string }[];

  onCreate?: () => void;
  onUpdateStatus?: (_id: string, status: string) => void;
  ITEMS_PER_PAGE: number;
  getIsActive?: (row: unknown) => boolean;
}

const RequestTable = <T extends { _id: string }>({
  data,
  columns,
  ITEMS_PER_PAGE,
}: TableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [updateStatusRequest] = useUpdateStatusRequestMutation();
  // const [disableUser] = useDisableUserMutation();
  // const [enableUser] = useEnableUserMutation();

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

  const updateStatus = async (id: string, status: string) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn cập nhật trạng thái thành ${status}?`,
    );
    if (!confirmed) return;

    try {
      const result = await updateStatusRequest({ id, status });

      return result;
    } catch (error: any) {
      toast.error(error.message || "Cập nhật trạng thái thất bại");
    }
  };

  // const openReasonModal = (id: string) => {
  //   setSelectedRowId(id);
  //   setReason("");
  //   setShowReasonModal(true);
  // };

  const handleSaveReason = async () => {
    if (selectedRowId) {
      const confirmed = window.confirm("Bạn có chắc muốn từ chối?");
      if (!confirmed) return;

      try {
        // await disableUser({ id: selectedRowId, message: reason }).unwrap();
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
        <input
          type="text"
          placeholder="Search..."
          className="mb-4 p-2 border rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* {onCreate && (
          <button onClick={onCreate} className="mb-4 text-green-600 p-3">
            <PlusCircleIcon size={35} />
          </button>
        )} */}
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
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => {
                return (
                  <tr key={rowIndex} className="border">
                    {columns.map((col) => {
                      return (
                        <td
                          key={String(col.key)}
                          className="px-4 py-2 border text-customgreys-blueGrey"
                        >
                          {typeof row[col.key] === "object" &&
                          React.isValidElement(row[col.key]) ? (
                            row[col.key]
                          ) : col.key === "picture" ? (
                            <Image
                              src={String(row[col.key])}
                              alt={String(row[col.key])}
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
                      );
                    })}
                    <td className="px-4 py-2 border text-center">
                      {(row as any).status === "Pending" ? (
                        <div className="flex gap-2 justify-center">
                          <Button
                            onClick={() => updateStatus(row._id, "Approved")}
                            className="bg-green-500 text-white"
                          >
                            Chấp nhận
                          </Button>
                          <Button
                            onClick={() => updateStatus(row._id, "Rejected")}
                            className="bg-red-500 text-white"
                          >
                            Từ chối
                          </Button>
                        </div>
                      ) : (
                        <span className="italic text-gray-600">
                          Không cần thao tác
                        </span>
                      )}
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
          {currentPage} / {totalPages}
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

      {showReasonModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="mb-4 text-lg font-semibold">Nhập lý do</h3>
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

export default RequestTable;
