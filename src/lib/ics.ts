/** Builds a minimal .ics file for a move date and triggers a download. */
export function downloadMoveDateIcs(options: {
  moveDate: string;
  referenceNumber: string;
  summary: string;
}) {
  const date = options.moveDate.replaceAll("-", "");
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0];

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Vic Cameleers//Quote//EN",
    "BEGIN:VEVENT",
    `UID:${options.referenceNumber}@viccameleers`,
    `DTSTAMP:${now}Z`,
    `DTSTART;VALUE=DATE:${date}`,
    `SUMMARY:${options.summary}`,
    `DESCRIPTION:Reference ${options.referenceNumber}. We'll confirm the exact time by phone or SMS.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `vic-cameleers-${options.referenceNumber}.ics`;
  link.click();
  URL.revokeObjectURL(url);
}
