/**
 * 构建时获取微信读书书架数据，生成静态 JSON 文件
 * 用于 GitHub Pages 等纯静态托管环境
 *
 * 用法: node scripts/fetch-weread.mjs
 * 需要环境变量: WEREAD_API_KEY
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, "..", "public", "weread-data.json");

const WEREAD_API = "https://i.weread.qq.com/api/agent/gateway";
const API_KEY = process.env.WEREAD_API_KEY || "";
const SKILL_VERSION = "1.0.3";

async function callWereadApi(apiName, params = {}) {
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

async function fetchBookshelf() {
    const data = await callWereadApi("/shelf/sync");
    const books = [];

    if (data && Array.isArray(data.books)) {
        for (const book of data.books) {
            const isFinished = book.finishReading === 1;
            let coverUrl = "";
            if (book.bookInfo?.cover) {
                coverUrl = book.bookInfo.cover;
            } else if (book.cover) {
                coverUrl = book.cover;
            } else if (book.bookId) {
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
}

async function fetchReadingStats(books) {
    try {
        const data = await callWereadApi("/readdata/detail", { mode: "overall" });
        return {
            totalReadTime: data?.totalReadTime || data?.readTime || 0,
            totalReadDays: data?.totalReadDays || data?.readDays || 0,
            totalBooks: books.length,
            finishedBooks: books.filter((b) => b.status === "finished").length,
            readingBooks: books.filter((b) => b.status === "reading").length,
        };
    } catch {
        return {
            totalReadTime: 0,
            totalReadDays: 0,
            totalBooks: books.length,
            finishedBooks: books.filter((b) => b.status === "finished").length,
            readingBooks: books.filter((b) => b.status === "reading").length,
        };
    }
}

async function main() {
    console.log("[weread] 正在获取书架数据...");

    try {
        const books = await fetchBookshelf();
        const stats = await fetchReadingStats(books);

        const result = {
            books,
            stats,
            updateTime: new Date().toISOString(),
        };

        writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2));
        console.log(
            `[weread] 成功！共 ${books.length} 本书，数据已写入 ${OUTPUT_PATH}`,
        );
    } catch (err) {
        console.error("[weread] 获取失败:", err.message);
        // 不覆盖已有缓存文件，CI 中 continue-on-error 会跳过此步骤
        // 但如果已有 public/weread-data.json 则直接使用
        console.log("[weread] 将使用已有的缓存数据（如有）");
    }
}

main();
