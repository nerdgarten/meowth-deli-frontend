import { DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogHeader } from "@ui/dialog";
import { useState } from "react";

interface PDPADialogProps {
  isPDPADialogOpen: boolean;
  setIsPDPADialogOpen: (open: boolean) => void;
}

export const PDPADialogButton = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isPDPADialogOpen, setIsPDPADialogOpen] = useState<boolean>(false);
  return (
    <>
      <button
        className="p-0 underline"
        onClick={() => setIsPDPADialogOpen(true)}
      >
        {children}
      </button>
      <PDPADialog
        isPDPADialogOpen={isPDPADialogOpen}
        setIsPDPADialogOpen={setIsPDPADialogOpen}
      />
    </>
  );
};

const PDPADialog = ({
  isPDPADialogOpen,
  setIsPDPADialogOpen,
}: PDPADialogProps) => {
  return (
    <Dialog open={isPDPADialogOpen} onOpenChange={setIsPDPADialogOpen}>
      <DialogContent className="bg-app-white mt-[2rem] h-3/4 w-3/4 p-8">
        <DialogHeader>
          <DialogTitle className="text-app-dark-brown text-3xl font-semibold">
            Terms of Service (PDPA)
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-scroll text-left text-sm">
          By signing up for this Food Delivery Application, you acknowledge and
          agree that we will collect, use, and process your personal data in
          accordance with the Personal Data Protection Act B.E. 2562 (2019) of
          Thailand.
          <ol className="list-decimal px-4 py-2">
            <li>
              Data We Collect
              <br />
              Full name, phone number, email address, and delivery address
              Payment information (processed securely through third-party
              providers) Device and usage data (e.g., app activity, location
              data for delivery)
            </li>
            <li>
              Purpose of Data Use
              <br />
              We will use your personal data to: Create and manage your account
              Process and deliver food orders Communicate with you regarding
              your orders, promotions, or updates Improve our services,
              security, and user experience
            </li>
            <li>
              Data Sharing
              <br />
              We may share necessary information with: Partner restaurants and
              delivery riders to fulfill your order Payment providers for
              transaction processing Authorities or regulators when required by
              law
            </li>
            <li>
              Data Retention
              <br />
              Your personal data will be retained as long as you maintain an
              account or as required by applicable law.
            </li>
            <li>
              Your Rights
              <br />
              You have the right to: Access, correct, or delete your personal
              data Withdraw consent at any time File a complaint with the PDPA
              supervisory authority
            </li>
            <li>
              Contact Us
              <br />
              If you have questions about your personal data, please contact us.
            </li>
          </ol>
          By proceeding with Sign Up, you confirm that you have read and
          understood this PDPA Notice and consent to the collection and use of
          your personal data as described above.
        </div>
      </DialogContent>
    </Dialog>
  );
};
