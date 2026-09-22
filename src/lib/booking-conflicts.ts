/**
 * Double-booking prevention (CLAUDE.md section 10: "assign truck and crew,
 * double-booking prevention"). The schema tracks a move as a single date
 * plus a coarse preferred time-of-day, not a precise time window, so
 * "double-booked" here means "the same truck or crew member is already on
 * another active booking that same calendar day" - the finest granularity
 * the data actually supports. Kept pure and dependency-free so it can be
 * unit tested without a database; src/app/admin/(protected)/leads/[id]/actions.ts
 * wraps it with the actual Prisma queries.
 */
export interface ExistingBookingRef {
  id: string;
  /** Calendar date the move is on, as YYYY-MM-DD (local/business timezone already applied). */
  dateISO: string;
  truckId: string | null;
  crewMemberIds: string[];
}

export interface BookingCandidate {
  dateISO: string;
  truckId: string | null;
  crewMemberIds: string[];
  /** Exclude this booking id from the conflict check, for editing an existing booking. */
  excludeBookingId?: string;
}

export interface BookingConflictResult {
  truckConflict: boolean;
  crewConflictIds: string[];
  hasConflict: boolean;
}

export function findBookingConflicts(
  existing: ExistingBookingRef[],
  candidate: BookingCandidate,
): BookingConflictResult {
  const sameDay = existing.filter(
    (booking) => booking.dateISO === candidate.dateISO && booking.id !== candidate.excludeBookingId,
  );

  const truckConflict =
    candidate.truckId != null && sameDay.some((booking) => booking.truckId === candidate.truckId);

  const crewConflictIds = candidate.crewMemberIds.filter((crewMemberId) =>
    sameDay.some((booking) => booking.crewMemberIds.includes(crewMemberId)),
  );

  return {
    truckConflict,
    crewConflictIds,
    hasConflict: truckConflict || crewConflictIds.length > 0,
  };
}
