type SupportRequest = {
  _id?: string;
  userId?: string;
  email: string;
  title: string;
  message: string;
  resolved?: boolean;
  createdAt?: Date;
};

export default SupportRequest;
