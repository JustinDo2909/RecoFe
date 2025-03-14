export interface User {
  id: number
  username: string,
  email: string,
  role: string,
  loginLocations?: string
  }
  
  export interface Product {
    _id: string; // Changed from number to string
    name: string;
    description: string; // Fixed typo
    price: number;
    picture: string;
    stock: number;
    categorys: Category[]; // Ensure Category type is defined
    pictureId: string;
    discount: number
  }
  

export interface Category {
  _id: number,
  title: string,
  decription: string,
  products: Product[]
}

export interface CountUpProps {
  start: number,
  end: number,
  duration: number,
  title : string, 
  description : string
};

export interface countUpItemsProps  {
  id: number;
  number: number;
  text: string;
};