type FileMetadata = {
	ownerId: string;
	isPublic: boolean;
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
