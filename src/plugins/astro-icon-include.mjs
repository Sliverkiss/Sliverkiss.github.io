import { readdirSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

/**
 * astro-icon embeds icon sets into a `virtual:astro-icon` module at build time.
 * When `include` is omitted, every installed `@iconify-json/*` package is bundled
 * in full (~30k icons / ~18MB), which overflows es-module-lexer's WASM memory
 * ceiling and crashes the Vite/rolldown build.
 *
 * To avoid that, we scan the source tree for icon references (`prefix:name`
 * string literals) belonging to installed collections and build a minimal
 * `include` allowlist. All icon names in this project are static literals, so a
 * source scan captures every icon that astro-icon needs to render.
 *
 * Each scanned name is validated against the collection's actual icons and
 * aliases, so stray matches from comments, typos, or CDN-only icons are dropped
 * rather than passed to astro-icon (which errors the build on unknown names).
 */

const require = createRequire(import.meta.url);

// Collections installed as @iconify-json/* packages and rendered through
// astro-icon's build-time <Icon> component. Other prefixes (e.g. logos,
// devicon) are rendered via the runtime <iconify-icon> web component and do
// not go through astro-icon, so they must not appear here.
const INSTALLED_COLLECTIONS = [
	"material-symbols",
	"mdi",
	"fa7-solid",
	"fa7-regular",
	"fa7-brands",
	"simple-icons",
];

const SCAN_DIR = "src";
const SCAN_EXTENSIONS = [
	".astro",
	".svelte",
	".ts",
	".tsx",
	".js",
	".mjs",
	".json",
];

// Matches `prefix:name` icon identifiers, e.g. material-symbols:home-outline.
const ICON_REF_RE =
	/\b([a-z0-9]+(?:-[a-z0-9]+)*):([a-z0-9]+(?:-[a-z0-9]+)*)\b/g;

function walk(dir, files = []) {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		const stats = statSync(full);
		if (stats.isDirectory()) {
			walk(full, files);
		} else if (SCAN_EXTENSIONS.some((ext) => full.endsWith(ext))) {
			files.push(full);
		}
	}
	return files;
}

/**
 * Loads the set of valid icon names (icons + aliases) for an installed
 * collection, or null if the package is not installed.
 * @param {string} collection
 * @returns {Set<string> | null}
 */
function loadCollectionNames(collection) {
	try {
		const jsonPath = require.resolve(`@iconify-json/${collection}/icons.json`);
		const data = JSON.parse(readFileSync(jsonPath, "utf8"));
		return new Set([
			...Object.keys(data.icons ?? {}),
			...Object.keys(data.aliases ?? {}),
		]);
	} catch {
		return null;
	}
}

/**
 * @returns {Record<string, string[]>} astro-icon `include` map, e.g.
 *   { "material-symbols": ["home", "search"], "mdi": ["github"] }
 */
export function buildIconInclude() {
	const collectionSet = new Set(INSTALLED_COLLECTIONS);
	const found = new Map(INSTALLED_COLLECTIONS.map((name) => [name, new Set()]));

	for (const file of walk(SCAN_DIR)) {
		const content = readFileSync(file, "utf8");
		for (const match of content.matchAll(ICON_REF_RE)) {
			const [, prefix, name] = match;
			if (collectionSet.has(prefix)) {
				found.get(prefix).add(name);
			}
		}
	}

	/** @type {Record<string, string[]>} */
	const include = {};
	for (const [collection, names] of found) {
		if (names.size === 0) {
			continue;
		}
		const valid = loadCollectionNames(collection);
		// Keep only names that actually exist in the collection; unknown names
		// (from comments, typos, or CDN-only icons) would fail the build.
		const usable = valid ? [...names].filter((n) => valid.has(n)) : [...names];
		if (usable.length > 0) {
			include[collection] = usable.sort();
		}
	}
	return include;
}
