import { ResolveReport } from "@/components/Admin/ResolveReport";
export default function AdminPendingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ResolveReport>{children}</ResolveReport>;
}
