export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // push content below fixed nav + lock the page to one viewport
    <div className="bg-app-background pt-16" style={{ height: "100dvh" }}>
      {children}
    </div>
  );
}
