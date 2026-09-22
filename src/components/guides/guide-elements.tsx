/** Shared, lightly-styled building blocks for guide article bodies (no Tailwind typography plugin installed, so these are plain utility classes rather than `prose`). */

export function GuideH2({ children }: { children: React.ReactNode }) {
  return <h2 className="font-heading mt-10 text-xl font-medium">{children}</h2>;
}

export function GuideP({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground mt-3 leading-relaxed">{children}</p>;
}

export function GuideList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mt-3 list-disc space-y-1.5 pl-5">
      {items.map((item, index) => (
        <li key={index} className="text-muted-foreground leading-relaxed">
          {item}
        </li>
      ))}
    </ul>
  );
}
