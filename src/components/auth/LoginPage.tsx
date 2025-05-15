import LoginForm from "./LoginForm";
import { useLocation } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const location = useLocation();
  const message = location.state?.message;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Insurance Agency Management</h1>
          <p className="text-muted-foreground">
            Sign in to access your dashboard
          </p>
        </div>

        {message && (
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <LoginForm />
      </div>
    </div>
  );
}
