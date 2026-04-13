import type {
  SiteConfig,
  NavLink,
  PageEntry,
  Section,
  FormField,
  FormConfig,
  DirectoryItem,
  DirectoryConfig,
} from "./types";

const VALID_SECTION_TYPES = [
  "hero",
  "features",
  "testimonials",
  "cta_banner",
  "text_block",
  "image_text",
  "form",
  "directory_header",
  "directory_item",
];

const REQUIRED_PROPS: Record<string, string[]> = {
  hero: ["title"],
  features: ["title"],
  testimonials: [],
  cta_banner: ["title", "button_text", "button_link"],
  text_block: ["title", "content"],
  image_text: ["title", "content", "image_url"],
  form: ["webhook_url", "submit_text"],
  directory_header: ["title"],
  directory_item: ["name", "bio"],
};

function warn(message: string): void {
  console.warn(`⚠ [SheetSite] ${message}`);
}

function getSpreadsheetId(): string {
  const id = import.meta.env.SPREADSHEET_ID;
  if (!id) {
    warn("SPREADSHEET_ID not set in .env");
    return "";
  }
  return id;
}

/**
 * Parse a CSV string into an array of row objects.
 * Handles quoted fields and escaped quotes ("").
 */
function parseCSV(csv: string): Record<string, string>[] {
  if (!csv.trim()) return [];

  const rows: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i];
    const next = csv[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        current.push(field.trim());
        field = "";
      } else if (ch === "\n" || (ch === "\r" && next === "\n")) {
        current.push(field.trim());
        field = "";
        rows.push(current);
        current = [];
        if (ch === "\r") i++;
      } else {
        field += ch;
      }
    }
  }

  if (field || current.length > 0) {
    current.push(field.trim());
    rows.push(current);
  }

  if (rows.length < 2) return [];

  const headers = rows[0];
  return rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((header, idx) => {
      obj[header] = row[idx] || "";
    });
    return obj;
  });
}

/**
 * Fetch a single tab as CSV from a public Google Sheet.
 */
async function fetchTabCSV(
  spreadsheetId: string,
  tabName: string
): Promise<string> {
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      warn(`Failed to fetch tab "${tabName}": HTTP ${response.status}`);
      return "";
    }
    return await response.text();
  } catch (error) {
    warn(
      `Failed to fetch tab "${tabName}": ${error instanceof Error ? error.message : String(error)}`
    );
    return "";
  }
}

/**
 * Fetch and parse a tab into an array of row objects.
 */
async function fetchTab(
  spreadsheetId: string,
  tabName: string
): Promise<Record<string, string>[]> {
  const csv = await fetchTabCSV(spreadsheetId, tabName);
  const rows = parseCSV(csv);
  if (rows.length === 0) {
    warn(`Tab "${tabName}" is empty, skipping`);
  }
  return rows;
}

/**
 * Get global site config from the _config tab.
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  const id = getSpreadsheetId();
  const rows = await fetchTab(id, "_config");

  const config: Record<string, string> = {};
  for (const row of rows) {
    if (row.key && row.value !== undefined) {
      config[row.key] = row.value;
    }
  }

  return {
    site_name: config.site_name || "SheetSite",
    site_description: config.site_description || "",
    nav_logo_url: config.nav_logo_url || undefined,
    footer_text: config.footer_text || "",
  };
}

/**
 * Get navigation links from the _nav tab.
 */
export async function getNavLinks(): Promise<NavLink[]> {
  const id = getSpreadsheetId();
  const rows = await fetchTab(id, "_nav");

  return rows
    .map((row) => ({
      label: row.label || "",
      href: row.href || "/",
      order: parseInt(row.order, 10) || 0,
    }))
    .sort((a, b) => a.order - b.order);
}

/**
 * Get page registry from the _pages tab.
 */
export async function getPages(): Promise<PageEntry[]> {
  const id = getSpreadsheetId();
  const rows = await fetchTab(id, "_pages");

  return rows.map((row) => {
    const template = row.template as PageEntry["template"];
    if (template !== "landing" && template !== "directory") {
      warn(
        `Page "${row.slug}": unknown template "${row.template}". Valid: landing, directory`
      );
    }
    return {
      slug: row.slug || "",
      title: row.title || "",
      meta_description: row.meta_description || "",
      template: template === "directory" ? "directory" : "landing",
    };
  });
}

/**
 * Get sections for a page by fetching the tab matching the slug.
 * Groups rows by section_order, collapses prop_key/prop_value into props.
 */
