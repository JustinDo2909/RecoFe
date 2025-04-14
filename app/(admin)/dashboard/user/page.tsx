"use client";
import CustomTable from "@/components/CustomTable2";
import Loading from "@/components/Loading";
import { useGetUsersQuery } from "@/state/api";
import { User } from "@/types";
import React, { use, useEffect, useState } from "react";

const DashboardUser = () => {
  const { data: users, isLoading } = useGetUsersQuery({});
  const [userList, setUserList] = React.useState<User[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (users) {
      setUserList(users as User[]);
    }
  }, [users]);
  if (!isMounted) {
    return null;
  }
  return (
    <div>
      {isLoading && <div><Loading/></div>}
      <CustomTable
        ITEMS_PER_PAGE={10}
        columns={[
          { key: "_id", label: "ID" },
          { key: "username", label: "Username" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
          { key: "createdAt", label: "Date Created" },
          { key: "updatedAt", label: "Date Updated" },
        ]}
        data={userList}
        onCreate={() => {}}
        onDelete={() => {}}
        onUpdate={() => {}}
        
      />
    </div>
  );
};

export default DashboardUser;
