
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[url('/images/gegmio_background.svg')] bg-cover bg-center bg-no-repeat flex justify-center items-center">
      {children}
    </div>
  );
}