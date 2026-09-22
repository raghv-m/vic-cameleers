"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import QRCode from "qrcode";

import { authClient } from "@/lib/auth-client";
import { useAdminRoot } from "@/lib/use-admin-root";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  twoFactorConfirmSchema,
  twoFactorPasswordSchema,
  type TwoFactorConfirm,
  type TwoFactorPassword,
} from "@/lib/validation/two-factor-setup";

function secretFromTotpUri(totpURI: string): string | null {
  try {
    return new URL(totpURI).searchParams.get("secret");
  } catch {
    return null;
  }
}

export function Setup2FAForm() {
  const router = useRouter();
  const adminRoot = useAdminRoot();
  const [step, setStep] = useState<"password" | "scan">("password");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const passwordForm = useForm<TwoFactorPassword>({
    resolver: zodResolver(twoFactorPasswordSchema),
    defaultValues: { password: "" },
  });

  const confirmForm = useForm<TwoFactorConfirm>({
    resolver: zodResolver(twoFactorConfirmSchema),
    defaultValues: { code: "" },
  });

  async function onSubmitPassword(values: TwoFactorPassword) {
    setSubmitting(true);
    setFormError(null);

    const { data, error } = await authClient.twoFactor.enable({
      password: values.password,
      method: "totp",
    });

    if (error || !data || data.method !== "totp") {
      setFormError(error?.message ?? "Couldn't start 2FA setup. Check your password.");
      setSubmitting(false);
      return;
    }

    setBackupCodes(data.backupCodes);
    setSecret(secretFromTotpUri(data.totpURI));
    setQrDataUrl(await QRCode.toDataURL(data.totpURI));
    setStep("scan");
    setSubmitting(false);
  }

  async function onSubmitConfirm(values: TwoFactorConfirm) {
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

  if (step === "scan") {
    return (
      <form onSubmit={confirmForm.handleSubmit(onSubmitConfirm)} className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm">
            Scan this with your authenticator app (Google Authenticator, 1Password, Authy, ...).
          </p>
          {qrDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- data: URL generated client-side, next/image can't optimize it
            <img src={qrDataUrl} alt="TOTP QR code" className="size-48 rounded-md border" />
          )}
          {secret && (
            <p className="text-muted-foreground text-xs break-all">
              Can&apos;t scan? Enter this setup key manually: <code>{secret}</code>
            </p>
          )}
        </div>

        <div className="bg-muted space-y-2 rounded-md border p-3">
          <p className="text-sm font-medium">Backup codes</p>
          <p className="text-muted-foreground text-xs">
            Save these somewhere safe. Each one works once, if you lose access to your authenticator
            app.
          </p>
          <ul className="grid grid-cols-2 gap-1 font-mono text-sm">
            {backupCodes.map((code) => (
              <li key={code}>{code}</li>
            ))}
          </ul>
        </div>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="confirm-code">Enter the 6-digit code to confirm</FieldLabel>
            <Input
              id="confirm-code"
              inputMode="numeric"
              autoFocus
              {...confirmForm.register("code")}
            />
            <FieldError errors={[confirmForm.formState.errors.code]} />
          </Field>

          {formError && <p className="text-destructive text-sm">{formError}</p>}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Confirming..." : "Confirm and finish setup"}
          </Button>
        </FieldGroup>
      </form>
    );
  }

  return (
    <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-6">
      <p className="text-muted-foreground text-sm">
        Two-factor authentication is mandatory for all staff accounts. Confirm your password to
        start setup.
      </p>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="setup-password">Password</FieldLabel>
          <Input
            id="setup-password"
            type="password"
            autoComplete="current-password"
            autoFocus
            {...passwordForm.register("password")}
          />
          <FieldError errors={[passwordForm.formState.errors.password]} />
        </Field>

        {formError && <p className="text-destructive text-sm">{formError}</p>}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Starting setup..." : "Start setup"}
        </Button>
      </FieldGroup>
    </form>
  );
}
