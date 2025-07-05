import AuthForm from '@/components/auth/auth-form';

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-16 flex items-center justify-center min-h-[calc(100vh-14rem)]">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
}
