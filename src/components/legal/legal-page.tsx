export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
      <p className="text-muted-foreground mt-2 text-sm">Last updated {updated}</p>

      <div className="prose-legal text-foreground [&_h2]:font-heading [&_p]:text-muted-foreground [&_ul]:text-muted-foreground mt-10 space-y-6 text-sm leading-relaxed [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-medium [&_h2]:tracking-tight [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </div>
  );
}
