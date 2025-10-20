import type { FC } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AddReviewForm from "./AddReviewForm";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "driver" | "restaurant";
  id: number;
  orderId: number;
  title: string;
  description?: string;
}

const ReviewModal: FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  type,
  id,
  orderId,
  title,
  description,
}) => {
  const handleSuccess = () => {
    onClose();
    alert(`${type} review submitted successfully!`);
  };

  const handleError = (error: Error) => {
    alert(`Error submitting ${type} review: ${error.message}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-gray-600">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="mt-4">
          <AddReviewForm
            type={type}
            id={id}
            orderId={orderId}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
