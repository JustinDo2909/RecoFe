export interface User {
  id: number;
  _id: string;
  username: string;
  email: string;
  role: string;
  loginLocations?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id?: number;
  _id: string;
  name: string;
  description: string;
  decription: string;
  price: number;
  picture: string;
  stock: number;
  categorys: Category[];
  pictureId?: string;
  discount?: number; // Make it optional here
  discountts?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: number;
  _id: string;
  title: string;
  description: string; // Fixed typo
  decription: string;
  products: Product[]; // List of products in this category
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
    },
  ];
  totalPrice: number;
  paymentMethod: string;
  statusOrder: string;
  statusPayment: string;
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
  id: number;
  _id: string;
  type: string;
  status: "Approved" | "Cannceled" | "Pending";
  user: User;
  message: string;
  createdAt: string;
}
