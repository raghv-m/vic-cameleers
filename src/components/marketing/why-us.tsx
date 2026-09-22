const differentiators = [
  {
    title: "Real crew, real trucks",
    description: "Local movers based in Cranbourne, not a subcontractor lottery.",
  },
  {
    title: "Transparent pricing",
    description: "One hourly rate, shown up front, with the maths behind every estimate.",
  },
  {
    title: "Victoria only",
    description: "We know Melbourne. No interstate jobs, no long-haul guesswork.",
  },
];

export function WhyUs() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Why Vic Cameleers</h2>
          <p className="text-muted-foreground mt-4">
            In 1860, camels and cameleers landed at Port Melbourne to carry supplies for the Burke
            and Wills expedition, and spent decades hauling goods across the country through tough
            conditions. Vic Cameleers carries that same reliability into modern Melbourne moves.
          </p>
        </div>

        <dl className="grid gap-6 sm:grid-cols-1">
          {differentiators.map((item) => (
            <div key={item.title}>
              <dt className="text-foreground font-medium">{item.title}</dt>
              <dd className="text-muted-foreground mt-1 text-sm">{item.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
