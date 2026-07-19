import {
	type NavBarConfig,
	type NavBarLink,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/navBarConfig";
import { LinkPresets } from "./LinkPresets";
import { sidebarLayoutConfig } from "./sidebarConfig";

// ============================================================================
// 导航栏配置 - 根据顺序动态生成导航栏链接
// NavBar Configuration - Dynamically generate navigation bar links based on order
// ============================================================================
const getDynamicNavBarConfig = (): NavBarConfig => {
	// 基础导航栏链接
	const links: NavBarLink[] = [
		// 主页
		LinkPresets.Home,
	];

	// 文章及其子菜单
	links.push({
		name: "文章",
		url: "#",
		icon: "material-symbols:article",
		children: [
			// 归档
			LinkPresets.Archive,

			// 分类
			LinkPresets.Categories,

			// 标签
			LinkPresets.Tags,

			// 笔记本
			LinkPresets.Notebooks,
		],
	});
	// 动态及其子菜单
	links.push({
		name: "动态",
		url: "#",
		icon: "material-symbols:dynamic-feed",
		children: [
			// 说说
			LinkPresets.Shuoshuo,

			// 相册
			LinkPresets.Gallery,
		],
	});
	// 书架
	links.push(LinkPresets.Weread);
	// 友链
	links.push(LinkPresets.Friends);

	// 留言板
	links.push(LinkPresets.Guestbook);

	// 关于及其子菜单
	links.push({
		name: "关于",
		url: "#",
		icon: "material-symbols:info",
		children: [
			// 打赏
			LinkPresets.Sponsor,

			// 周日程表
			LinkPresets.Schedule,

			// 关于页面
			LinkPresets.About,
		],
	});

	// 自定义导航栏链接
	if (sidebarLayoutConfig.showNavBarLinksMenu ?? true) {
		links.push({
			name: "链接",
			url: "#",
			icon: "material-symbols:link",
			// 子菜单
			children: [
				{
					name: "GitHub",
					url: "https://github.com/dongjianying",
					external: true,
					icon: "fa7-brands:github",
				},
				{
					name: "Gitee",
					url: "https://gitee.com/dong20031120",
					external: true,
					icon: "fa7-brands:gitee",
				},
				{
					name: "微信",
					url: "weixin://dl/chat?djy2132415051",
					external: true,
					icon: "fa7-brands:weixin",
				},
				{
					name: "Firefly文档",
					url: "https://docs-firefly.cuteleaf.cn",
					external: true,
					icon: "material-symbols:docs",
				},
			],
		});
	}

	// 文档链接
	// links.push({
	// 	name: "文档",
	// 	url: "https://docs-firefly.cuteleaf.cn",
	// 	external: true,
	// 	icon: "material-symbols:docs",
	// });

	return { links } as NavBarConfig;
};

// 导航搜索配置
export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
