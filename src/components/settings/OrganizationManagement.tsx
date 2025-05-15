import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Plus, Edit, Trash2, Search } from "lucide-react";

interface Organization {
  id: string;
  name: string;
  description: string | null;
  status: string;
  primary_contact_name: string | null;
  primary_contact_email: string | null;
  primary_contact_phone: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  logo_url: string | null;
  website: string | null;
  industry: string | null;
  tax_id: string | null;
  billing_email: string | null;
  billing_address: string | null;
  subscription_tier: string | null;
  subscription_status: string | null;
  subscription_renewal_date: string | null;
}

export default function OrganizationManagement() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Organization form state
  const [organizationForm, setOrganizationForm] = useState<Organization>({
    id: "",
    name: "",
    description: "",
    status: "active",
    primary_contact_name: "",
    primary_contact_email: "",
    primary_contact_phone: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    zip_code: "",
    country: "USA",
    logo_url: "",
    website: "",
    industry: "",
    tax_id: "",
    billing_email: "",
    billing_address: "",
    subscription_tier: "standard",
    subscription_status: "active",
    subscription_renewal_date: null,
  });

  // Fetch organizations
  const fetchOrganizations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .order("name");

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create organization
  const createOrganization = async (data: any) => {
    try {
      const { error } = await supabase.from("organizations").insert(data);
      if (error) throw error;
      await fetchOrganizations();
    } catch (error) {
      console.error("Error creating organization:", error);
      throw error;
    }
  };

  // Update organization
  const updateOrganization = async ({
    id,
    data,
  }: {
    id: string;
    data: any;
  }) => {
    try {
      const { error } = await supabase
        .from("organizations")
        .update(data)
        .eq("id", id);
      if (error) throw error;
      await fetchOrganizations();
    } catch (error) {
      console.error("Error updating organization:", error);
      throw error;
    }
  };

  // Delete organization
  const deleteOrganization = async (id: string) => {
    try {
      const { error } = await supabase
        .from("organizations")
        .delete()
        .eq("id", id);
      if (error) throw error;
      await fetchOrganizations();
    } catch (error) {
      console.error("Error deleting organization:", error);
      throw error;
    }
  };

  // Load organizations on component mount
  useEffect(() => {
    fetchOrganizations();
  }, []);

  // Filter organizations based on search query
  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.industry?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Reset organization form
  const resetOrganizationForm = () => {
    setOrganizationForm({
      id: "",
      name: "",
      description: "",
      status: "active",
      primary_contact_name: "",
      primary_contact_email: "",
      primary_contact_phone: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      zip_code: "",
      country: "USA",
      logo_url: "",
      website: "",
      industry: "",
      tax_id: "",
      billing_email: "",
      billing_address: "",
      subscription_tier: "standard",
      subscription_status: "active",
      subscription_renewal_date: null,
    });
  };

  // Handle organization form changes
  const handleOrganizationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setOrganizationForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setOrganizationForm((prev) => ({ ...prev, [name]: value }));
  };

  // Edit organization
  const editOrganization = (organization: Organization) => {
    setOrganizationForm({
      ...organization,
      description: organization.description || "",
      primary_contact_name: organization.primary_contact_name || "",
      primary_contact_email: organization.primary_contact_email || "",
      primary_contact_phone: organization.primary_contact_phone || "",
      address_line_1: organization.address_line_1 || "",
      address_line_2: organization.address_line_2 || "",
      city: organization.city || "",
      state: organization.state || "",
      zip_code: organization.zip_code || "",
      country: organization.country || "USA",
      logo_url: organization.logo_url || "",
      website: organization.website || "",
      industry: organization.industry || "",
      tax_id: organization.tax_id || "",
      billing_email: organization.billing_email || "",
      billing_address: organization.billing_address || "",
      subscription_tier: organization.subscription_tier || "standard",
      subscription_status: organization.subscription_status || "active",
    });
    setDialogOpen(true);
  };

  // Handle organization form submission
  const handleOrganizationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (organizationForm.id) {
        // Update existing organization
        await updateOrganization({
          id: organizationForm.id,
          data: {
            name: organizationForm.name,
            description: organizationForm.description || null,
            status: organizationForm.status,
            primary_contact_name: organizationForm.primary_contact_name || null,
            primary_contact_email:
              organizationForm.primary_contact_email || null,
            primary_contact_phone:
              organizationForm.primary_contact_phone || null,
            address_line_1: organizationForm.address_line_1 || null,
            address_line_2: organizationForm.address_line_2 || null,
            city: organizationForm.city || null,
            state: organizationForm.state || null,
            zip_code: organizationForm.zip_code || null,
            country: organizationForm.country || null,
            logo_url: organizationForm.logo_url || null,
            website: organizationForm.website || null,
            industry: organizationForm.industry || null,
            tax_id: organizationForm.tax_id || null,
            billing_email: organizationForm.billing_email || null,
            billing_address: organizationForm.billing_address || null,
            subscription_tier: organizationForm.subscription_tier || null,
            subscription_status: organizationForm.subscription_status || null,
            subscription_renewal_date:
              organizationForm.subscription_renewal_date || null,
          },
        });
      } else {
        // Create new organization
        await createOrganization({
          name: organizationForm.name,
          description: organizationForm.description || null,
          status: organizationForm.status,
          primary_contact_name: organizationForm.primary_contact_name || null,
          primary_contact_email: organizationForm.primary_contact_email || null,
          primary_contact_phone: organizationForm.primary_contact_phone || null,
          address_line_1: organizationForm.address_line_1 || null,
          address_line_2: organizationForm.address_line_2 || null,
          city: organizationForm.city || null,
          state: organizationForm.state || null,
          zip_code: organizationForm.zip_code || null,
          country: organizationForm.country || null,
          logo_url: organizationForm.logo_url || null,
          website: organizationForm.website || null,
          industry: organizationForm.industry || null,
          tax_id: organizationForm.tax_id || null,
          billing_email: organizationForm.billing_email || null,
          billing_address: organizationForm.billing_address || null,
          subscription_tier: organizationForm.subscription_tier || null,
          subscription_status: organizationForm.subscription_status || null,
          subscription_renewal_date:
            organizationForm.subscription_renewal_date || null,
        });
      }

      // Reset form and close dialog
      resetOrganizationForm();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error saving organization:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete for organizations
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this organization?")) {
      return;
    }

    setIsLoading(true);

    try {
      await deleteOrganization(id);
    } catch (error) {
      console.error("Error deleting organization:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Organization Management</h1>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search organizations..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Organizations</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {organizationForm.id ? "Edit" : "Add"} Organization
              </DialogTitle>
              <DialogDescription>
                {organizationForm.id
                  ? "Update the organization details below."
                  : "Create a new organization by filling out the form below."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleOrganizationSubmit}>
              <div className="grid gap-6 py-4">
                <div className="grid gap-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="org-name">Organization Name*</Label>
                      <Input
                        id="org-name"
                        name="name"
                        value={organizationForm.name}
                        onChange={handleOrganizationChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="org-status">Status*</Label>
                      <Select
                        value={organizationForm.status}
                        onValueChange={(value) =>
                          handleSelectChange("status", value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2 md:col-span-2">
                      <Label htmlFor="org-description">Description</Label>
                      <Textarea
                        id="org-description"
                        name="description"
                        value={organizationForm.description}
                        onChange={handleOrganizationChange}
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="org-industry">Industry</Label>
                      <Input
                        id="org-industry"
                        name="industry"
                        value={organizationForm.industry}
                        onChange={handleOrganizationChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="org-website">Website</Label>
                      <Input
                        id="org-website"
                        name="website"
                        type="url"
                        value={organizationForm.website}
                        onChange={handleOrganizationChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <h3 className="text-lg font-medium">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="org-contact-name">
                        Primary Contact Name
                      </Label>
                      <Input
                        id="org-contact-name"
                        name="primary_contact_name"
                        value={organizationForm.primary_contact_name}
                        onChange={handleOrganizationChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="org-contact-email">
                        Primary Contact Email
                      </Label>
                      <Input
                        id="org-contact-email"
                        name="primary_contact_email"
                        type="email"
                        value={organizationForm.primary_contact_email}
                        onChange={handleOrganizationChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="org-contact-phone">
                        Primary Contact Phone
                      </Label>
                      <Input
                        id="org-contact-phone"
                        name="primary_contact_phone"
                        value={organizationForm.primary_contact_phone}
                        onChange={handleOrganizationChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <h3 className="text-lg font-medium">Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="org-address-line1">Address Line 1</Label>
                      <Input
                        id="org-address-line1"
                        name="address_line_1"
                        value={organizationForm.address_line_1}
                        onChange={handleOrganizationChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="org-address-line2">Address Line 2</Label>
                      <Input
                        id="org-address-line2"
                        name="address_line_2"
                        value={organizationForm.address_line_2}
                        onChange={handleOrganizationChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="org-city">City</Label>
                      <Input
                        id="org-city"
                        name="city"
                        value={organizationForm.city}
                        onChange={handleOrganizationChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="org-state">State</Label>
                      <Input
                        id="org-state"
                        name="state"
                        value={organizationForm.state}
                        onChange={handleOrganizationChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="org-zip">ZIP Code</Label>
                      <Input
                        id="org-zip"
                        name="zip_code"
                        value={organizationForm.zip_code}
                        onChange={handleOrganizationChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="org-country">Country</Label>
                      <Input
                        id="org-country"
                        name="country"
                        value={organizationForm.country}
                        onChange={handleOrganizationChange}
                        placeholder="USA"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <h3 className="text-lg font-medium">Billing Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="org-tax-id">Tax ID</Label>
                      <Input
                        id="org-tax-id"
                        name="tax_id"
                        value={organizationForm.tax_id}
                        onChange={handleOrganizationChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="org-billing-email">Billing Email</Label>
                      <Input
                        id="org-billing-email"
                        name="billing_email"
                        type="email"
                        value={organizationForm.billing_email}
                        onChange={handleOrganizationChange}
                      />
                    </div>
                    <div className="grid gap-2 md:col-span-2">
                      <Label htmlFor="org-billing-address">
                        Billing Address
                      </Label>
                      <Textarea
                        id="org-billing-address"
                        name="billing_address"
                        value={organizationForm.billing_address}
                        onChange={handleOrganizationChange}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <h3 className="text-lg font-medium">Subscription Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="org-subscription-tier">
                        Subscription Tier
                      </Label>
                      <Select
                        value={organizationForm.subscription_tier || "standard"}
                        onValueChange={(value) =>
                          handleSelectChange("subscription_tier", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select tier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="org-subscription-status">
                        Subscription Status
                      </Label>
                      <Select
                        value={organizationForm.subscription_status || "active"}
                        onValueChange={(value) =>
                          handleSelectChange("subscription_status", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="trial">Trial</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="org-renewal-date">Renewal Date</Label>
                      <Input
                        id="org-renewal-date"
                        name="subscription_renewal_date"
                        type="date"
                        value={
                          organizationForm.subscription_renewal_date
                            ? new Date(
                                organizationForm.subscription_renewal_date,
                              )
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={handleOrganizationChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? "Saving..."
                    : organizationForm.id
                      ? "Update Organization"
                      : "Create Organization"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrganizations.length > 0 ? (
                filteredOrganizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell>{org.industry || "N/A"}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          org.status === "active"
                            ? "bg-green-100 text-green-800"
                            : org.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {org.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {org.subscription_tier
                        ? `${org.subscription_tier} (${org.subscription_status})`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {org.primary_contact_name ||
                        org.primary_contact_email ||
                        "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => editOrganization(org)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(org.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-4 text-muted-foreground"
                  >
                    {searchQuery
                      ? "No matching organizations found."
                      : "No organizations found. Create your first organization to get started."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
