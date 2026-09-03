"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, MessageCircle, Phone, X, Plus } from "lucide-react";
import { telHref, whatsappHref } from "@/lib/utils";

/* ============================================================================
   QUICK ACTIONS

   A small dock that appears once the visitor is past the hero. On a site where
   the most valuable action is a phone call from someone standing next to a
   broken machine, the call target should never be more than a thumb away.
   ========================================================================= */

export function QuickActions({ phone, whatsapp }: { phone: string; whatsapp: string }) {
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-2.5 sm:bottom-7 sm:right-6"
        >
          <AnimatePresence>
            {open && (
              <>
                <ActionButton
                  key="top"
                  label="Back to top"
                  delay={0.12}
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  <ArrowUp className="size-5" />
                </ActionButton>
                <ActionButton
                  key="whatsapp"
                  label="WhatsApp us"
                  delay={0.06}
                  href={whatsappHref(whatsapp, "Good day, I would like to enquire about plant hire.")}
                  external
                >
                  <MessageCircle className="size-5" />
                </ActionButton>
                <ActionButton key="call" label="Call the 24-hour line" delay={0} href={telHref(phone)}>
                  <Phone className="size-5" />
                </ActionButton>
              </>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close quick actions" : "Open quick actions"}
            className="chamfer-sm inline-flex size-13 items-center justify-center bg-gold-500 text-ink-950 shadow-xl shadow-black/40 transition-colors hover:bg-gold-400"
          >
            <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.25 }}>
              {open ? <X className="size-6" /> : <Plus className="size-6" />}
            </motion.span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ActionButton({
  children,
  label,
  href,
  onClick,
  external,
  delay = 0,
}: {
  children: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  external?: boolean;
  delay?: number;
}) {
  const className =
    "chamfer-sm group inline-flex size-12 items-center justify-center border border-steel-600/25 bg-ink-900/95 text-paper-50 shadow-lg shadow-black/40 backdrop-blur transition-colors hover:border-gold-500/60 hover:text-gold-400";

  const inner = (
    <motion.span
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      transition={{ duration: 0.22, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-center"
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <a
        href={href}
        aria-label={label}
        title={label}
        className={className}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className={className}>
      {inner}
    </button>
  );
}
