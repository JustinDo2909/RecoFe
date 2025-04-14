"use client"
import CustomTable from '@/components/CustomTable2';
import Loading from '@/components/Loading';
import { useGetAllServiceQuery } from '@/state/api'
import { Service } from '@/types';
import React, { useEffect } from 'react'

const DashboardService = () => {
    const {data:  services , isLoading} = useGetAllServiceQuery({})
    const [serviceList, setServiceList] = React.useState<Service[]>([]);
    useEffect(() => {
        if (services) {
            setServiceList(services as Service[]);
        }
    },[services])
   return (
    <div>
        {isLoading && <div><Loading/></div>}
        <CustomTable ITEMS_PER_PAGE={10}  data={serviceList} columns={[
            { key: "_id", label: "ID" },
            { key: "name", label: "Name" },
            { key: "price", label: "Price" },
            { key: "description", label: "Description" },
            { key: "createdAt", label: "Date Created" },
        ]} />
    </div>
  )
}

export default DashboardService