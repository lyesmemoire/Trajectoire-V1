import React, { memo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/Dialog";
import { useConnection } from "../../hooks";
import { Loader2 } from "lucide-react";

export const ErrorDialog = memo(function ErrorDialog() {
  const { error } = useConnection();
  
  const isOpen = error !== null && !error.recoverable;

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md border-none bg-surface/90 shadow-floating backdrop-blur-md">
        <DialogHeader className="space-y-6 pt-4">
          <div className="mx-auto w-12 h-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-text-muted animate-spin" />
          </div>
          <DialogTitle className="text-center text-xl font-normal text-text-primary">
            Nous rencontrons momentanément une difficulté.
          </DialogTitle>
          <DialogDescription className="text-center text-text-secondary font-light text-lg">
            Nous reprenons dans quelques instants.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
});
