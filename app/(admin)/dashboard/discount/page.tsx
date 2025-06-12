"use client";

import DiscountForm from "@/app/(admin)/dashboard/discount/discountForm";
import Loading from "@/components/Loading";
import Modal from "@/components/Modal";
import UitlTable from "@/components/UtilTable";
import {
  useActiveDiscountMutation,
  useCreateDiscountOrderMutation,
  useCreateDiscountProductMutation,
  useDisableDiscountMutation,
  useGetDiscountsQuery,
  useUpdateDiscountOrderMutation,
  useUpdateDiscountProductMutation,
} from "@/state/api";
import type { Discount, DiscountRequestOrder, DiscountRequestProduct } from "@/types";
import { Percent, Package, ShoppingCart, CheckCircle, XCircle, Search, Filter, Tag } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";

type FilterStatus = "all" | "active" | "inactive";
type FilterType = "all" | "product" | "order";
type FilterDiscountType = "all" | "percentage" | "fixed";

const DiscountManager = () => {
  const { data: discounts, isLoading, refetch } = useGetDiscountsQuery({});
  const [disableDiscount] = useDisableDiscountMutation();
  const [activeDiscount] = useActiveDiscountMutation();
  const [createDiscountOrder] = useCreateDiscountOrderMutation();
  const [createDiscountProduct] = useCreateDiscountProductMutation();
  const [updateDiscountProduct] = useUpdateDiscountProductMutation();
  const [updateDiscountOrder] = useUpdateDiscountOrderMutation();

  const [discountList, setDiscountList] = useState<Discount[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterDiscountType, setFilterDiscountType] = useState<FilterDiscountType>("all");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (discounts) {
      // Reverse the list to show newest first
      const reversedDiscounts = [...(discounts as Discount[])].reverse();
      setDiscountList(reversedDiscounts);
    }
  }, [discounts]);

  // Filter discounts based on search term and filters
  const filteredDiscounts = useMemo(() => {
    return discountList.filter((discount) => {
      // Filter by status
      const statusMatch =
        filterStatus === "all" ||
        (filterStatus === "active" && discount.isActive === true) ||
        (filterStatus === "inactive" && discount.isActive === false);

      // Filter by target type
      const typeMatch = filterType === "all" || discount.targetType === filterType;

      // Filter by discount type
      const discountTypeMatch = filterDiscountType === "all" || discount.discountType === filterDiscountType;

      // Filter by search term
      const searchMatch =
        searchTerm === "" ||
        discount.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discount.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discount.description?.toLowerCase().includes(searchTerm.toLowerCase());

      return statusMatch && typeMatch && discountTypeMatch && searchMatch;
    });
  }, [discountList, filterStatus, filterType, filterDiscountType, searchTerm]);

  // Calculate statistics
  const totalDiscounts = discountList.length;
  const activeDiscounts = discountList.filter((d) => d.isActive === true).length;
  const inactiveDiscounts = discountList.filter((d) => d.isActive === false).length;
  const productDiscounts = discountList.filter((d) => d.targetType === "product").length;
  const orderDiscounts = discountList.filter((d) => d.targetType === "order").length;
  const percentageDiscounts = discountList.filter((d) => d.discountType === "percentage").length;
  const filteredCount = filteredDiscounts.length;

  if (!isMounted) {
    return null;
  }

  const handleDisable = async (id: string, reason: string) => {
    try {
      console.log("id", id, "reason", reason);
      const data = await disableDiscount({ id, reason }).unwrap();
      toast.success(data.message);
      await refetch();
    } catch (error) {
      toast.error("Đình chỉ discount thất bại!");
    }
  };

  const handleEnable = async (id: string) => {
    try {
      console.log("id", id);
      const data = await activeDiscount({ id }).unwrap();
      toast.success(data.message);
      await refetch();
    } catch (error) {
      toast.error("Kích hoạt discount thất bại!");
    }
  };

  const emptyDiscount: Discount = {
    _id: "",
    name: "",
    description: "",
    discountType: "",
    value: 0,
    applicableProducts: [""],
    applicableOrders: [""],
    startDate: "",
    endDate: "",
    code: "",
    targetType: "",
    isActive: true,
  };

  const handleCreate = () => {
    setEditingDiscount(emptyDiscount);
    setShowForm(true);
  };

  const handleUpdate = (discount: Discount) => {
    setEditingDiscount(discount);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingDiscount(null);
  };

  const handleClose = () => {
    setEditingDiscount(emptyDiscount);
    setShowForm(false);
  };

  const handleSubmit = async (data: Discount) => {
    console.log("data", data);

    try {
      if (editingDiscount && editingDiscount._id) {
        // Update existing discount
        if (data.targetType === "product") {
          const payload: DiscountRequestProduct = {
            name: data.name,
            description: data.description || "",
            discountType: data.discountType,
            value: data.value,
            applicableProducts: data.applicableProducts,
            startDate: data.startDate,
            endDate: data.endDate,
            code: data.code || "",
            targetType: data.targetType,
          };

          console.log("payload của EditProduct", payload);
          await updateDiscountProduct({ id: editingDiscount._id, body: payload }).unwrap();
          toast.success("Cập nhật discount sản phẩm thành công");
          handleClose();
          await refetch();
        } else if (data.targetType === "order") {
          const payload: DiscountRequestOrder = {
            name: data.name,
            description: data.description || "",
            discountType: data.discountType,
            value: data.value,
            applicableOrders: data.applicableOrders,
            startDate: data.startDate,
            endDate: data.endDate,
            code: data.code || "",
            targetType: data.targetType,
          };
          console.log("payload nè EditOrder", payload);
          await updateDiscountOrder({ id: editingDiscount._id, body: payload }).unwrap();
          toast.success("Cập nhật discount đơn hàng thành công");
          handleClose();
          await refetch();
        }
        setShowForm(false);
        setEditingDiscount(null);
      } else {
        // Create new discount
        if (data.targetType === "product") {
          console.log("data nè CreatePRoduct", data);
          const payload: DiscountRequestProduct = {
            name: data.name,
            description: data.description || "",
            discountType: data.discountType,
            value: data.value,
            applicableProducts: data.applicableProducts,
            startDate: data.startDate,
            endDate: data.endDate,
            code: data.code || "",
            targetType: data.targetType,
          };

          console.log("payload của Create Product", payload);
          await createDiscountProduct(payload).unwrap();
          toast.success("Tạo discount sản phẩm thành công");
          await refetch();
          handleClose();
        } else if (data.targetType === "order") {
          const payload: DiscountRequestOrder = {
            name: data.name,
            description: data.description || "",
            discountType: data.discountType,
            value: data.value,
            applicableOrders: data.applicableOrders,
            startDate: data.startDate,
            endDate: data.endDate,
            code: data.code || "",
            targetType: data.targetType,
          };

          console.log("payload của Create Order", payload);
          await createDiscountOrder(payload).unwrap();
          toast.success("Tạo discount đơn hàng thành công");
          handleClose();
          await refetch();
        }
        setShowForm(false);
        setEditingDiscount(null);
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Tạo hoặc cập nhật discount thất bại");
    }
  };

  // Process data for table display
  const processedDiscounts = filteredDiscounts.map((discount) => ({
    ...discount,
    discountType: discount.discountType === "percentage" ? "Phần trăm" : "Giá cố định",
    targetType:
      discount.targetType === "product" ? "Sản phẩm" : discount.targetType === "order" ? "Đơn hàng" : "Chưa có",
    startDate: new Date(discount.startDate).toLocaleDateString("vi-VN"),
    endDate: new Date(discount.endDate).toLocaleDateString("vi-VN"),
    isActive: (
      <span className={`font-semibold ${discount.isActive ? "text-green-600" : "text-red-600"}`}>
        {discount.isActive ? "Hoạt động" : "Không hoạt động"}
      </span>
    ),
    isActiveInData: discount.isActive ? true : false,
    reason: discount.reason ? discount.reason : "Không có lý do",
    value:
      discount.discountType === "percentage" ? `${discount.value}%` : `${discount.value.toLocaleString("vi-VN")} VND`,
  }));

  return (
    <div className="w-full min-h-screen">
      {isLoading && <Loading />}

      {/* Statistics and Filter Section */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border p-6 w-full">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6 w-full">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{totalDiscounts}</div>
                <div className="text-sm text-blue-600">Tổng mã giảm giá</div>
              </div>
              <Tag className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{activeDiscounts}</div>
                <div className="text-sm text-green-600">Đang hoạt động</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{inactiveDiscounts}</div>
                <div className="text-sm text-red-600">Không hoạt động</div>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{productDiscounts}</div>
                <div className="text-sm text-purple-600">Cho sản phẩm</div>
              </div>
              <Package className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">{orderDiscounts}</div>
                <div className="text-sm text-orange-600">Cho đơn hàng</div>
              </div>
              <ShoppingCart className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{percentageDiscounts}</div>
                <div className="text-sm text-yellow-600">Theo phần trăm</div>
              </div>
              <Percent className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Tìm kiếm mã giảm giá..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>

              {/* Target Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FilterType)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả loại</option>
                <option value="product">Sản phẩm</option>
                <option value="order">Đơn hàng</option>
              </select>

              {/* Discount Type Filter */}
              <select
                value={filterDiscountType}
                onChange={(e) => setFilterDiscountType(e.target.value as FilterDiscountType)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả kiểu</option>
                <option value="percentage">Phần trăm</option>
                <option value="fixed">Giá cố định</option>
              </select>
            </div>
          </div>

          {/* Current filter info */}
          <div className="text-sm text-gray-600 whitespace-nowrap">
            {searchTerm === "" && filterStatus === "all" && filterType === "all" && filterDiscountType === "all"
              ? `Hiển thị tất cả ${totalDiscounts} mã giảm giá`
              : `Tìm thấy ${filteredCount} kết quả`}
          </div>
        </div>
      </div>

      {/* Discount Table */}
      <div className="w-full overflow-x-auto">
        <UitlTable
          ITEMS_PER_PAGE={10}
          columns={[
            { key: "name", label: "Tên" },
            { key: "code", label: "Mã" },
            { key: "description", label: "Mô tả" },
            { key: "discountType", label: "Loại giảm giá" },
            { key: "value", label: "Giá trị" },
            { key: "targetType", label: "Loại" },
            { key: "startDate", label: "Ngày bắt đầu" },
            { key: "endDate", label: "Ngày kết thúc" },
            { key: "isActive", label: "Trạng thái" },
            { key: "reason", label: "Lý do" },
          ]}
          getIsActive={(row) => {
            console.log("getIsActive called with row:", row._id, "isActive:", row.isActiveInData);
            return Boolean(row.isActiveInData);
          }}
          data={processedDiscounts}
          onDisable={handleDisable}
          onEnable={handleEnable}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      </div>

      {/* No Results Message */}
      {filteredDiscounts.length === 0 && !isLoading && (
        <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200 mt-4">
          <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Không tìm thấy mã giảm giá</h3>
          <p className="text-gray-500">Không có mã giảm giá nào phù hợp với bộ lọc hiện tại.</p>
          <button
            onClick={() => {
              setFilterStatus("all");
              setFilterType("all");
              setFilterDiscountType("all");
              setSearchTerm("");
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

      {/* Active Discounts Alert */}
      {activeDiscounts > 0 && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-300 rounded-lg p-4 shadow-lg max-w-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">Có {activeDiscounts} mã giảm giá đang hoạt động</p>
              <p className="text-xs text-green-600">Khách hàng có thể sử dụng</p>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && editingDiscount && (
        <Modal onClose={handleClose}>
          <DiscountForm initialValues={editingDiscount} onSubmit={handleSubmit} onCancel={handleCancel} />
        </Modal>
      )}
    </div>
  );
};

export default DiscountManager;
