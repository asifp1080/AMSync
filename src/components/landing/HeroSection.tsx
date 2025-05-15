import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <div className="bg-background py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              Introducing AMSync.ai
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Streamline Your Insurance Agency Operations
            </h1>
            <p className="text-muted-foreground md:text-xl">
              The all-in-one platform for insurance agencies to manage
              customers, quotes, renewals, and more—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                onClick={() => (window.location.href = "/dashboard")}
              >
                Get a Demo
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
          <div className="mx-auto lg:mx-0 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-3xl blur-3xl" />
            <img
              src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80"
              alt="Dashboard Preview"
              className="mx-auto object-cover rounded-3xl border shadow-xl relative z-10"
              width={550}
              height={400}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
