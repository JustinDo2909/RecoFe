"use client";
import CustomTable from "@/components/CustomTable2";
import Loading from "@/components/Loading";
import {
  useGetAllRequestQuery,
  useUpdateStatusRequestMutation,
} from "@/state/api";
import { Request } from "@/types";
import React, { useEffect, useState } from "react";

const DashboardRequest = () => {
  const { data: requests, isLoading } = useGetAllRequestQuery({});
  const [requestList, setRequestList] = React.useState<Request[]>([]);
  const [updateStatus] = useUpdateStatusRequestMutation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (requests) {
      setRequestList(requests as Request[]);
    }
  }, [requests]);
  const handleUpdateRequestStatus = async (id: string, status: string) => {
    console.log(id, status);

    await updateStatus({ id, status }).unwrap();
  };

  if (!isMounted) {
    return null;
  }
  return (
    <div>
      {isLoading && (
        <div>
          <Loading />
        </div>
      )}
      <CustomTable
        ITEMS_PER_PAGE={10}
        data={requestList}
        columns={[
          { key: "_id", label: "ID" },
          { key: "type", label: "Type" },
          { key: "user", label: "User" },
          { key: "message", label: "Message" },
          { key: "status", label: "Status" },
          { key: "createdAt", label: "Date Created" },
        ]}
        onUpdateStatus={handleUpdateRequestStatus}
      />
    </div>
  );
};

export default DashboardRequest;
