export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center">
      <section className="w-full px-4">
        <div className="mx-auto flex max-w-[640px] flex-col items-center gap-8 rounded-lg bg-white p-8">
          {children}
        </div>
      </section>
    </main>
  );
}