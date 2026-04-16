declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
			components: import('astro').MDXInstance<{}>['components'];
		}>;
	}
}

declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"tutorials": {
"css-backgrounds.mdx": {
	id: "css-backgrounds.mdx";
  slug: "css-backgrounds";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"css-borders.mdx": {
	id: "css-borders.mdx";
  slug: "css-borders";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"css-box-model.mdx": {
	id: "css-box-model.mdx";
  slug: "css-box-model";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"css-colors.mdx": {
	id: "css-colors.mdx";
  slug: "css-colors";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"css-display.mdx": {
	id: "css-display.mdx";
  slug: "css-display";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"css-introduction.mdx": {
	id: "css-introduction.mdx";
  slug: "css-introduction";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"css-margins.mdx": {
	id: "css-margins.mdx";
  slug: "css-margins";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"css-padding.mdx": {
	id: "css-padding.mdx";
  slug: "css-padding";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"css-position.mdx": {
	id: "css-position.mdx";
  slug: "css-position";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"css-selectors.mdx": {
	id: "css-selectors.mdx";
  slug: "css-selectors";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"html-formatting.mdx": {
	id: "html-formatting.mdx";
  slug: "html-formatting";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"html-headings.mdx": {
	id: "html-headings.mdx";
  slug: "html-headings";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"html-images.mdx": {
	id: "html-images.mdx";
  slug: "html-images";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"html-introduction.mdx": {
	id: "html-introduction.mdx";
  slug: "html-introduction";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"html-links.mdx": {
	id: "html-links.mdx";
  slug: "html-links";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"html-lists.mdx": {
	id: "html-lists.mdx";
  slug: "html-lists";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"html-paragraphs.mdx": {
	id: "html-paragraphs.mdx";
  slug: "html-paragraphs";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"html-styles.mdx": {
	id: "html-styles.mdx";
  slug: "html-styles";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"html-tables.mdx": {
	id: "html-tables.mdx";
  slug: "html-tables";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"js-comments.mdx": {
	id: "js-comments.mdx";
  slug: "js-comments";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"js-datatypes.mdx": {
	id: "js-datatypes.mdx";
  slug: "js-datatypes";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"js-functions.mdx": {
	id: "js-functions.mdx";
  slug: "js-functions";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"js-introduction.mdx": {
	id: "js-introduction.mdx";
  slug: "js-introduction";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"js-operators.mdx": {
	id: "js-operators.mdx";
  slug: "js-operators";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"js-output.mdx": {
	id: "js-output.mdx";
  slug: "js-output";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"js-statements.mdx": {
	id: "js-statements.mdx";
  slug: "js-statements";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"js-syntax.mdx": {
	id: "js-syntax.mdx";
  slug: "js-syntax";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
"js-variables.mdx": {
	id: "js-variables.mdx";
  slug: "js-variables";
  body: string;
  collection: "tutorials";
  data: InferEntrySchema<"tutorials">
} & { render(): Render[".mdx"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("./../../src/content/config.js");
}
