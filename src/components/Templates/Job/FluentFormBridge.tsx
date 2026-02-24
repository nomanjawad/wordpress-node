"use client";

import { useEffect } from "react";

type Props = {
  containerId: string;
  endpoint?: string;
  enabled?: boolean;
};

const extractFormId = (form: HTMLFormElement) => {
  const existing = form.querySelector<HTMLInputElement>('input[name="form_id"]');
  if (existing?.value) return existing.value;

  const idFromAttr = form.id?.match(/(\d+)/)?.[1];
  if (idFromAttr) return idFromAttr;

  return "";
};

export default function FluentFormBridge({
  containerId,
  endpoint = "/api/forms/fluent-submit",
  enabled = true,
}: Props) {
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const forms = Array.from(container.querySelectorAll("form"));
    const cleanups: Array<() => void> = [];

    forms.forEach((formEl) => {
      const form = formEl as HTMLFormElement;

      if (!enabled) {
        const handleDisabledSubmit = (event: Event) => {
          event.preventDefault();
        };

        form.addEventListener("submit", handleDisabledSubmit);
        cleanups.push(() => form.removeEventListener("submit", handleDisabledSubmit));
        return;
      }

      form.method = "POST";
      form.action = endpoint;
      form.enctype = "multipart/form-data";

      const formId = extractFormId(form);
      if (formId && !form.querySelector('input[name="form_id"]')) {
        const hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = "form_id";
        hidden.value = formId;
        form.appendChild(hidden);
      }
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [containerId, endpoint, enabled]);

  return null;
}
