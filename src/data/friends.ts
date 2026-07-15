// 友情链接数据配置
// 用于管理友情链接页面的数据

export interface FriendItem {
	id: number;
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
}

// 友情链接数据
export const friendsData: FriendItem[] = [
	{
		id: 1,
		title: "Sliverkiss Blog",
		imgurl: "/assets/images/avatar.jpg",
		desc: "与你一起发现更大的世界",
		siteurl: "https://blog.xn--ug8h.eu.org",
		tags: ["self"],
	},
	{
		id: 2,
		title: "Mizuki",
		imgurl: "https://avatars.githubusercontent.com/u/44914786?v=4&s=640",
		desc: "Astro Material Design 3 博客主题",
		siteurl: "https://github.com/LyraVoid/Mizuki",
		tags: ["Theme"],
	},
];

// 获取所有友情链接数据
export function getFriendsList(): FriendItem[] {
	return friendsData;
}

// 获取随机排序的友情链接数据
export function getShuffledFriendsList(): FriendItem[] {
	const shuffled = [...friendsData];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
