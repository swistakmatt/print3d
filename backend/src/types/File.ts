type FileMetadata = {
	ownerId: string;
};

type File = {
	_id: string;
	chunkSize: number;
	filename: string;
	length: number;
	uploadDate: Date;
	metadata: FileMetadata;
};

export { File, FileMetadata };
