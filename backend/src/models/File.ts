import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	fileType: { type: String, required: true },
	filePath: { type: String, required: true },
	fileName: { type: String, required: true },
});

const File = mongoose.model('File', fileSchema);

export default File;
