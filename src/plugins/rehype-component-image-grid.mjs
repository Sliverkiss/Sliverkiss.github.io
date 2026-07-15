/// <reference types="mdast" />
import { h } from "hastscript";

let gallerySequence = 0;

const DEFAULT_COLUMNS = 3;
const DEFAULT_ASPECT_RATIO = "16 / 10";
const DEFAULT_FIT = "cover";

function parseColumns(value) {
	const columns = Number.parseInt(String(value ?? DEFAULT_COLUMNS), 10);
	return Number.isInteger(columns) && columns >= 1 && columns <= 6
		? columns
		: DEFAULT_COLUMNS;
}

function parseAspectRatio(value) {
	if (typeof value !== "string") {
		return DEFAULT_ASPECT_RATIO;
	}

	const match = value.match(
		/^\s*(?<width>\d+(?:\.\d+)?)\s*\/\s*(?<height>\d+(?:\.\d+)?)\s*$/,
	);
	if (!match?.groups) {
		return DEFAULT_ASPECT_RATIO;
	}

	const { width, height } = match.groups;
	if (Number(width) <= 0 || Number(height) <= 0) {
		return DEFAULT_ASPECT_RATIO;
	}

	return `${width} / ${height}`;
}

function parseFit(value) {
	return value === "contain" ? "contain" : DEFAULT_FIT;
}

function findImages(nodes = []) {
	const images = [];

	const visit = (node) => {
		if (!node || typeof node !== "object") {
			return;
		}

		if (node.type === "element" && node.tagName === "img") {
			images.push(node);
			return;
		}

		if (Array.isArray(node.children)) {
			for (const child of node.children) {
				visit(child);
			}
		}
	};

	for (const node of nodes) {
		visit(node);
	}

	return images;
}

/**
 * Renders a `:::grid` directive as a responsive image gallery.
 *
 * @param {Record<string, unknown>} properties Directive attributes.
 * @param {import('hast').RootContent[]} children Directive children.
 * @returns {import('hast').Element}
 */
export function ImageGridComponent(properties, children) {
	const images = findImages(children);
	if (images.length === 0) {
		return h(
			"div",
			{ class: "hidden" },
			'Invalid image grid. (Use a block directive containing one or more Markdown images: ":::grid ... :::")',
		);
	}

	const galleryId = `image-grid-${gallerySequence++}`;
	const columns = parseColumns(properties?.columns);
	const aspectRatio = parseAspectRatio(properties?.aspect);
	const fit = parseFit(properties?.fit);

	const items = images.map((image) => {
		const src = image.properties?.src;
		const alt = String(image.properties?.alt ?? "");
		const title = String(image.properties?.title ?? alt);

		return h("figure", { class: "image-grid__item" }, [
			h(
				"a",
				{
					class: "image-grid__link no-styling",
					href: src,
					"data-fancybox": galleryId,
					"data-no-swup": "true",
					"data-caption": title,
				},
				[image],
			),
			title ? h("figcaption", { class: "image-grid__caption" }, title) : null,
		]);
	});

	return h(
		"div",
		{
			class: "image-grid",
			"data-columns": String(columns),
			style: `--image-grid-columns: ${columns}; --image-grid-aspect-ratio: ${aspectRatio}; --image-grid-fit: ${fit};`,
		},
		items,
	);
}
