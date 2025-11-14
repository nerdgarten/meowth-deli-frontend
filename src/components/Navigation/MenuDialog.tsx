import { useMutation } from "@tanstack/react-query";
import { Button } from "@ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/dialog";
import toast from "react-hot-toast";

import { logoutFunctionMutation } from "@/queries/logout";

interface MenuDialogProps {
  isMenuDialogOpen: boolean;
  setIsMenuDialogOpen: (open: boolean) => void;
}

export const MenuDialog = ({
  isMenuDialogOpen,
  setIsMenuDialogOpen,
}: MenuDialogProps) => {
  const logoutMutation = useMutation({
    mutationFn: logoutFunctionMutation,
    onSuccess: () => {
      toast.success("Logged Out");
      setIsMenuDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to logout. Please try again.");
    },
  });

  return (
    <Dialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen}>
      <DialogContent className="bg-app-white p-8">
        <DialogHeader>
          <DialogTitle className="text-app-dark-brown text-3xl font-semibold">
            Menu
          </DialogTitle>
        </DialogHeader>
        <Button
          className="text-black hover:bg-gray-200 active:scale-95 active:bg-gray-300"
          onClick={() => logoutMutation.mutate()}
        >
          Logout
        </Button>
      </DialogContent>
    </Dialog>
  );
};
