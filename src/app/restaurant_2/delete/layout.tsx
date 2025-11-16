import { WarningDialog } from "@/components/Admin/WarningDialog";
export default function AdminDeleteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WarningDialog>{children}</WarningDialog>;
}
