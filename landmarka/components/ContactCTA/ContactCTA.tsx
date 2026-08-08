"use client";

import { useState } from "react";

export function ContactCTA() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="relative bg-ink-soft px-6 md:px-14 py-24 md:py-32">
      <div className="max-w-2xl mx-auto text-center">
        <span className="text-xs tracking-[0.3em] uppercase text-cream/50">Заявка на просмотр</span>
        <h2 className="font-display text-cream text-4xl md:text-6xl mt-4 mb-10">
          Увидеть дом вживую
        </h2>
        {submitted ? (
          <p className="text-cream/80">Спасибо! Мы свяжемся с вами в ближайшее время.</p>
        ) : (
          <form
            className="flex flex-col sm:flex-row gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            <input
              type="text"
              required
              placeholder="Ваше имя"
              className="min-w-0 flex-1 bg-transparent border border-cream/25 rounded-full px-5 py-3 text-cream placeholder:text-cream/40 focus:outline-none focus:border-accent"
            />
            <input
              type="tel"
              required
              placeholder="Телефон"
              className="min-w-0 flex-1 bg-transparent border border-cream/25 rounded-full px-5 py-3 text-cream placeholder:text-cream/40 focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="bg-accent text-ink font-medium rounded-full px-7 py-3 hover:brightness-110 transition"
            >
              Отправить
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