export async function getPageSections(slug: string): Promise<Section[]> {
  const id = getSpreadsheetId();
  const rows = await fetchTab(id, slug);

  const grouped = new Map<number, { type: string; props: Record<string, string> }>();

  for (const row of rows) {
    const order = parseInt(row.section_order, 10);
    if (isNaN(order)) continue;

    if (!grouped.has(order)) {
      grouped.set(order, { type: row.section_type || "", props: {} });
    }

    const group = grouped.get(order)!;
    if (row.prop_key) {
      group.props[row.prop_key] = row.prop_value || "";
    }
  }

  const sections: Section[] = Array.from(grouped.entries())
    .sort(([a], [b]) => a - b)
    .map(([order, data]) => ({
      order,
      type: data.type,
      props: data.props,
    }));

  validateSections(slug, sections);
  return sections;
}

/**
 * Validate sections and log warnings for issues.
 */
function validateSections(slug: string, sections: Section[]): void {
  for (const section of sections) {
    if (!VALID_SECTION_TYPES.includes(section.type)) {
      warn(
        `Page "${slug}" section ${section.order}: unknown type "${section.type}". Valid types: ${VALID_SECTION_TYPES.join(", ")}`
      );
      continue;
    }

    const required = REQUIRED_PROPS[section.type] || [];
    for (const prop of required) {
      if (!section.props[prop]) {
        warn(
          `Page "${slug}" ${section.type}: missing required prop "${prop}"`
        );
      }
    }
  }
}

/**
 * Parse form section props into a structured FormConfig.
 * Extracts field_N_* keys using regex.
 */
export function parseFormConfig(props: Record<string, string>): FormConfig {
  const fieldMap = new Map<
    number,
    Partial<FormField> & { name?: string }
  >();

  for (const [key, value] of Object.entries(props)) {
    const match = key.match(/^field_(\d+)_(.+)$/);
    if (!match) continue;

    const num = parseInt(match[1], 10);
    const fieldProp = match[2];

    if (!fieldMap.has(num)) {
      fieldMap.set(num, {});
    }
    const field = fieldMap.get(num)!;
    (field as Record<string, string>)[fieldProp] = value;
  }

  const sortedNums = Array.from(fieldMap.keys()).sort((a, b) => a - b);

  // Check for gaps
  for (let i = 0; i < sortedNums.length - 1; i++) {
    if (sortedNums[i + 1] - sortedNums[i] > 1) {
      warn(
        `Form: field numbering gap (field_${sortedNums[i]}, field_${sortedNums[i + 1]} — missing field_${sortedNums[i] + 1})`
      );
    }
  }

  const fields: FormField[] = sortedNums.map((num) => {
    const raw = fieldMap.get(num)! as Record<string, string>;
    return {
      name: raw.name || `field_${num}`,
      type: (raw.type as FormField["type"]) || "text",
      label: raw.label || raw.name || `Field ${num}`,
      required: raw.required === "true",
      pattern: raw.pattern || undefined,
      validation_message: raw.validation_message || undefined,
      options: raw.options || undefined,
    };
  });

  return {
    webhook_url: props.webhook_url || "",
    success_redirect: props.success_redirect || "/thank-you",
    submit_text: props.submit_text || "Submit",
    fields,
  };
}

/**
 * Parse directory sections into a structured DirectoryConfig.
 */
export function parseDirectoryConfig(sections: Section[]): DirectoryConfig {
  const header = sections.find((s) => s.type === "directory_header");
  const itemSections = sections.filter((s) => s.type === "directory_item");

  const items: DirectoryItem[] = itemSections.map((s) => ({
    name: s.props.name || "",
    role: s.props.role || "",
    specialty: s.props.specialty || undefined,
    image_url: s.props.image_url || undefined,
    bio: s.props.bio || "",
  }));

  return {
    title: header?.props.title || "Directory",
    filter_by: header?.props.filter_by || undefined,
    items,
  };
}

/**
 * Parse numbered item props (item_N_*) into an array of objects.
 * Used by Features and Testimonials components.
 */
export function parseNumberedItems(
  props: Record<string, string>,
  prefix: string = "item"
): Record<string, string>[] {
  const itemMap = new Map<number, Record<string, string>>();

  for (const [key, value] of Object.entries(props)) {
    const match = key.match(new RegExp(`^${prefix}_(\\d+)_(.+)$`));
    if (!match) continue;

    const num = parseInt(match[1], 10);
    const propName = match[2];

    if (!itemMap.has(num)) {
      itemMap.set(num, {});
    }
    itemMap.get(num)![propName] = value;
  }

  return Array.from(itemMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([, item]) => item);
}
