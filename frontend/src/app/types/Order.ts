import Item from './Item';

type Order = {
  _id?: string;
  user: string;
  items: Item[];
  filament_color: string;
  filament_type: string;
  total: number;
  status: string;
  payment_method: string;
  payment_status: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  tracking?: string;
  deliveredAt?: Date;
  createdAt?: Date;
};

export default Order;
