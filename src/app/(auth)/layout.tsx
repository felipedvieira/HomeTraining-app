import { Logo } from "@/components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <Logo size={52} />
          <span className="text-2xl font-extrabold text-primary">Home Training</span>
        </div>
        {children}
      </div>
    </div>
  );
}
