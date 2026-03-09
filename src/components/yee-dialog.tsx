import { ReactNode } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import { cva } from "class-variance-authority";
import { useTheme } from "next-themes";

interface YeeDialogProps {
  variant?: "dark" | "light";
  asForm?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  showTitle?: boolean;
  trigger?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  contentClassName?: string;
}

const dialogVariants = cva(
  "sm:max-w-sm rounded-3xl drop-shadow-2xl backdrop-blur-md border text-md",
  {
    variants: {
      variant: {
        dark: "bg-black/40 text-white border-white/20",
        light: "bg-white/80! text-black border-0",
      },
    },
    defaultVariants: {
      variant: "dark",
    },
  },
);

const primaryButtonVariants = cva(
  "flex-1 h-10 py-2 rounded-full cursor-pointer",
  {
    variants: {
      variant: {
        dark: "bg-white/20 text-white hover:bg-white/40",
        light: "bg-primary text-white hover:bg-primary/80",
      },
    },
    defaultVariants: { variant: "dark" },
  },
);
const closeButtonVariants = cva(
  "flex-1 h-10 py-2 rounded-full cursor-pointer",
  {
    variants: {
      variant: {
        dark: "bg-white text-black hover:bg-white/80",
        light: "bg-black/5 text-black hover:bg-black/10",
      },
    },
    defaultVariants: { variant: "dark" },
  },
);

export function YeeDialog({
  variant,
  asForm = true,
  open,
  onOpenChange,
  title,
  showTitle = false,
  trigger,
  footer,
  children,
  contentClassName,
}: YeeDialogProps) {
  const { theme } = useTheme();
  const Wrapper = asForm ? "form" : React.Fragment;
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.document.documentElement.classList.contains("dark"));
  const themeVar = variant ? variant : isDark ? "dark" : "light";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Wrapper>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent
          className={cn(
            dialogVariants({ variant: themeVar as "dark" | "light" }),
            contentClassName,
          )}
          showCloseButton={false}
        >
          <DialogTitle className={cn("py-2", !showTitle ? "sr-only" : "")}>
            {title}
          </DialogTitle>
          {children}
          <DialogFooter className="px-4 bg-transparent border-t-0 flex items-center justify-between! gap-4">
            {footer}
          </DialogFooter>
        </DialogContent>
      </Wrapper>
    </Dialog>
  );
}

export function YeeDialogPrimaryButton({
  variant,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "dark" | "light";
}) {
  const { theme } = useTheme();
  // 当 theme 为 'system' 时，通过判断 html 标签是否有 'dark' class 来决定实际主题
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.document.documentElement.classList.contains("dark"));
  const themeVar = variant ? variant : isDark ? "dark" : "light";

  return (
    <Button
      className={cn(
        primaryButtonVariants({ variant: themeVar as "dark" | "light" }),
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
export function YeeDialogCloseButton({
  variant,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "dark" | "light";
}) {
  const { theme } = useTheme();
  // 当 theme 为 'system' 时，通过判断 html 标签是否有 'dark' class 来决定实际主题
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.document.documentElement.classList.contains("dark"));
  const themeVar = variant ? variant : isDark ? "dark" : "light";

  return (
    <DialogClose asChild>
      <Button
        className={cn(
          closeButtonVariants({ variant: themeVar as "dark" | "light" }),
          className,
        )}
        {...props}
      >
        {children}
      </Button>
    </DialogClose>
  );
}
