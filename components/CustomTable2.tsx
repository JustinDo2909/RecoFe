import { format } from "date-fns";
import { PlusCircleIcon, EyeIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

interface TableProps<T> {
  data: T[];
  columns: { 
    key: keyof T; 
    label: string;
    type?: "text" | "image" | "date" | "object" | "status" | "boolean" | "number";
    objectDisplayKey?: string; // For object types, specify which key to display
    format?: (value: any) => React.ReactNode; // Custom formatter function
  }[];
  onDelete?: (_id: string) => void;
  onUpdate?: (_id: string) => void;
  onCreate?: () => void;
  onView?: (_id: string) => void;
  onUpdateStatus?: (_id: string, status: string) => void;
  ITEMS_PER_PAGE: number;
  statusOptions?: { value: string; label: string; color: string }[]; // Custom status options
}

const CustomTable = <T extends { _id: string }>({
  data,
  columns,
  ITEMS_PER_PAGE,
  onDelete,
  onUpdate,
  onCreate,
  onView,
  onUpdateStatus,
  statusOptions = [
    { value: "Approved", label: "Approve", color: "bg-green-500" },
    { value: "Rejected", label: "Reject", color: "bg-red-500" },
  ],
}: TableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [updatedRowId, setUpdatedRowId] = useState<string | null>(null);

  // Filter data based on search term
  const filteredData = data.filter((row) =>
    columns.some((col) => {
      const value = row[col.key];
      if (col.type === "object" && col.objectDisplayKey && value && typeof value === 'object') {
        return String((value as any)[col.objectDisplayKey]).toLowerCase().includes(searchTerm.toLowerCase());
      }
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const getValue = (item: T, key: keyof T) => {
      const colConfig = columns.find(col => col.key === key);
      if (colConfig?.type === "object" && colConfig.objectDisplayKey && item[key] && typeof item[key] === 'object') {
        return String((item[key] as any)[colConfig.objectDisplayKey]).toLowerCase();
      }
      return String(item[key]).toLowerCase();
    };

    const aValue = getValue(a, sortColumn);
    const bValue = getValue(b, sortColumn);
    
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (colKey: keyof T) => {
    if (sortColumn === colKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(colKey);
      setSortOrder("asc");
    }
  };

  const handleUpdateStatus = (id: string, status: string) => {
    if (onUpdateStatus) {
      onUpdateStatus(id, status);
      setUpdatedRowId(id);
    }
  };

  // Format cell content based on column type
  const formatCellContent = (value: any, column: { type?: string; objectDisplayKey?: string; format?: (value: any) => React.ReactNode }) => {
    if (column.format) {
      return column.format(value);
    }

    if (value === null || value === undefined) {
      return "-";
    }

    switch (column.type) {
      case "image":
        return (
          <div className="relative w-16 h-16">
            <Image
              src={String(value)}
              alt=""
              fill
              className="object-cover rounded-md"
            />
          </div>
        );
      case "date":
        return format(new Date(value), "dd/MM/yyyy HH:mm");
      case "object":
        if (column.objectDisplayKey && typeof value === 'object' && value !== null) {
          return (value as any)[column.objectDisplayKey] ?? "-";
        }
        return "-";
      case "boolean":
        return value ? "Yes" : "No";
      case "status":
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${
            value === "Approved" ? "bg-green-100 text-green-800" :
            value === "Rejected" ? "bg-red-100 text-red-800" :
            "bg-yellow-100 text-yellow-800"
          }`}>
            {String(value)}
          </span>
        );
      case "number":
        return new Intl.NumberFormat().format(value);
      default:
        return String(value);
    }
  };
  

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-sm min-w-[80vw]">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {onCreate && (
          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircleIcon size={20} />
            <span className="hidden sm:inline">Create New</span>
          </button>
        )}
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
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortColumn === col.key && (
                      <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <tr key={row._id} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                    >
                      {formatCellContent(row[col.key], col)}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {onView && (
                        <button
                          onClick={() => onView(row._id)}
                          className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                          title="View"
                        >
                          <EyeIcon size={18} />
                        </button>
                      )}
                      {onUpdate && (
                        <button
                          onClick={() => onUpdate(row._id)}

                          className="p-2 text-yellow-600 hover:text-yellow-800 rounded-full hover:bg-yellow-50"
                          title="Edit"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row._id)}
                          className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                          title="Delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      )}
                      {onUpdateStatus && (
                        updatedRowId === row._id ? (
                          <span className="text-green-600 text-sm">Updated</span>
                        ) : (
                          <div className="flex gap-1">
                            {statusOptions.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => handleUpdateStatus(row._id, option.value)}
                                className={`px-2 py-1 text-xs text-white rounded ${option.color} hover:opacity-80`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-sm text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(currentPage * ITEMS_PER_PAGE, sortedData.length)}
            </span>{" "}
            of <span className="font-medium">{sortedData.length}</span> results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTable;