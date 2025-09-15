import { DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { useState } from "react";

interface ToSDialogProps {
  isToSDialogOpen: boolean;
  setIsToSDialogOpen: (open: boolean) => void;
}

export const ToSDialogButton = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isToSDialogOpen, setIsToSDialogOpen] = useState<boolean>(false);
  return (
    <>
      <button
        className="p-0 underline"
        onClick={() => setIsToSDialogOpen(true)}
      >
        {children}
      </button>
      <ToSDialog
        isToSDialogOpen={isToSDialogOpen}
        setIsToSDialogOpen={setIsToSDialogOpen}
      />
    </>
  );
};

const ToSDialog = ({ isToSDialogOpen, setIsToSDialogOpen }: ToSDialogProps) => {
  return (
    <Dialog open={isToSDialogOpen} onOpenChange={setIsToSDialogOpen}>
      <DialogContent className="bg-app-white mt-[2rem] h-3/4 w-3/4 p-8">
        <DialogHeader>
          <DialogTitle className="text-app-dark-brown text-3xl font-semibold">
            Terms of Service (ToS)
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-scroll text-left text-sm">
          Welcome to Meowth Delivery! Please read these Terms of Service
          carefully before using our food delivery application. By signing up
          and using our services, you agree to these terms.
          <ol className="list-decimal px-4 py-2">
            <li>
              Eligibility
              <br />
              You must be at least 18 years old to create an account. You agree
              to provide accurate and complete registration information.
            </li>
            <li>
              User Responsibilities
              <br />
              You are responsible for maintaining the confidentiality of your
              account and password. You must not use our platform for unlawful
              activities, fraud, or abusive behavior. You agree to pay all
              charges related to your orders through the payment methods
              provided.
            </li>
            <li>
              Service Scope
              <br />
              We connect customers with restaurants and delivery partners. Food
              quality, availability, and preparation are the responsibility of
              the restaurant. Delivery times are estimates and may vary
              depending on traffic, weather, and other factors.
            </li>
            <li>
              Payments & Refunds
              <br />
              All payments are processed securely through our payment partners.
              Refunds, if applicable, will follow our refund policy and may
              depend on restaurant approval.
            </li>
            <li>
              Data Privacy
              <br />
              We will handle your personal data according to our [Privacy Policy
              / PDPA Notice]. By using our services, you consent to the
              collection and use of your data as outlined.
            </li>
            <li>
              Limitation of Liability
              <br />
              We are not liable for delays, cancellations, food quality issues,
              or damages caused by restaurants or delivery partners. Our maximum
              liability is limited to the value of the order in question.
            </li>
            <li>
              Account Suspension & Termination
              <br />
              We reserve the right to suspend or terminate accounts that violate
              these terms, engage in fraud, or misuse the platform.
            </li>
            <li>
              Changes to Terms
              <br />
              We may update these Terms from time to time. Updates will be
              posted in the app and effective immediately upon posting.
            </li>
            <li>
              Governing Law
              <br />
              These Terms are governed by the laws of Thailand. Any disputes
              shall be resolved in accordance with Thai law.
            </li>
          </ol>
          By proceeding with Sign Up, you confirm that you have read,
          understood, and agreed to these Terms of Service.
        </div>
      </DialogContent>
    </Dialog>
  );
};
