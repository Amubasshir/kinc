"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { sendContactMessage, type ContactFormState } from "@/app/actions/contact";

const initialState: ContactFormState = { status: "idle" };

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(sendContactMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const syncFormValidity = () => {
    setIsFormValid(Boolean(formRef.current?.checkValidity()));
  };

  useEffect(() => {
    syncFormValidity();
  }, [state.status]);

  const autoGrow = (event: FormEvent<HTMLTextAreaElement>) => {
    const textarea = event.currentTarget;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <form
      key={state.status === "success" ? "sent" : "form"}
      action={formAction}
      ref={formRef}
      onInput={syncFormValidity}
      onChange={syncFormValidity}
      className="contact-form mt-8 grid grid-cols-2 gap-6 max-[700px]:mt-6 max-[700px]:grid-cols-1 max-[700px]:gap-[30px]"
    >
      <div className="contact-field">
        <label htmlFor="contact-name">
          FULL NAME <span>*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          placeholder="Sammy Gordon"
          autoComplete="name"
          required
        />
      </div>
      <div className="contact-field">
        <label htmlFor="contact-email">
          EMAIL <span>*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          placeholder="yourname@email.com"
          autoComplete="email"
          required
        />
      </div>
      <div className="contact-field contact-message">
        <label htmlFor="contact-message">
          MESSAGE <span>*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          placeholder="Tell us about your project or question..."
          rows={2}
          onInput={autoGrow}
          required
        />
      </div>
      <button className="button-primary" type="submit" disabled={isPending || !isFormValid}>
        {isPending ? "Sending…" : "Send"}
      </button>
      {state.status !== "idle" && (
        <p
          role="status"
          className={`col-span-2 max-[700px]:col-span-1 ${
            state.status === "success" ? "text-[#008861]" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
