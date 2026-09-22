"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { addManualReview } from "@/app/admin/(protected)/reviews/actions";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function AddManualReviewForm() {
  const [pending, startTransition] = useTransition();
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState("5");
  const [body, setBody] = useState("");

  function submit() {
    startTransition(async () => {
      const result = await addManualReview({ authorName, rating, body });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setAuthorName("");
      setBody("");
      toast.success("Review added");
    });
  }

  return (
    <FieldGroup className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <Field className="w-48">
          <FieldLabel htmlFor="review-author">Reviewer name</FieldLabel>
          <Input
            id="review-author"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />
        </Field>
        <Field className="w-28">
          <FieldLabel htmlFor="review-rating">Rating</FieldLabel>
          <Select value={rating} onValueChange={(v) => v && setRating(v)}>
            <SelectTrigger id="review-rating">
              <SelectValue placeholder="Rating">{(value: string) => `${value} stars`}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {[5, 4, 3, 2, 1].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} stars
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
      <Field>
        <FieldLabel htmlFor="review-body">Review text</FieldLabel>
        <Textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
        />
      </Field>
      <Button size="sm" disabled={pending || !authorName.trim() || !body.trim()} onClick={submit}>
        {pending ? "Adding..." : "Add review"}
      </Button>
    </FieldGroup>
  );
}
