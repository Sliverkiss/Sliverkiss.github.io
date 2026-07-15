/**
 * Escapes numeric ratios before `remark-directive` parses Markdown.
 *
 * `remark-directive` treats `:4` in text such as `3:4` as a text directive,
 * including inside image alt text. Markdown renders an escaped colon normally,
 * so this preserves the author's source text while preventing that ambiguity.
 */
export function escapeNumericColons(source) {
	return source
		.split(/(`{3,}[\s\S]*?`{3,}|~{3,}[\s\S]*?~{3,}|`+[^`\n]*`+)/g)
		.map((segment, index) =>
			index % 2 === 0 ? segment.replace(/(?<=\d):(?=\d)/g, "\\:") : segment,
		)
		.join("");
}

/** @this {import('unified').Processor} */
export function remarkEscapeNumericColons() {
	const parser = this.parser;

	if (typeof parser !== "function") {
		throw new TypeError(
			"remarkEscapeNumericColons must run after Markdown parsing is configured.",
		);
	}

	this.parser = function parseWithEscapedNumericColons(source) {
		return parser(escapeNumericColons(String(source)));
	};
}
