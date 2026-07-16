export type WereadBook = {
	bookId: string;
	title: string;
	author: string;
	cover: string;
	intro?: string;
	publishTime?: string;
	readProgress?: number; // 阅读进度百分比
	status: "reading" | "finished"; // 在读/已读
	lastReadTime?: number;
};

export type WereadStats = {
	totalReadTime: number; // 总阅读时长（秒）
	totalReadDays: number; // 总阅读天数
	totalBooks: number; // 总书籍数
	finishedBooks: number; // 已读书籍数
	readingBooks: number; // 在读书籍数
};

export type WereadData = {
	books: WereadBook[];
	stats: WereadStats;
	updateTime: string;
};
