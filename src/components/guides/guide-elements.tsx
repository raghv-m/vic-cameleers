/**
 * Building blocks for guide bodies. Styling comes from the `.prose-vc` wrapper on the article
 * (src/app/globals.css), so these stay plain elements. Each h2 gets an id from its text, which
 * the article's "In this guide" list links to.
 */

export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/&[a-z]+;|['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  return "";
}

export function GuideH2({ children }: { children: React.ReactNode }) {
  return <h2 id={headingId(textOf(children))}>{children}</h2>;
}

export function GuideP({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}

export function GuideList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
