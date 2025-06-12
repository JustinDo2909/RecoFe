"use client";

import CustomTable from "@/components/CustomTable2";
import Loading from "@/components/Loading";
import { useGetUsersQuery } from "@/state/api";
import type { User } from "@/types";
import { Users, UserCheck, UserX, Search } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

type FilterStatus = "all" | "active" | "inactive";

const DashboardUser = () => {
  const { data: users, isLoading } = useGetUsersQuery({});
  const [userList, setUserList] = useState<User[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (users) {
      // Reverse the list to show newest first
      const reversedUsers = [...(users as User[])].reverse();
      setUserList(reversedUsers);
    }
  }, [users]);

  // Filter users based on status and search term
  const filteredUsers = useMemo(() => {
    return userList.filter((user) => {
      // Filter by status
      const statusMatch =
        filterStatus === "all" ||
        (filterStatus === "active" && user.isActive === true) ||
        (filterStatus === "inactive" && user.isActive === false);

      // Filter by search term
      const searchMatch =
        searchTerm === "" ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase());

      return statusMatch && searchMatch;
    });
  }, [userList, filterStatus, searchTerm]);

  // Calculate statistics
  const totalUsers = userList.length;
  const activeUsers = userList.filter((u) => u.isActive === true).length;
  const inactiveUsers = userList.filter((u) => u.isActive === false).length;
  const filteredCount = filteredUsers.length;

  if (!isMounted) return null;

  return (
    <div className="w-full min-h-screen">
      {isLoading && <Loading />}

      {/* Statistics and Filter Section */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border p-6 w-full">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{totalUsers}</div>
                <div className="text-sm text-blue-600">Tổng người dùng</div>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
                <div className="text-sm text-green-600">Đang hoạt động</div>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{inactiveUsers}</div>
                <div className="text-sm text-red-600">Không hoạt động</div>
              </div>
              <UserX className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{filteredCount}</div>
                <div className="text-sm text-purple-600">Đang hiển thị</div>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Lọc theo trạng thái:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Tất cả ({totalUsers})
                </button>
                <button
                  onClick={() => setFilterStatus("active")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === "active"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Hoạt động ({activeUsers})
                </button>
                <button
                  onClick={() => setFilterStatus("inactive")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === "inactive"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Không hoạt động ({inactiveUsers})
                </button>
              </div>
            </div>
          </div>

          {/* Current filter info */}
          <div className="text-sm text-gray-600 whitespace-nowrap">
            {filterStatus === "all" && searchTerm === "" && `Hiển thị tất cả ${totalUsers} người dùng`}
            {filterStatus === "active" && searchTerm === "" && `Hiển thị ${activeUsers} người dùng đang hoạt động`}
            {filterStatus === "inactive" && searchTerm === "" && `Hiển thị ${inactiveUsers} người dùng không hoạt động`}
            {searchTerm !== "" && `Tìm thấy ${filteredCount} kết quả`}
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="w-full overflow-x-auto">
        <CustomTable
          ITEMS_PER_PAGE={10}
          columns={[
            { key: "username", label: "Tên người dùng" },
            { key: "email", label: "Email" },
            { key: "role", label: "Vai trò" },
            { key: "phone", label: "Điện thoại" },
            { key: "address", label: "Địa chỉ" },
            { key: "createdAt", label: "Ngày tạo" },
            { key: "updatedAt", label: "Ngày cập nhật" },
            { key: "isActive", label: "Trạng thái" },
            { key: "deactivatedReason", label: "Lý do" },
          ]}
          getIsActive={(row) => row.isActiveValue}
          data={filteredUsers.map((user) => ({
            ...user,
            isActiveValue: user.isActive,
            isActive: (
              <span className={`font-semibold ${user.isActive ? "text-green-600" : "text-red-600"}`}>
                {user.isActive ? "Hoạt động" : "Không hoạt động"}
              </span>
            ),
            role: (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === "admin"
                    ? "bg-purple-100 text-purple-800"
                    : user.role === "staff"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {user.role === "admin" ? "Quản trị viên" : user.role === "staff" ? "Nhân viên" : "Khách hàng"}
              </span>
            ),
            deactivatedReason: user.deactivatedReason ? user.deactivatedReason : "Không có lý do",
            phone: user.phone ? user.phone : "Không có số điện thoại",
            address: user.address ? user.address : "Không có địa chỉ",
          }))}
          onCreate={() => {}}
        />
      </div>

      {/* No Results Message */}
      {filteredUsers.length === 0 && !isLoading && (
        <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200 mt-4">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Không tìm thấy người dùng</h3>
          <p className="text-gray-500">Không có người dùng nào phù hợp với bộ lọc hiện tại.</p>
          <button
            onClick={() => {
              setFilterStatus("all");
              setSearchTerm("");
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardUser;
