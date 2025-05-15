import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useLocation } from "@/lib/location-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Edit, MapPin } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Policy {
  id: string;
  policy_number: string;
  policy_type: string;
  customer_id: string;
  customer_name?: string;
  premium: number;
  start_date: string;
  end_date: string;
  status: string;
  location_id: string | null;
  location_name?: string;
  region_name?: string;
  entity_name?: string;
}

export default function PolicyLocationManagement() {
  const { userLocations } = useLocation();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

  // Fetch policies
  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    setIsLoading(true);
    try {
      // Fetch policies with customer names and location details
      const { data, error } = await supabase
        .from("policies")
        .select(
          "*, customers(name), locations(id, name, regions(name, entities(name)))",
        )
        .order("policy_number");

      if (error) throw error;

      const formattedPolicies = data.map((policy: any) => ({
        ...policy,
        customer_name: policy.customers?.name,
        location_name: policy.locations?.name,
        region_name: policy.locations?.regions?.name,
        entity_name: policy.locations?.regions?.entities?.name,
      }));

      setPolicies(formattedPolicies);
    } catch (error) {
      console.error("Error fetching policies:", error);
      setErrorMessage("Failed to fetch policies");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationChange = (locationId: string) => {
    setSelectedPolicy((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        location_id: locationId,
      };
    });
  };

  const handlePolicySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPolicy) return;

    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const { error } = await supabase
        .from("policies")
        .update({
          location_id: selectedPolicy.location_id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedPolicy.id);

      if (error) throw error;

      setSuccessMessage("Policy location updated successfully");
      setDialogOpen(false);
      fetchPolicies();
    } catch (error) {
      console.error("Error updating policy location:", error);
      setErrorMessage("Failed to update policy location");
    } finally {
      setIsLoading(false);
    }
  };

  const editPolicyLocation = (policy: Policy) => {
    setSelectedPolicy(policy);
    setDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "expired":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Policy Location Management</h2>
      </div>

      {successMessage && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Policy Number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Premium</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.length > 0 ? (
                policies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className="font-medium">
                      {policy.policy_number}
                    </TableCell>
                    <TableCell>{policy.policy_type}</TableCell>
                    <TableCell>{policy.customer_name}</TableCell>
                    <TableCell>{formatCurrency(policy.premium)}</TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusColor(policy.status)}
                        variant="outline"
                      >
                        {policy.status.charAt(0).toUpperCase() +
                          policy.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {policy.location_id ? (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-primary" />
                          <div>
                            <div className="font-medium">
                              {policy.location_name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {policy.entity_name} &gt; {policy.region_name}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          No location assigned
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editPolicyLocation(policy)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-4 text-muted-foreground"
                  >
                    {isLoading ? "Loading policies..." : "No policies found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Location to Policy</DialogTitle>
            <DialogDescription>
              Select a location to assign to this policy.
            </DialogDescription>
          </DialogHeader>
          {selectedPolicy && (
            <form onSubmit={handlePolicySubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Policy Information</Label>
                  <div className="p-4 border rounded-md bg-muted/20">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Policy Number:
                        </span>
                        <p className="font-medium">
                          {selectedPolicy.policy_number}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <p className="font-medium">
                          {selectedPolicy.policy_type}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Customer:</span>
                        <p className="font-medium">
                          {selectedPolicy.customer_name}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Premium:</span>
                        <p className="font-medium">
                          {formatCurrency(selectedPolicy.premium)}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Start Date:
                        </span>
                        <p className="font-medium">
                          {formatDate(selectedPolicy.start_date)}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">End Date:</span>
                        <p className="font-medium">
                          {formatDate(selectedPolicy.end_date)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select
                    value={selectedPolicy.location_id || ""}
                    onValueChange={handleLocationChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Location</SelectItem>
                      {userLocations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name} ({location.entity_name} &gt;{" "}
                          {location.region_name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
