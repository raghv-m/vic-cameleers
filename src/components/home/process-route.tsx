import { business } from "@/config/business";

/**
 * How a move works, drawn as four stops on one route. The connecting line draws in as the section
 * scrolls into view (CSS scroll-driven, see .vc-route-draw); without support it's simply drawn.
 * Every step describes what actually happens, including the emails the system really sends.
 */
const STOPS = [
  {
    title: "Tell us what's moving",
    detail:
      "Get an estimate online in a couple of minutes, or call us. Tell us about stairs, lifts and parking so the range is right.",
    meta: "You get a reference number",
  },
  {
    title: "We plan the move",
    detail:
      "We confirm the date, the truck and the crew by phone or SMS, then send a booking confirmation, and reminders 7 days and 1 day out.",
    meta: "Truck and crew assigned",
  },
  {
    title: "The crew loads and drives",
    detail:
      "Furniture gets blankets and straps. Beds and flat-pack come apart if you've asked. You pay for the time the job actually takes.",
    meta: `${business.hourlyRateShort}, ${business.minimumHours} hr minimum`,
  },
  {
    title: "Unloaded where you want it",
    detail:
      "Boxes go into the rooms they're labelled for and furniture is placed, not dumped by the door. Then we settle up on actual time.",
    meta: "Settled on actual time",
  },
];

export function ProcessRoute() {
  return (
    <ol className="relative grid gap-10 md:grid-cols-4 md:gap-6">
      {/* horizontal route on desktop */}
      <svg
        aria-hidden="true"
        className="text-kraft-400 absolute top-[22px] left-[22px] hidden h-2 w-[calc(100%-44px)] md:block"
        viewBox="0 0 100 2"
        preserveAspectRatio="none"
        fill="none"
      >
        <line
          x1="0"
          y1="1"
          x2="100"
          y2="1"
          pathLength={1}
          stroke="currentColor"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
          className="vc-route-draw"
        />
      </svg>
      {/* vertical route on phones */}
      <svg
        aria-hidden="true"
        className="text-kraft-400 absolute top-[22px] bottom-[22px] left-[21px] w-2 md:hidden"
        viewBox="0 0 2 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <line
          x1="1"
          y1="0"
          x2="1"
          y2="100"
          pathLength={1}
          stroke="currentColor"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
          className="vc-route-draw"
        />
      </svg>

      {STOPS.map((stop, index) => (
        <li
          key={stop.title}
          className="relative grid grid-cols-[44px_1fr] gap-4 md:grid-cols-1 md:gap-5"
        >
          <span
            aria-hidden="true"
            className="font-stencil border-navy-900 bg-sand-50 text-navy-900 relative z-10 grid size-11 place-items-center rounded-full border-2 text-xl leading-none"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="vc-reveal">
            <h3 className="text-navy-900 text-xl font-bold">
              <span className="sr-only">Step {index + 1}: </span>
              {stop.title}
            </h3>
            <p className="text-muted-600 mt-2 text-[0.9375rem] leading-relaxed">{stop.detail}</p>
            <p className="manifest-index text-terracotta-600 mt-3">{stop.meta}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
