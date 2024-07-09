import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema();

const Item = mongoose.model('Item', ItemSchema);

export default Item;
