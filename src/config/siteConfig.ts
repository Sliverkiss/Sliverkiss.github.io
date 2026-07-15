import type { SiteConfig } from "../types/config";

// 定义站点语言
const SITE_LANG = "zh_CN";

export const siteConfig: SiteConfig = {
	title: "Sliverkiss Blog",
	subtitle: "与你一起发现更大的世界",
	siteURL: "https://blog.xn--ug8h.eu.org/",
	siteStartDate: "2023-05-17",

	lang: SITE_LANG,

	themeColor: {
		hue: 250,
		fixed: false,
	},

	// 精简特色页，避免空页面影响 SEO
	featurePages: {
		anime: false,
		diary: false,
		friends: true,
		projects: false,
		skills: false,
		timeline: false,
		albums: false,
		devices: false,
		aiTools: false,
	},

	navbarTitle: {
		mode: "text-icon",
		text: "Sliverkiss",
		icon: "assets/home/home.webp",
		logo: "assets/home/default-logo.webp",
	},

	pageScaling: {
		enable: true,
		targetWidth: 2000,
	},

	bangumi: {
		userId: "",
		fetchOnDev: false,
	},

	bilibili: {
		vmid: "",
		fetchOnDev: false,
		coverMirror: "",
		useWebp: true,
	},

	anime: {
		mode: "local",
	},

	diaryApiUrl: "",

	postListLayout: {
		defaultMode: "list",
		enable: true,
		allowSwitch: true,
		categoryBar: {
			enable: true,
		},
	},

	tagStyle: {
		useNewStyle: false,
	},

	wallpaperMode: {
		defaultMode: "banner",
		showModeSwitchOnMobile: "both",
	},

	banner: {
		src: {
			desktop: [
				"/assets/desktop-banner/1.jpg",
				"/assets/desktop-banner/2.jpg",
				"/assets/desktop-banner/3.jpg",
				"/assets/desktop-banner/4.jpg",
			],
			mobile: [
				"/assets/mobile-banner/1.jpg",
				"/assets/mobile-banner/2.jpg",
				"/assets/mobile-banner/3.jpg",
				"/assets/mobile-banner/4.jpg",
			],
		},

		position: "center",

		carousel: {
			enable: true,
			interval: 4,
			switchable: true,
		},

		waves: {
			enable: true,
			performanceMode: false,
			mobileDisable: false,
			switchable: true,
		},

		imageApi: {
			enable: false,
			url: "",
		},

		homeText: {
			enable: true,
			title: "Sliverkiss Blog",
			switchable: true,

			subtitle: [
				"与你一起发现更大的世界",
				"相遇即是缘分～",
				"折腾 · 记录 · 分享",
			],
			typewriter: {
				enable: true,
				speed: 100,
				deleteSpeed: 50,
				pauseTime: 2000,
			},
		},

		credit: {
			enable: false,
			text: "",
			url: "",
		},

		navbar: {
			transparentMode: "semifull",
		},
	},
	toc: {
		enable: true,
		mobileTop: true,
		desktopSidebar: true,
		floating: true,
		depth: 3,
		useJapaneseBadge: false,
	},
	showCoverInContent: true,
	generateOgImages: false,
	favicon: [
		{
			src: "/favicon/favicon.ico",
		},
	],

	showLastModified: true,
	pageProgressBar: {
		enable: true,
		height: 3,
		duration: 6000,
	},

	thirdPartyAnalytics: {
		enable: false,
		clarityId: "",
	},
	card: {
		border: true,
		followTheme: false,
	},
	imageOptimization: {
		formats: "webp",
		quality: 85,
		noReferrerDomains: ["*.hdslb.com"],
	},
};

export { SITE_LANG };
