import {
  Users,
  FileText,
  CreditCard,
  BarChart3,
  Mail,
  UserRound,
} from "lucide-react";

const features = [
  {
    icon: <Users className="h-10 w-10 text-blue-500" />,
    title: "Customer Management",
    description:
      "Easily manage all your customers with detailed profiles and communication history.",
  },
  {
    icon: <FileText className="h-10 w-10 text-blue-500" />,
    title: "Real-Time Quoting",
    description:
      "Generate accurate quotes instantly with our advanced quoting engine.",
  },
  {
    icon: <CreditCard className="h-10 w-10 text-blue-500" />,
    title: "Secure Payments via Stripe",
    description:
      "Process payments securely and efficiently with integrated Stripe processing.",
  },
  {
    icon: <Mail className="h-10 w-10 text-blue-500" />,
    title: "Marketing Automation",
    description:
      "Automate your marketing efforts with loops.so and Twilio integration.",
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-blue-500" />,
    title: "Reporting & Analytics",
    description:
      "Gain valuable insights with comprehensive reporting and analytics tools.",
  },
  {
    icon: <UserRound className="h-10 w-10 text-blue-500" />,
    title: "Employee Oversight & Payroll",
    description:
      "Manage your team efficiently with employee oversight and payroll features.",
  },
];

export default function FeaturesOverview() {
  return (
    <div className="bg-muted/50 py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Powerful Features for Modern Agencies
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Everything you need to run your insurance agency efficiently
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-border flex flex-col items-center text-center"
            >
              <div className="p-3 rounded-full bg-muted mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
