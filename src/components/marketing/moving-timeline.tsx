const timeline = [
  { title: "You get an estimate", description: "Online in minutes, or call us direct." },
  { title: "We confirm your booking", description: "By phone or SMS, with your date locked in." },
  { title: "Moving day", description: "The crew turns up on time with the right truck." },
  { title: "Job done", description: "We confirm everything's in and settle up on actual time." },
];

export function MovingTimeline() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">From booking to moving day</h2>
      </div>

      <div className="relative">
        <div
          className="bg-border absolute top-4 right-0 left-0 hidden h-px sm:block"
          aria-hidden="true"
        />
        <ol className="grid gap-8 sm:grid-cols-4">
          {timeline.map((step) => (
            <li key={step.title} className="relative flex flex-col items-center text-center">
              <span className="bg-primary relative z-10 mb-3 h-3 w-3 rounded-full" />
              <h3 className="text-foreground font-medium">{step.title}</h3>
              <p className="text-muted-foreground mt-1 text-sm">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
