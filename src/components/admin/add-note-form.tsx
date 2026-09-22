"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { addLeadNote } from "@/app/admin/(protected)/leads/[id]/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function AddNoteForm({ leadId }: { leadId: string }) {
  const [pending, startTransition] = useTransition();
  const [body, setBody] = useState("");

  function submit() {
    if (!body.trim()) return;
    startTransition(async () => {
      const result = await addLeadNote({ leadId, body });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setBody("");
    });
  }

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Add a note..."
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={3}
      />
      <Button size="sm" disabled={pending || !body.trim()} onClick={submit}>
        {pending ? "Adding..." : "Add note"}
      </Button>
    </div>
  );
}
