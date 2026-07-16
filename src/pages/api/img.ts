import type { APIRoute } from "astro";

/**
 * 图片代理 API（生产环境）
 * 服务端直接获取外部图片并返回，绕过浏览器代理/防盗链限制
 * 用法: /api/img/?url=<encoded_image_url>
 *
 * 注意：此路由仅在构建后生效。开发环境使用 astro.config.mjs 中的 Vite 中间件。
 */
export const GET: APIRoute = async ({ request }) => {
	// 从原始请求 URL 中提取查询参数
	const reqUrl = new URL(request.url);
	const imageUrl = reqUrl.searchParams.get("url");

	if (!imageUrl) {
		return new Response("Missing url parameter", { status: 400 });
	}

	// 安全校验：只允许 http/https 协议
	let parsedUrl: URL;
	try {
		parsedUrl = new URL(imageUrl);
		if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
			return new Response("Invalid protocol", { status: 400 });
		}
	} catch {
		return new Response("Invalid URL", { status: 400 });
	}

	try {
		const response = await fetch(parsedUrl.href, {
			headers: {
				Referer: "",
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
			},
			signal: AbortSignal.timeout(5000),
		});

		if (!response.ok) {
			return new Response("Image fetch failed", {
				status: response.status,
			});
		}

		const contentType = response.headers.get("content-type") || "image/jpeg";
		const body = await response.arrayBuffer();

		return new Response(body, {
			status: 200,
			headers: {
				"Content-Type": contentType,
				"Cache-Control": "public, max-age=86400",
				"Access-Control-Allow-Origin": "*",
			},
		});
	} catch (err) {
		console.error("Image proxy error:", err);
		return new Response("Image proxy failed", { status: 502 });
	}
};
