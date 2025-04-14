"use client";
import CustomTable from "@/components/CustomTable2";
import Loading from "@/components/Loading";
import { useGetAllRequestQuery } from "@/state/api";
import { Request } from "@/types";
import React, { useEffect } from "react";

const DashboardRequest = () => {
  const { data: requests, isLoading } = useGetAllRequestQuery({});
  const [requestList, setRequestList] = React.useState<Request[]>([]);
  useEffect(() => {
    if (requests) {
      setRequestList(requests as Request[]);
    }
  }, [requests]);
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
      />
    </div>
  );
};

export default DashboardRequest;
