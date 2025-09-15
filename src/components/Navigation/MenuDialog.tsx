import { Button } from "@ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/dialog";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

interface MenuDialogProps {
  isMenuDialogOpen: boolean;
  setIsMenuDialogOpen: (open: boolean) => void;
}

export const MenuDialog = ({
  isMenuDialogOpen,
  setIsMenuDialogOpen,
}: MenuDialogProps) => {
  function handleLogout() {
    Cookies.remove("token");
    toast.success("Logged Out");
    setIsMenuDialogOpen(false);
  }

  return (
    <Dialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen}>
      <DialogContent className="bg-app-white p-8">
        <DialogHeader>
          <DialogTitle className="text-app-dark-brown text-3xl font-semibold">
            Menu
          </DialogTitle>
        </DialogHeader>
        <Button onClick={handleLogout}>Logout</Button>
      </DialogContent>
    </Dialog>
  );
};
