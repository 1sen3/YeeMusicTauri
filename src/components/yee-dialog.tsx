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

interface YeeDialogProps {
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

export function YeeDialog({
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
  const Wrapper = asForm ? "form" : React.Fragment;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Wrapper>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent
          className={cn(
            "sm:max-w-sm rounded-3xl drop-shadow-2xl backdrop-blur-md border text-md select-none bg-card/80 text-foreground",
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
  return (
    <Button
      className={cn(
        "flex-1 h-10 py-2 rounded-full cursor-pointer bg-primary text-white hover:bg-primary/80",
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
  return (
    <DialogClose asChild>
      <Button
        className={cn(
          "flex-1 h-10 py-2 rounded-full cursor-pointer bg-muted text-foreground hover:bg-muted/80",
          className,
        )}
        {...props}
      >
        {children}
      </Button>
    </DialogClose>
  );
}
