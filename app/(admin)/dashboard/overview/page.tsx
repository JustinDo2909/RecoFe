"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useGetDashboardQuery } from "@/state/api";
import { DateRange } from "react-day-picker";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";

const chartConfig = {
  totalProducts: { label: "Products", color: "#22c55e" },
  totalOrders: { label: "Orders", color: "#f59e0b" },
  totalRevenue: { label: "Revenue", color: "#ef4444" },
} satisfies ChartConfig;

export default function DashboardChart() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date("2025-04-01"),
    to: new Date("2025-04-30"),
  });

  const start = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "";
  const end = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "";

  const { data } = useGetDashboardQuery(
    { start, end },
    { skip: !start || !end } // skip query nếu chưa có đủ ngày
  );

  const chartData = data ? [data] : [];
  return (
    <div className="w-full max-w-6xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md space-y-6">
      {/* Date Range Picker */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phạm vi ngày</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className={cn(
                "w-[280px] justify-start text-left font-medium bg-white dark:bg-gray-800",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Chart Section */}
      <div className="overflow-x-auto rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <ChartContainer config={chartConfig} className="w-full">
          <BarChart width={1000} height={400} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dateLabel" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="totalProducts" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="left" dataKey="totalOrders" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="totalRevenue" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
