import type { AnnouncementConfig } from "../types/announcementConfig";

export const announcementConfig: AnnouncementConfig = {
	// 公告标题
	title: "公告",

	// 公告内容
	content:
		"作者在备战考研-不怕大家笑，二战啦，不算很努力，但是会一直坚持下去，学学计算机，学学生物化学，如果你想了解我，看我的文章和说说你会发现这个人，什么都敢说。",

	// 是否允许用户关闭公告
	closable: true,

	link: {
		// 启用链接
		enable: true,
		// 链接文本
		text: "了解更多",
		// 链接 URL
		url: "/about/",
		// 内部链接
		external: false,
	},
};
