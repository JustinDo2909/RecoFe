"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  CalendarIcon,
  TrendingUp,
  Package,
  ShoppingCart,
  DollarSign,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useGetDashboardQuery } from "@/state/api";
import type { DateRange } from "react-day-picker";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const chartConfig = {
  totalProducts: {
    label: "Sản phẩm",
    color: "hsl(var(--chart-1))",
    icon: Package,
  },
  totalOrders: {
    label: "Đơn hàng",
    color: "hsl(var(--chart-2))",
    icon: ShoppingCart,
  },
  totalRevenue: {
    label: "Doanh thu",
    color: "hsl(var(--chart-3))",
    icon: DollarSign,
  },
} satisfies ChartConfig;

export default function DashboardChart() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date("2025-04-01"),
    to: new Date("2025-04-30"),
  });

  const start = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "";
  const end = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "";

  const { data, isLoading, error } = useGetDashboardQuery(
    { start, end },
    { skip: !start || !end },
  );

  // Format number to VND currency
  const formatVND = (value: number): string => {
    if (isNaN(value) || value === 0) return "0 VND";
    return new Intl.NumberFormat("vi-VN").format(value) + " VND";
  };

  // Format large numbers for display
  const formatNumber = (value: number): string => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + "M";
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + "K";
    }
    return value.toString();
  };

  const chartData = data ? [data] : [];

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {entry.dataKey === "totalRevenue"
                  ? `${chartConfig[entry.dataKey as keyof typeof chartConfig].label}: ${formatVND(entry.value)}`
                  : `${chartConfig[entry.dataKey as keyof typeof chartConfig].label}: ${entry.value.toLocaleString("vi-VN")}`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Báo cáo thống kê
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tổng quan doanh số và hoạt động kinh doanh
          </p>
        </div>
      </div>

      {/* Date Range Picker */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          Chọn khoảng thời gian:
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className={cn(
                "w-[300px] justify-start text-left font-medium bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600",
                !dateRange && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd/MM/yyyy", { locale: vi })} -{" "}
                    {format(dateRange.to, "dd/MM/yyyy", { locale: vi })}
                  </>
                ) : (
                  format(dateRange.from, "dd/MM/yyyy", { locale: vi })
                )
              ) : (
                <span>Chọn khoảng thời gian</span>
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
              locale={vi}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Statistics Cards */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-4 rounded-xl border border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  Tổng sản phẩm
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {data.totalProducts?.toLocaleString("vi-VN") || 0}
                </p>
              </div>
              <Package className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Tổng đơn hàng
                </p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {data.totalOrders?.toLocaleString("vi-VN") || 0}
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-4 rounded-xl border border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Tổng doanh thu
                </p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {formatVND(data.totalRevenue || 0)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Đang tải dữ liệu...
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center h-64 bg-red-50 dark:bg-red-900 rounded-xl border border-red-200 dark:border-red-700">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 font-medium">
              Có lỗi xảy ra khi tải dữ liệu
            </p>
            <p className="text-sm text-red-500 dark:text-red-300 mt-1">
              Vui lòng thử lại sau
            </p>
          </div>
        </div>
      )}

      {/* Chart Section */}
      {!isLoading && !error && chartData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Biểu đồ thống kê
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Dữ liệu từ{" "}
              {dateRange?.from &&
                format(dateRange.from, "dd/MM/yyyy", { locale: vi })}
              {dateRange?.to &&
                ` đến ${format(dateRange.to, "dd/MM/yyyy", { locale: vi })}`}
            </p>
          </div>

          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="dateLabel"
                  tick={{ fontSize: 12 }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  className="text-gray-600 dark:text-gray-400"
                  tickFormatter={formatNumber}
                />
                <ChartTooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="rect" />
                <Bar
                  yAxisId="left"
                  dataKey="totalProducts"
                  fill="var(--color-totalProducts)"
                  radius={[4, 4, 0, 0]}
                  name="Sản phẩm"
                />
                <Bar
                  yAxisId="left"
                  dataKey="totalOrders"
                  fill="var(--color-totalOrders)"
                  radius={[4, 4, 0, 0]}
                  name="Đơn hàng"
                />
                <Bar
                  yAxisId="right"
                  dataKey="totalRevenue"
                  fill="var(--color-totalRevenue)"
                  radius={[4, 4, 0, 0]}
                  name="Doanh thu (VND)"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      )}

      {/* No Data State */}
      {!isLoading && !error && chartData.length === 0 && (
        <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Không có dữ liệu
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Vui lòng chọn khoảng thời gian khác
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
