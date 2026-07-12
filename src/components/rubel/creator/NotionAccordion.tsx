"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { RubelMotionButton } from "@/components/rubel/RubelMotionButton";

interface NotionAccordionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

const NotionAccordion = ({
  title,
  subtitle,
  children,
  defaultOpen = false,
}: NotionAccordionProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50">
      <RubelMotionButton
        variant="ghost"
        fullWidth
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex min-h-12 items-center justify-between rounded-none px-4 py-3 text-left"
      >
        <span>
          <span className="block text-sm font-semibold text-slate-200">{title}</span>
          {subtitle ? (
            <span className="mt-0.5 block text-xs text-slate-500">{subtitle}</span>
          ) : null}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-slate-500 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </RubelMotionButton>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-800 px-4 py-4">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export { NotionAccordion };
