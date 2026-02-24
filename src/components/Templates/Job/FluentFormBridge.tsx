"use client";

import { useEffect } from "react";

type Props = {
  containerId: string;
  endpoint?: string;
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
}: Props) {
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const forms = Array.from(container.querySelectorAll("form"));

    forms.forEach((formEl) => {
      const form = formEl as HTMLFormElement;
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
  }, [containerId, endpoint]);

  return null;
}
