const steps = [
  {
    title: "Tell us about your move",
    description: "A few details on what's moving and where, takes a couple of minutes.",
  },
  {
    title: "Get your estimate",
    description: "See a real price range straight away, based on your actual job.",
  },
  {
    title: "Pick your date",
    description: "Choose a date and time that works, we'll confirm by phone or SMS.",
  },
  {
    title: "We move you",
    description: "Our crew turns up on time with the right truck and gets it done.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>
      </div>

      <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.title} className="flex flex-col gap-2">
            <span className="font-heading text-primary text-2xl">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-foreground font-medium">{step.title}</h3>
            <p className="text-muted-foreground text-sm">{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
