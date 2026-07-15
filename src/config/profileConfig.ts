import type { ProfileConfig } from "../types/config";

// 个人资料配置
export const profileConfig: ProfileConfig = {
	avatar: "/assets/images/avatar.jpg",
	name: "Sliverkiss",
	bio: "这里是 Sliverkiss 的个人博客，与你一起发现更大的世界 | 相遇即是缘分～",
	typewriter: {
		enable: true,
		speed: 80,
	},
	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/sliverkiss",
		},
		{
			name: "Email",
			icon: "material-symbols:mail",
			url: "mailto:tistzach@gmail.com",
		},
	],
};
