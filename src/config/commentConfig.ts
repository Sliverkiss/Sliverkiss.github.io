import type { CommentConfig } from "../types/config";
import { SITE_LANG } from "./siteConfig";

// 评论系统配置（giscus）
// repo node_id: R_kgDOIHsKkQ
// General category id: DIC_kwDOIHsKkc4DBOXb
export const commentConfig: CommentConfig = {
	enable: true,
	system: "giscus",
	twikoo: {
		envId: "",
		lang: SITE_LANG,
	},
	giscus: {
		repo: "Sliverkiss/Sliverkiss.github.io",
		repoId: "R_kgDOIHsKkQ",
		category: "General",
		categoryId: "DIC_kwDOIHsKkc4DBOXb",
		mapping: "pathname",
		strict: "0",
		reactionsEnabled: "1",
		emitMetadata: "0",
		inputPosition: "bottom",
		theme: "preferred_color_scheme",
		lang: "zh-CN",
		loading: "lazy",
	},
};
