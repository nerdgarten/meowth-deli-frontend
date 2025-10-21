import { Button } from "@/components/ui/button";
import { cn } from "@/libs/utils";

type AddressCardProps = {
  label: string;
  recipient: string;
  phoneNumber: string;
  addressLines?: string[];
  isDefault?: boolean;
  isSelected?: boolean;
  onEdit?: () => void;
  actionLabel?: string;
  className?: string;
  badgeLabel?: string;
};

export function AddressCard({
  label,
  recipient,
  phoneNumber,
  addressLines = [],
  isDefault = false,
  isSelected = false,
  onEdit,
  actionLabel = "Edit",
  className,
  badgeLabel = "Default",
}: AddressCardProps) {
  const containerClassName = cn(
    "rounded-2xl border border-app-brown/15 bg-white px-6 py-5 shadow-[0_12px_28px_rgba(64,56,49,0.08)] transition-colors",
    isSelected &&
      "border-2 border-dashed border-[#5B7FFF] bg-[#F7FAFF] shadow-none",
    className,
  );

  return (
    <div className={containerClassName}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-app-dark-brown text-base font-semibold">{label}</p>
          {isDefault ? (
            <span className="bg-app-dark-brown text-app-white rounded-full px-3 py-1 text-xs font-semibold">
              {badgeLabel}
            </span>
          ) : null}
        </div>
        {onEdit ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onEdit}
            className="border-app-brown/20 bg-white px-4 py-2 text-xs font-semibold text-app-dark-brown shadow-none transition hover:bg-app-brown/10"
          >
            {actionLabel}
          </Button>
        ) : null}
      </div>

      <div className="text-app-dark-brown mt-4 space-y-2 text-sm leading-relaxed">
        <p className="font-medium">{recipient}</p>
        <p className="text-app-brown/80">{phoneNumber}</p>
        {addressLines.map((line, index) => (
          <p key={`${line}-${index}`} className="text-app-brown/80">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

export type { AddressCardProps };
