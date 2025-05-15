import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Insurance Agency Management</h1>
          <p className="text-muted-foreground">Create a new account</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
