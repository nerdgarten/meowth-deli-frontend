import { DialogDescription } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/dialog";

interface LoadingDialogProps {
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
}

export const LoginDialog = ({
  isProfileOpen,
  setIsProfileOpen,
}: LoadingDialogProps) => {
  return (
    <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
      <DialogContent className="p-8">
        <DialogHeader>
          <DialogTitle className="text-app-dark-brown text-2xl font-semibold">
            Feeling Hungry?
          </DialogTitle>
          <DialogDescription className="text-app-dark-brown text-lg">
            Just <span className="text-app-yellow">login</span> as ...
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
