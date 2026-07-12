"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface RubelMotionButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "option";
  fullWidth?: boolean;
}

const RubelMotionButton = ({
  variant = "primary",
  fullWidth = false,
  className,
  children,
  ...props
}: RubelMotionButtonProps) => {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={cn(
        "min-h-[3.25rem] rounded-xl px-5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
        fullWidth && "w-full",
        variant === "primary" &&
          "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-400",
        variant === "secondary" &&
          "border border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800",
        variant === "ghost" &&
          "bg-transparent text-slate-500 hover:bg-slate-900 hover:text-slate-200",
        variant === "option" &&
          "border border-slate-800 bg-slate-900 py-4 text-left text-slate-200 shadow-inner hover:border-indigo-500/40 hover:bg-slate-800",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export { RubelMotionButton };
