type Order = {
  _id: string;
  user: string;
  items: string[];
  total: number;
  status: string;
  payment: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  tracking?: string;
  deliveredAt?: Date;
  createdAt: Date;
};

export default Order;
