"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const getVariants = (path: string | null) => {
    switch (path) {
      case "/search":
        return {
          initial: { x: 30, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: -30, opacity: 0 },
        };
      case "/my-list":
        return {
          initial: { x: -30, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: 30, opacity: 0 },
        };
      case "/stats":
        return {
          initial: { y: 20, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: -20, opacity: 0 },
        };
      case "/social":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
      case "/ai":
        return {
          initial: { scale: 0.95, rotate: 2, opacity: 0 },
          animate: { scale: 1, rotate: 0, opacity: 1 },
          exit: { scale: 0.95, rotate: -2, opacity: 0 },
        };
      case "/calendar":
        return {
          initial: { y: 20, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: -20, opacity: 0 },
        };
      default:
        return {
          initial: { scale: 0.98, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.98, opacity: 0 },
        };
    }
  };

  const variants = getVariants(pathname);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
