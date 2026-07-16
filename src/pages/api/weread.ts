import type { APIRoute } from "astro";
import type { WereadBook, WereadData, WereadStats } from "@/types/wereadConfig";

const WEREAD_API = "https://i.weread.qq.com/api/agent/gateway";
const API_KEY = import.meta.env.WEREAD_API_KEY || "";
const SKILL_VERSION = "1.0.3";

async function callWereadApi(
	apiName: string,
	params: Record<string, unknown> = {},
) {
	if (!API_KEY) {
		throw new Error("WEREAD_API_KEY 未配置");
	}

	const res = await fetch(WEREAD_API, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			api_name: apiName,
			skill_version: SKILL_VERSION,
			...params,
		}),
	});

	if (!res.ok) {
		throw new Error(`微信读书 API 请求失败: ${res.status}`);
	}

	return res.json();
}

// 获取书架
async function fetchBookshelf(): Promise<WereadBook[]> {
	try {
		const data = await callWereadApi("/shelf/sync");
		const books: WereadBook[] = [];

		if (data && Array.isArray(data.books)) {
			for (const book of data.books) {
				const isFinished = book.finishReading === 1;
				// 尝试从多个可能的字段获取封面 URL
				let coverUrl = "";
				if (book.bookInfo?.cover) {
					coverUrl = book.bookInfo.cover;
				} else if (book.cover) {
					coverUrl = book.cover;
				} else if (book.bookId) {
					// 如果没有封面 URL，使用微信读书默认封面接口
					coverUrl = `https://wr.y.qq.com/wr/img/${book.bookId}/s_400x600.jpg`;
				}

				books.push({
					bookId: book.bookId || "",
					title: book.title || book.bookInfo?.title || "未知书名",
					author: book.author || book.bookInfo?.author || "未知作者",
					cover: coverUrl,
					intro: book.intro || book.bookInfo?.intro,
					publishTime: book.publishTime,
					readProgress: isFinished ? 100 : undefined,
					status: isFinished ? "finished" : "reading",
					lastReadTime: book.readUpdateTime || book.updateTime,
				});
			}
		}

		return books.sort((a, b) => {
			if (a.status !== b.status) return a.status === "reading" ? -1 : 1;
			return (b.lastReadTime || 0) - (a.lastReadTime || 0);
		});
	} catch (err) {
		console.error("获取书架失败:", err);
		return [];
	}
}

// 获取阅读统计
async function fetchReadingStats(books: WereadBook[]): Promise<WereadStats> {
	try {
		const data = await callWereadApi("/readdata/detail", { mode: "overall" });

		const readingBooks = books.filter((b) => b.status === "reading").length;
		const finishedBooks = books.filter((b) => b.status === "finished").length;

		return {
			totalReadTime: data?.totalReadTime || data?.readTime || 0,
			totalReadDays: data?.totalReadDays || data?.readDays || 0,
			totalBooks: books.length,
			finishedBooks,
			readingBooks,
		};
	} catch (err) {
		console.error("获取阅读统计失败:", err);
		return {
			totalReadTime: 0,
			totalReadDays: 0,
			totalBooks: books.length,
			finishedBooks: books.filter((b) => b.status === "finished").length,
			readingBooks: books.filter((b) => b.status === "reading").length,
		};
	}
}

export const GET: APIRoute = async () => {
	const books = await fetchBookshelf();
	const stats = await fetchReadingStats(books);

	const result: WereadData = {
		books,
		stats,
		updateTime: new Date().toISOString(),
	};

	return new Response(JSON.stringify(result), {
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
