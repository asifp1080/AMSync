import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-16 md:py-24">
      <div className="container px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
            Automate Your Insurance Operations—Request a Demo Now!
          </h2>
          <p className="text-xl text-white/80">
            Join hundreds of insurance agencies already using AMSync.ai to
            streamline their operations and grow their business.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-white/90"
              asChild
            >
              <Link to="dashboard">Get a Demo</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-white border-white hover:bg-white/20"
            >
              View Pricing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
