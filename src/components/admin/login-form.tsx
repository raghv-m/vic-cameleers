"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { authClient } from "@/lib/auth-client";
import { useAdminRoot } from "@/lib/use-admin-root";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  backupCodeSchema,
  loginCredentialsSchema,
  totpCodeSchema,
  type BackupCode,
  type LoginCredentials,
  type TotpCode,
} from "@/lib/validation/auth";

export function LoginForm() {
  const router = useRouter();
  const adminRoot = useAdminRoot();
  const [step, setStep] = useState<"credentials" | "totp" | "backup-code">("credentials");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const credentialsForm = useForm<LoginCredentials>({
    resolver: zodResolver(loginCredentialsSchema),
    defaultValues: { email: "", password: "" },
  });

  const totpForm = useForm<TotpCode>({
    resolver: zodResolver(totpCodeSchema),
    defaultValues: { code: "", trustDevice: false },
  });

  const backupCodeForm = useForm<BackupCode>({
    resolver: zodResolver(backupCodeSchema),
    defaultValues: { code: "" },
  });

  async function onSubmitCredentials(values: LoginCredentials) {
    setSubmitting(true);
    setFormError(null);

    const { data, error } = await authClient.signIn.email(values);

    if (error) {
      setFormError(error.message ?? "Couldn't sign in. Check your email and password.");
      setSubmitting(false);
      return;
    }

    if (data && "twoFactorRedirect" in data && data.twoFactorRedirect) {
      setStep("totp");
      setSubmitting(false);
      return;
    }

    router.push(adminRoot);
  }

  async function onSubmitTotp(values: TotpCode) {
    setSubmitting(true);
    setFormError(null);

    const { error } = await authClient.twoFactor.verifyTotp(values);

    if (error) {
      setFormError(error.message ?? "That code didn't work. Try again.");
      setSubmitting(false);
      return;
    }

    router.push(adminRoot);
  }

  async function onSubmitBackupCode(values: BackupCode) {
    setSubmitting(true);
    setFormError(null);

    const { error } = await authClient.twoFactor.verifyBackupCode(values);

    if (error) {
      setFormError(error.message ?? "That backup code didn't work.");
      setSubmitting(false);
      return;
    }

    router.push(adminRoot);
  }

  if (step === "totp") {
    return (
      <form onSubmit={totpForm.handleSubmit(onSubmitTotp)} className="space-y-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="code">6-digit code</FieldLabel>
            <Input
              id="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              {...totpForm.register("code")}
            />
            <FieldError errors={[totpForm.formState.errors.code]} />
          </Field>

          <Field orientation="horizontal">
            <Checkbox
              id="trustDevice"
              onCheckedChange={(checked) => totpForm.setValue("trustDevice", checked === true)}
            />
            <FieldLabel htmlFor="trustDevice">Trust this device for 30 days</FieldLabel>
          </Field>

          {formError && <p className="text-destructive text-sm">{formError}</p>}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Verifying..." : "Verify"}
          </Button>

          <button
            type="button"
            className="text-muted-foreground text-sm hover:underline"
            onClick={() => {
              setFormError(null);
              setStep("backup-code");
            }}
          >
            Use a backup code instead
          </button>
        </FieldGroup>
      </form>
    );
  }

  if (step === "backup-code") {
    return (
      <form onSubmit={backupCodeForm.handleSubmit(onSubmitBackupCode)} className="space-y-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="backup-code">Backup code</FieldLabel>
            <Input id="backup-code" autoFocus {...backupCodeForm.register("code")} />
            <FieldError errors={[backupCodeForm.formState.errors.code]} />
          </Field>

          {formError && <p className="text-destructive text-sm">{formError}</p>}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Verifying..." : "Verify"}
          </Button>

          <button
            type="button"
            className="text-muted-foreground text-sm hover:underline"
            onClick={() => {
              setFormError(null);
              setStep("totp");
            }}
          >
            Back to authenticator code
          </button>
        </FieldGroup>
      </form>
    );
  }

  return (
    <form onSubmit={credentialsForm.handleSubmit(onSubmitCredentials)} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            {...credentialsForm.register("email")}
          />
          <FieldError errors={[credentialsForm.formState.errors.email]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...credentialsForm.register("password")}
          />
          <FieldError errors={[credentialsForm.formState.errors.password]} />
        </Field>

        {formError && <p className="text-destructive text-sm">{formError}</p>}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Signing in..." : "Sign in"}
        </Button>
      </FieldGroup>
    </form>
  );
}
