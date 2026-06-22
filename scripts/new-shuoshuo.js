/* Create a new shuoshuo markdown file with frontmatter. */

import fs from "fs";
import path from "path";

const targetDir = "./src/content/shuoshuo/";

function pad(value) {
	return String(value).padStart(2, "0");
}

function formatDateTime(date) {
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function formatFileStamp(date) {
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function sanitizeFileName(value) {
	return value
		.trim()
		.replace(/[<>:"/\\|?*\x00-\x1f]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

function parseDate(value) {
	if (!value) return new Date();

	const normalized = value.includes("T") ? value : value.replace(" ", "T");
	const date = new Date(normalized);
	if (Number.isNaN(date.getTime())) {
		console.error(`Error: Invalid date "${value}"`);
		process.exit(1);
	}
	return date;
}

function parseArgs(args) {
	const options = {
		date: "",
		draft: false,
		mood: "",
		slug: "",
		tags: "",
	};
	const body = [];

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];

		if (arg === "--help" || arg === "-h") {
			printUsage();
			process.exit(0);
		}

		if (arg === "--draft") {
			options.draft = true;
			continue;
		}

		if (arg.startsWith("--")) {
			const [key, inlineValue] = arg.slice(2).split("=");
			const value = inlineValue ?? args[i + 1];

			if (inlineValue === undefined) i += 1;

			if (!value || value.startsWith("--")) {
				console.error(`Error: Missing value for --${key}`);
				process.exit(1);
			}

			if (key in options) {
				options[key] = value;
			} else {
				console.error(`Error: Unknown option --${key}`);
				process.exit(1);
			}
			continue;
		}

		body.push(arg);
	}

	return { body: body.join(" ").trim(), options };
}

function parseTags(value) {
	return value
		.split(/[,，]/)
		.map((tag) => tag.trim())
		.filter(Boolean);
}

function yamlInlineList(values) {
	return `[${values.map((value) => JSON.stringify(value)).join(", ")}]`;
}

function printUsage() {
	console.log(`Usage:
  pnpm new-shuoshuo "今天的内容" --mood 开心 --tags 生活,记录

Options:
  --mood <text>       心情
  --tags <a,b>        标签，使用逗号分隔
  --date <datetime>   发布时间，例如 "2026-06-22 09:30:00"
  --slug <filename>   自定义文件名
  --draft             创建为草稿`);
}

const { body, options } = parseArgs(process.argv.slice(2));

if (!body) {
	console.error("Error: No shuoshuo content provided");
	printUsage();
	process.exit(1);
}

const published = parseDate(options.date);
const fileBaseName =
	sanitizeFileName(options.slug) || formatFileStamp(published);
const fileName = fileBaseName.endsWith(".md")
	? fileBaseName
	: `${fileBaseName}.md`;
const fullPath = path.join(targetDir, fileName);

if (fs.existsSync(fullPath)) {
	console.error(`Error: File ${fullPath} already exists`);
	process.exit(1);
}

if (!fs.existsSync(targetDir)) {
	fs.mkdirSync(targetDir, { recursive: true });
}

const tags = parseTags(options.tags);
const content = `---
published: ${JSON.stringify(formatDateTime(published))}
mood: ${JSON.stringify(options.mood)}
tags: ${yamlInlineList(tags)}
draft: ${options.draft ? "true" : "false"}
---

${body}
`;

fs.writeFileSync(fullPath, content, "utf8");

console.log(`Shuoshuo ${fullPath} created`);
