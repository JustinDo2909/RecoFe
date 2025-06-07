"use client";
import CustomTable from "@/components/CustomTable2";
import Loading from "@/components/Loading";
import { useGetUsersQuery } from "@/state/api";
import { User } from "@/types";
import React, { useEffect, useState } from "react";

const DashboardUser = () => {
  const { data: users, isLoading } = useGetUsersQuery({});
  const [userList, setUserList] = useState<User[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (users) {
      const filteredUsers = (users as User[]).filter((user) => {
        if (filterStatus === "active") return user.isActive === true;
        if (filterStatus === "inactive") return user.isActive === false;
        return true;
      });
      setUserList(filteredUsers);
    }
  }, [users, filterStatus]);

  if (!isMounted) return null;

  return (
    <div className="p-4 space-y-4">
      {isLoading && <Loading />}

      {/* Bộ lọc và tổng số lượng */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="statusFilter" className="font-medium">
            Lọc trạng thái:
          </label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "all" | "active" | "inactive")}
            className="border rounded p-1"
          >
            <option value="all">Tất cả</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>
        <div className="text-sm md:text-base font-medium">
          Tổng số người dùng: <span className="font-bold">{userList.length}</span>
        </div>
      </div>
      <CustomTable
        ITEMS_PER_PAGE={10}
        columns={[
          { key: "_id", label: "ID" },
          { key: "username", label: "Username" },
          { key: "email", label: "Email" },
          { key: "role", label: "Vai trò" },
          { key: "phone", label: "Điện thọai" },
          { key: "address", label: "Địa chỉ" },

          { key: "createdAt", label: "Ngày tạo" },
          { key: "updatedAt", label: "Ngày cập nhập" },
          { key: "isActive", label: "Trạng thái" },
          { key: "deactivatedReason", label: "Lý do" },
        ]}
        getIsActive={(row) => row.isActiveValue}
        data={userList.map((user) => ({
          ...user,
          isActiveValue: user.isActive, // ✅ giữ lại giá trị boolean
          isActive: (
            <span className={`font-semibold ${user.isActive ? "text-green-600" : "text-red-600"}`}>
              {user.isActive ? "Hoạt động" : "Không hoạt động"}
            </span>
          ),
          deactivatedReason: user.deactivatedReason ? user.deactivatedReason : "Không có lý do",
          phone: user.phone ? user.phone : "Không có số điện thoại",
          address: user.address ? user.address : "Không có địa chỉ",
        }))}
        onCreate={() => {}}
      />
    </div>
  );
};

export default DashboardUser;
