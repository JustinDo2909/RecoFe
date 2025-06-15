export interface User {
  id: number;
  _id: string;
  username: string;
  email: string;
  role: string;
  loginLocations?: string;
  createdAt?: string;
  updatedAt?: string;
  date_of_birth: Date;
  isActive: boolean;
  phone: string;
  address: string;
  deactivatedReason: string;
}

export interface Discount {
  _id: string;
  name: string;
  description?: string;
  discountType: "percentage" | "fixed";
  value: number;
  applicableProducts: string[]; // hoặc Product[] nếu populate
  applicableOrders: string[]; // hoặc Order[] nếu populate
  startDate: string; // ISO date string từ BE
  endDate: string;
  isActive: boolean;
  code?: string;
  createdBy?: string;
  editBy?: string;
  reason?: string | null;
  targetType: "product" | "order";
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  discountCode ?: string;
  categoryNames ?: string | string[];
  product?: any
  _id?: string;
  name?: string;
  description?: string;
  decription?: string;
  price?: number;
  rating?: number;
  location?: string;
  picture?: string;
  stock?: number;
  categories?: string[]; // đúng tên theo BE là `categories`
  editby?: string;
  isActive?: boolean;
  currentDiscount?: Discount | string; // có thể populate hoặc chỉ chứa ObjectId
  deactivationReason?: string;
  finalPrice?: number;
  createdAt?: string;
  updatedAt?: string;
  discount? : number
}

export interface Category {
  id?: number;
  _id: string;
  title: string;
  description?: string;
  products: string;
  isActive: any;
  reason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CountUpProps {
  start: number;
  end: number;
  duration: number;
  title: string;
  description: string;
}

export interface countUpItemsProps {
  id: number;
  number: number;
  text: string;
}

export interface Card {
  productId: {
    _id: string;
    name: string;
    description: string; // Fixed typo
    decription: string;
    price: number;
    rating: number;
    location: string;
    picture: string;
    pictureId?: string;
    discount?: number;
    stock: number;
    categorys: Category[];
  };
  quantity: number;
}

export interface Order {
  id: number;
  _id: string;
  userId: string;
  items: [
    {
      productId: string;
      quantity: number;
      _id: string;
      finalPrice: number;
      picture?: string;
      name? : string
    },
  ];
  totalPrice: number;
  paymentMethod: string;
  feeShipping: number;
  statusOrder: string;
  statusPayment: string;
  reason: string;
  createdAt: string;
}

export interface Service {
  id: number;
  _id: string;
  name: string;
  price: number;
  description: string;
  createdAt: string;
}

export interface Request {
  _id: string;
  type: "refund" | "other"; // hoặc có thể mở rộng nếu cần
  status: "Pending" | "Approved" | "Rejected";
  user: User;
  order?: Order;
  service?: Service;
  message: string;
  createdAt: string;
}

export interface Wallet {
  id: number;
  amount: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface DashboardParams {
  start: string;
  end: string;
}

export interface DiscountRequestProduct {
  name: string;
  description?: string;
  discountType: string;
  value: number;
  applicableProducts: string[];
  startDate: string;
  endDate: string;
  code: string;
  targetType: string;
}

export interface DiscountRequestOrder {
  name: string;
  description?: string;
  discountType: string;
  value: number;
  applicableOrders: string[];
  startDate: string;
  endDate: string;
  code: string;
  targetType: string;
}

export interface Response<T> {
  message: string;
  data?: T;
  success: boolean;
}

export interface Custome {
  _id: string;
  user: string;
  image: string;
  product?: string;
  title?: string;
  createdAt: string;
  isActive: boolean;
}

export interface CustomResponse {
  _id: string;
  title: string;
  image: string;
  createdAt: string;
  isActive: boolean;
  metadata: {
    elements: any[];
  };
  user: {
    _id: string;
    username: string;
    email: string;
    phone: string;
    address: string;
    date_of_birth: string | null;
    avatar: string;
  };
  product: {
    _id: string;
    name: string;
  };
}
