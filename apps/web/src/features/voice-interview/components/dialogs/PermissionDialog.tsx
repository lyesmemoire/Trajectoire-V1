import React, { memo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/Dialog";
import { Button } from "../ui/Button";
import { usePermissions } from "../../hooks";
import { Mic } from "lucide-react";

export const PermissionDialog = memo(function PermissionDialog() {
  const { permission, requestMicrophoneAccess } = usePermissions();
  
  // We show the dialog if permission is denied, to explain why we need it
  const isOpen = permission === "denied";

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center mb-6">
            <Mic className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl font-light text-text-primary">
            Accès au microphone
          </DialogTitle>
          <DialogDescription className="text-center text-lg font-light text-text-secondary mt-4 leading-relaxed">
            Trajectoire a besoin d'accéder à votre microphone uniquement pendant cet entretien.
            <br /><br />
            Aucun enregistrement n'est conservé sans votre accord.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center mt-8">
          <Button onClick={requestMicrophoneAccess} className="w-full sm:w-auto text-lg px-8 py-4 h-auto rounded-button">
            Autoriser le microphone
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
