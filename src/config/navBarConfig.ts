import type { NavBarConfig } from "../types/config";
import { LinkPreset } from "../types/config";

/**
 * 导航栏菜单配置（Sliverkiss 精简版）
 */
export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		LinkPreset.Friends,
		{
			name: "GitHub",
			url: "https://github.com/sliverkiss",
			icon: "fa7-brands:github",
			external: true,
		},
	],
};
