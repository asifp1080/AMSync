import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ChevronRight,
  AlertCircle,
  Search,
  User,
  FileText,
  DollarSign,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface QuotingEngineProps {
  onQuoteComplete?: (quoteData: any) => void;
  initialCustomerData?: any;
}

const QuotingEngine = ({
  onQuoteComplete = () => {},
  initialCustomerData = null,
}: QuotingEngineProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [duplicateFound, setDuplicateFound] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(
    initialCustomerData || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
  );
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [coverageOptions, setCoverageOptions] = useState({});
  const [premium, setPremium] = useState(0);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Simulate duplicate check
      const hasDuplicate = Math.random() > 0.7;
      setDuplicateFound(hasDuplicate);

      if (!hasDuplicate) {
        setCurrentStep(currentStep + 1);
      }
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - complete quote
      const quoteData = {
        customer: customerInfo,
        products: selectedProducts,
        coverage: coverageOptions,
        premium: premium,
      };
      onQuoteComplete(quoteData);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value,
    });
  };

  const handleProductSelection = (product: string) => {
    if (selectedProducts.includes(product)) {
      setSelectedProducts(selectedProducts.filter((p) => p !== product));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleCoverageChange = (coverage: string, value: any) => {
    setCoverageOptions({
      ...coverageOptions,
      [coverage]: value,
    });
  };

  const generatePremium = () => {
    // Simulate premium calculation
    const basePremium = 500;
    const productMultiplier = selectedProducts.length * 1.5;
    const calculatedPremium = basePremium * productMultiplier;
    setPremium(calculatedPremium);
    setCurrentStep(4); // Move to final step
  };

  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep > index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              {currentStep > index ? <Check className="w-4 h-4" /> : index + 1}
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Customer Info</span>
          <span>Products</span>
          <span>Coverage</span>
          <span>Quote</span>
        </div>
      </div>
    );
  };

  const renderCustomerInfoStep = () => {
    return (
      <Card className="w-full bg-background">
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
          <CardDescription>
            Enter the customer's details to begin the quote process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {duplicateFound && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Duplicate Customer Found</AlertTitle>
              <AlertDescription>
                A customer with similar information already exists in the
                system.
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDuplicateFound(false)}
                  >
                    View Existing Record
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={customerInfo.firstName}
                onChange={handleCustomerInfoChange}
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={customerInfo.lastName}
                onChange={handleCustomerInfoChange}
                placeholder="Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={customerInfo.email}
                onChange={handleCustomerInfoChange}
                placeholder="john.doe@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={customerInfo.phone}
                onChange={handleCustomerInfoChange}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={customerInfo.address}
                onChange={handleCustomerInfoChange}
                placeholder="123 Main St"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={customerInfo.city}
                onChange={handleCustomerInfoChange}
                placeholder="Anytown"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select>
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ca">California</SelectItem>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="tx">Texas</SelectItem>
                  <SelectItem value="fl">Florida</SelectItem>
                  <SelectItem value="il">Illinois</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={customerInfo.zipCode}
                onChange={handleCustomerInfoChange}
                placeholder="12345"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" disabled>
            Back
          </Button>
          <Button onClick={handleNextStep}>
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  };

  const renderProductSelectionStep = () => {
    const products = [
      {
        id: "auto",
        name: "Auto Insurance",
        description: "Coverage for personal vehicles",
      },
      {
        id: "home",
        name: "Home Insurance",
        description: "Protection for your property",
      },
      {
        id: "life",
        name: "Life Insurance",
        description: "Financial security for your family",
      },
      {
        id: "health",
        name: "Health Insurance",
        description: "Medical coverage for individuals",
      },
      {
        id: "business",
        name: "Business Insurance",
        description: "Protection for your business assets",
      },
      {
        id: "umbrella",
        name: "Umbrella Policy",
        description: "Additional liability coverage",
      },
    ];

    return (
      <Card className="w-full bg-background">
        <CardHeader>
          <CardTitle>Select Products</CardTitle>
          <CardDescription>
            Choose the insurance products for this quote
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductSelection(product.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedProducts.includes(product.id) ? "border-primary bg-primary/10" : "border-border"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedProducts.includes(product.id) ? "bg-primary border-primary" : "border-muted"}`}
                  >
                    {selectedProducts.includes(product.id) && (
                      <Check className="w-3 h-3 text-primary-foreground" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePreviousStep}>
            Back
          </Button>
          <Button
            onClick={handleNextStep}
            disabled={selectedProducts.length === 0}
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  };

  const renderCoverageOptionsStep = () => {
    // Dynamic coverage options based on selected products
    const coverageFields = [
      {
        id: "liability",
        name: "Liability Coverage",
        type: "select",
        options: ["$25,000", "$50,000", "$100,000", "$300,000"],
      },
      {
        id: "deductible",
        name: "Deductible",
        type: "select",
        options: ["$250", "$500", "$1,000", "$2,500"],
      },
      {
        id: "term",
        name: "Policy Term",
        type: "select",
        options: ["6 months", "12 months"],
      },
      { id: "additionalDrivers", name: "Additional Drivers", type: "number" },
      {
        id: "specialEndorsements",
        name: "Special Endorsements",
        type: "checkbox",
      },
    ];

    return (
      <Card className="w-full bg-background">
        <CardHeader>
          <CardTitle>Configure Coverage Options</CardTitle>
          <CardDescription>
            Customize the coverage details for selected products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {selectedProducts.map((product) => (
              <div key={product} className="space-y-4">
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">
                    {product.charAt(0).toUpperCase() + product.slice(1)}
                  </Badge>
                  <h3 className="text-lg font-medium">
                    {product.charAt(0).toUpperCase() + product.slice(1)}{" "}
                    Insurance Coverage
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {coverageFields.map((field) => (
                    <div key={`${product}-${field.id}`} className="space-y-2">
                      <Label htmlFor={`${product}-${field.id}`}>
                        {field.name}
                      </Label>
                      {field.type === "select" ? (
                        <Select
                          onValueChange={(value) =>
                            handleCoverageChange(
                              `${product}-${field.id}`,
                              value,
                            )
                          }
                        >
                          <SelectTrigger id={`${product}-${field.id}`}>
                            <SelectValue placeholder={`Select ${field.name}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : field.type === "number" ? (
                        <Input
                          id={`${product}-${field.id}`}
                          type="number"
                          min="0"
                          onChange={(e) =>
                            handleCoverageChange(
                              `${product}-${field.id}`,
                              e.target.value,
                            )
                          }
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <input
                            id={`${product}-${field.id}`}
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            onChange={(e) =>
                              handleCoverageChange(
                                `${product}-${field.id}`,
                                e.target.checked,
                              )
                            }
                          />
                          <Label htmlFor={`${product}-${field.id}`}>
                            Include
                          </Label>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePreviousStep}>
            Back
          </Button>
          <Button onClick={generatePremium}>
            Generate Premium <DollarSign className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  };

  const renderQuoteStep = () => {
    return (
      <Card className="w-full bg-background">
        <CardHeader>
          <CardTitle>Quote Summary</CardTitle>
          <CardDescription>Review and finalize the quote</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-muted/50 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Premium</h3>
                <div className="text-2xl font-bold">${premium.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Policy Term:</div>
                <div className="text-right">12 months</div>
                <div>Effective Date:</div>
                <div className="text-right">
                  {new Date().toLocaleDateString()}
                </div>
                <div>Payment Schedule:</div>
                <div className="text-right">Monthly</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Customer Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Name:</div>
                <div>
                  {customerInfo.firstName} {customerInfo.lastName}
                </div>
                <div className="text-muted-foreground">Email:</div>
                <div>{customerInfo.email}</div>
                <div className="text-muted-foreground">Phone:</div>
                <div>{customerInfo.phone}</div>
                <div className="text-muted-foreground">Address:</div>
                <div>
                  {customerInfo.address}, {customerInfo.city},{" "}
                  {customerInfo.state} {customerInfo.zipCode}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Selected Products</h3>
              <div className="flex flex-wrap gap-2">
                {selectedProducts.map((product) => (
                  <Badge key={product}>
                    {product.charAt(0).toUpperCase() + product.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={handlePreviousStep}>
              Back to Coverage
            </Button>
            <Button onClick={handleNextStep}>
              Finalize Quote <Check className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="w-full">
            <Button variant="outline" className="w-full" onClick={() => {}}>
              <Send className="mr-2 h-4 w-4" /> Send Quote to Customer
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-background">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Quoting Engine</h1>
        <p className="text-muted-foreground">
          Create and customize insurance quotes for your customers
        </p>
      </div>

      {renderStepIndicator()}

      <div className="mt-6">
        {currentStep === 1 && renderCustomerInfoStep()}
        {currentStep === 2 && renderProductSelectionStep()}
        {currentStep === 3 && renderCoverageOptionsStep()}
        {currentStep === 4 && renderQuoteStep()}
      </div>
    </div>
  );
};

export default QuotingEngine;
