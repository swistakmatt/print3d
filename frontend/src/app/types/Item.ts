type Item = {
  _id?: string;
  user: string;
  name: string;
  description: string;
  category: string;
  isPublic?: boolean;
  image?: string;
  files: string[];
  price?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export default Item;
