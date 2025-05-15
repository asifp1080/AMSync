import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2, Edit, Plus, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Entity {
  id: string;
  name: string;
  description: string | null;
}

interface Region {
  id: string;
  entity_id: string;
  name: string;
  description: string | null;
  entity_name?: string;
}

interface Location {
  id: string;
  region_id: string;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  phone: string | null;
  email: string | null;
  allowed_ip_ranges: string[] | null;
  region_name?: string;
  entity_name?: string;
}

export default function LocationManagement() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("entities");
  const [entities, setEntities] = useState<Entity[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Entity form state
  const [entityForm, setEntityForm] = useState({
    id: "",
    name: "",
    description: "",
  });

  // Region form state
  const [regionForm, setRegionForm] = useState({
    id: "",
    entity_id: "",
    name: "",
    description: "",
  });

  // Location form state
  const [locationForm, setLocationForm] = useState({
    id: "",
    region_id: "",
    name: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    phone: "",
    email: "",
    allowed_ip_ranges: "",
  });

  // Dialog states
  const [entityDialogOpen, setEntityDialogOpen] = useState(false);
  const [regionDialogOpen, setRegionDialogOpen] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: string;
    id: string;
  } | null>(null);

  // Fetch data
  useEffect(() => {
    fetchEntities();
    fetchRegions();
    fetchLocations();
  }, []);

  const fetchEntities = async () => {
    try {
      const { data, error } = await supabase.from("entities").select("*");
      if (error) throw error;
      setEntities(data || []);
    } catch (error) {
      console.error("Error fetching entities:", error);
      setErrorMessage("Failed to fetch entities");
    }
  };

  const fetchRegions = async () => {
    try {
      const { data, error } = await supabase
        .from("regions")
        .select("*, entities(name)")
        .order("name");

      if (error) throw error;

      const formattedRegions =
        data?.map((region) => ({
          ...region,
          entity_name: region.entities?.name,
        })) || [];

      setRegions(formattedRegions);
    } catch (error) {
      console.error("Error fetching regions:", error);
      setErrorMessage("Failed to fetch regions");
    }
  };

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from("locations")
        .select("*, regions(name, entity_id, entities(name))")
        .order("name");

      if (error) throw error;

      const formattedLocations =
        data?.map((location) => ({
          ...location,
          region_name: location.regions?.name,
          entity_name: location.regions?.entities?.name,
        })) || [];

      setLocations(formattedLocations);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setErrorMessage("Failed to fetch locations");
    }
  };

  // Entity handlers
  const handleEntityChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEntityForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEntitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      if (entityForm.id) {
        // Update existing entity
        const { error } = await supabase
          .from("entities")
          .update({
            name: entityForm.name,
            description: entityForm.description || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", entityForm.id);

        if (error) throw error;
        setSuccessMessage("Entity updated successfully");
      } else {
        // Create new entity
        const { error } = await supabase.from("entities").insert({
          name: entityForm.name,
          description: entityForm.description || null,
        });

        if (error) throw error;
        setSuccessMessage("Entity created successfully");
      }

      // Reset form and refresh data
      setEntityForm({ id: "", name: "", description: "" });
      setEntityDialogOpen(false);
      fetchEntities();
    } catch (error) {
      console.error("Error saving entity:", error);
      setErrorMessage("Failed to save entity");
    } finally {
      setIsLoading(false);
    }
  };

  const editEntity = (entity: Entity) => {
    setEntityForm({
      id: entity.id,
      name: entity.name,
      description: entity.description || "",
    });
    setEntityDialogOpen(true);
  };

  // Region handlers
  const handleRegionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setRegionForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegionEntityChange = (value: string) => {
    setRegionForm((prev) => ({
      ...prev,
      entity_id: value,
    }));
  };

  const handleRegionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      if (regionForm.id) {
        // Update existing region
        const { error } = await supabase
          .from("regions")
          .update({
            entity_id: regionForm.entity_id,
            name: regionForm.name,
            description: regionForm.description || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", regionForm.id);

        if (error) throw error;
        setSuccessMessage("Region updated successfully");
      } else {
        // Create new region
        const { error } = await supabase.from("regions").insert({
          entity_id: regionForm.entity_id,
          name: regionForm.name,
          description: regionForm.description || null,
        });

        if (error) throw error;
        setSuccessMessage("Region created successfully");
      }

      // Reset form and refresh data
      setRegionForm({ id: "", entity_id: "", name: "", description: "" });
      setRegionDialogOpen(false);
      fetchRegions();
    } catch (error) {
      console.error("Error saving region:", error);
      setErrorMessage("Failed to save region");
    } finally {
      setIsLoading(false);
    }
  };

  const editRegion = (region: Region) => {
    setRegionForm({
      id: region.id,
      entity_id: region.entity_id,
      name: region.name,
      description: region.description || "",
    });
    setRegionDialogOpen(true);
  };

  // Location handlers
  const handleLocationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setLocationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationRegionChange = (value: string) => {
    setLocationForm((prev) => ({
      ...prev,
      region_id: value,
    }));
  };

  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // Parse IP ranges from comma-separated string to array
      const ipRanges = locationForm.allowed_ip_ranges
        ? locationForm.allowed_ip_ranges.split(",").map((ip) => ip.trim())
        : [];

      if (locationForm.id) {
        // Update existing location
        const { error } = await supabase
          .from("locations")
          .update({
            region_id: locationForm.region_id,
            name: locationForm.name,
            address: locationForm.address || null,
            city: locationForm.city || null,
            state: locationForm.state || null,
            zip_code: locationForm.zip_code || null,
            phone: locationForm.phone || null,
            email: locationForm.email || null,
            allowed_ip_ranges: ipRanges.length > 0 ? ipRanges : null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", locationForm.id);

        if (error) throw error;
        setSuccessMessage("Location updated successfully");
      } else {
        // Create new location
        const { error } = await supabase.from("locations").insert({
          region_id: locationForm.region_id,
          name: locationForm.name,
          address: locationForm.address || null,
          city: locationForm.city || null,
          state: locationForm.state || null,
          zip_code: locationForm.zip_code || null,
          phone: locationForm.phone || null,
          email: locationForm.email || null,
          allowed_ip_ranges: ipRanges.length > 0 ? ipRanges : null,
          location_type: locationForm.location_type || null,
          status: locationForm.status || null,
          primary_contact_name: locationForm.primary_contact_name || null,
          primary_contact_email: locationForm.primary_contact_email || null,
          primary_contact_phone: locationForm.primary_contact_phone || null,
          hours_of_operation: locationForm.hours_of_operation || null,
          notes: locationForm.notes || null,
        });

        if (error) throw error;
        setSuccessMessage("Location created successfully");
      }

      // Reset form and refresh data
      setLocationForm({
        id: "",
        region_id: "",
        name: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        phone: "",
        email: "",
        allowed_ip_ranges: "",
      });
      setLocationDialogOpen(false);
      fetchLocations();
    } catch (error) {
      console.error("Error saving location:", error);
      setErrorMessage("Failed to save location");
    } finally {
      setIsLoading(false);
    }
  };

  const editLocation = (location: Location) => {
    setLocationForm({
      id: location.id,
      region_id: location.region_id,
      name: location.name,
      address: location.address || "",
      city: location.city || "",
      state: location.state || "",
      zip_code: location.zip_code || "",
      phone: location.phone || "",
      email: location.email || "",
      allowed_ip_ranges: location.allowed_ip_ranges
        ? location.allowed_ip_ranges.join(", ")
        : "",
    });
    setLocationDialogOpen(true);
  };

  // Delete handlers
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const { type, id } = itemToDelete;
      const { error } = await supabase.from(type).delete().eq("id", id);

      if (error) throw error;

      setSuccessMessage(
        `${type.charAt(0).toUpperCase() + type.slice(1, -1)} deleted successfully`,
      );

      // Refresh appropriate data
      if (type === "entities") fetchEntities();
      if (type === "regions") fetchRegions();
      if (type === "locations") fetchLocations();
    } catch (error) {
      console.error("Error deleting item:", error);
      setErrorMessage("Failed to delete item");
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleDelete = (type: string, id: string) => {
    setItemToDelete({ type, id });
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Location Management</h2>
        <p className="text-muted-foreground">
          Manage your organization's entities, regions, and locations
        </p>
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="entities">Entities</TabsTrigger>
          <TabsTrigger value="regions">Regions</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* Entities Tab */}
          <TabsContent value="entities" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Entities</h3>
              <Dialog
                open={entityDialogOpen}
                onOpenChange={setEntityDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Entity
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {entityForm.id ? "Edit" : "Add"} Entity
                    </DialogTitle>
                    <DialogDescription>
                      {entityForm.id
                        ? "Update the entity details below."
                        : "Create a new entity by filling out the form below."}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleEntitySubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="entity-name">Name</Label>
                        <Input
                          id="entity-name"
                          name="name"
                          value={entityForm.name}
                          onChange={handleEntityChange}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="entity-description">Description</Label>
                        <Textarea
                          id="entity-description"
                          name="description"
                          value={entityForm.description}
                          onChange={handleEntityChange}
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="entity-type">Entity Type</Label>
                          <Select
                            value={entityForm.entity_type}
                            onValueChange={(value) =>
                              setEntityForm((prev) => ({
                                ...prev,
                                entity_type: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="agency">Agency</SelectItem>
                              <SelectItem value="broker">Broker</SelectItem>
                              <SelectItem value="carrier">Carrier</SelectItem>
                              <SelectItem value="vendor">Vendor</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="entity-status">Status</Label>
                          <Select
                            value={entityForm.status}
                            onValueChange={(value) =>
                              setEntityForm((prev) => ({
                                ...prev,
                                status: value,
                              }))
                            }
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
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="entity-city">City</Label>
                          <Input
                            id="entity-city"
                            name="city"
                            value={entityForm.city}
                            onChange={handleEntityChange}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="entity-state">State</Label>
                          <Input
                            id="entity-state"
                            name="state"
                            value={entityForm.state}
                            onChange={handleEntityChange}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="entity-contact-name">
                            Primary Contact Name
                          </Label>
                          <Input
                            id="entity-contact-name"
                            name="primary_contact_name"
                            value={entityForm.primary_contact_name}
                            onChange={handleEntityChange}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="entity-contact-email">
                            Primary Contact Email
                          </Label>
                          <Input
                            id="entity-contact-email"
                            name="primary_contact_email"
                            type="email"
                            value={entityForm.primary_contact_email}
                            onChange={handleEntityChange}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading
                          ? "Saving..."
                          : entityForm.id
                            ? "Update Entity"
                            : "Create Entity"}
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
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entities.length > 0 ? (
                      entities.map((entity) => (
                        <TableRow key={entity.id}>
                          <TableCell className="font-medium">
                            {entity.name}
                          </TableCell>
                          <TableCell>{entity.entity_type}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${entity.status === "active" ? "bg-green-100 text-green-800" : entity.status === "inactive" ? "bg-gray-100 text-gray-800" : "bg-yellow-100 text-yellow-800"}`}
                            >
                              {entity.status || "N/A"}
                            </span>
                          </TableCell>
                          <TableCell>
                            {entity.city && entity.state
                              ? `${entity.city}, ${entity.state}`
                              : entity.city || entity.state || "N/A"}
                          </TableCell>
                          <TableCell>
                            {entity.primary_contact_name ||
                              entity.primary_contact_email ||
                              "N/A"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => editEntity(entity)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleDelete("entities", entity.id)
                                }
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
                          colSpan={5}
                          className="text-center py-4 text-muted-foreground"
                        >
                          No entities found. Create your first entity to get
                          started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Regions Tab */}
          <TabsContent value="regions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Regions</h3>
              <Dialog
                open={regionDialogOpen}
                onOpenChange={setRegionDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Region
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {regionForm.id ? "Edit" : "Add"} Region
                    </DialogTitle>
                    <DialogDescription>
                      {regionForm.id
                        ? "Update the region details below."
                        : "Create a new region by filling out the form below."}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleRegionSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="region-entity">Entity</Label>
                        <Select
                          value={regionForm.entity_id}
                          onValueChange={handleRegionEntityChange}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an entity" />
                          </SelectTrigger>
                          <SelectContent>
                            {entities.map((entity) => (
                              <SelectItem key={entity.id} value={entity.id}>
                                {entity.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="region-name">Name</Label>
                        <Input
                          id="region-name"
                          name="name"
                          value={regionForm.name}
                          onChange={handleRegionChange}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="region-description">Description</Label>
                        <Textarea
                          id="region-description"
                          name="description"
                          value={regionForm.description}
                          onChange={handleRegionChange}
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading
                          ? "Saving..."
                          : regionForm.id
                            ? "Update Region"
                            : "Create Region"}
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
                      <TableHead>Entity</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {regions.length > 0 ? (
                      regions.map((region) => (
                        <TableRow key={region.id}>
                          <TableCell className="font-medium">
                            {region.name}
                          </TableCell>
                          <TableCell>{region.entity_name}</TableCell>
                          <TableCell>{region.description}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => editRegion(region)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleDelete("regions", region.id)
                                }
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
                          colSpan={4}
                          className="text-center py-4 text-muted-foreground"
                        >
                          No regions found. Create your first region to get
                          started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Locations</h3>
              <Dialog
                open={locationDialogOpen}
                onOpenChange={setLocationDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Location
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {locationForm.id ? "Edit" : "Add"} Location
                    </DialogTitle>
                    <DialogDescription>
                      {locationForm.id
                        ? "Update the location details below."
                        : "Create a new location by filling out the form below."}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleLocationSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="location-region">Region</Label>
                        <Select
                          value={locationForm.region_id}
                          onValueChange={handleLocationRegionChange}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a region" />
                          </SelectTrigger>
                          <SelectContent>
                            {regions.map((region) => (
                              <SelectItem key={region.id} value={region.id}>
                                {region.name} ({region.entity_name})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="location-name">Name</Label>
                        <Input
                          id="location-name"
                          name="name"
                          value={locationForm.name}
                          onChange={handleLocationChange}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="location-type">Location Type</Label>
                          <Select
                            value={locationForm.location_type}
                            onValueChange={(value) =>
                              setLocationForm((prev) => ({
                                ...prev,
                                location_type: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="headquarters">
                                Headquarters
                              </SelectItem>
                              <SelectItem value="branch">
                                Branch Office
                              </SelectItem>
                              <SelectItem value="satellite">
                                Satellite Office
                              </SelectItem>
                              <SelectItem value="remote">
                                Remote Location
                              </SelectItem>
                              <SelectItem value="warehouse">
                                Warehouse
                              </SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="location-status">Status</Label>
                          <Select
                            value={locationForm.status}
                            onValueChange={(value) =>
                              setLocationForm((prev) => ({
                                ...prev,
                                status: value,
                              }))
                            }
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
                      </div>

                      <div className="grid gap-4">
                        <h3 className="text-sm font-medium">
                          Address Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="location-address">Address</Label>
                            <Input
                              id="location-address"
                              name="address"
                              value={locationForm.address}
                              onChange={handleLocationChange}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="location-city">City</Label>
                            <Input
                              id="location-city"
                              name="city"
                              value={locationForm.city}
                              onChange={handleLocationChange}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="location-state">State</Label>
                            <Input
                              id="location-state"
                              name="state"
                              value={locationForm.state}
                              onChange={handleLocationChange}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="location-zip">ZIP Code</Label>
                            <Input
                              id="location-zip"
                              name="zip_code"
                              value={locationForm.zip_code}
                              onChange={handleLocationChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        <h3 className="text-sm font-medium">
                          Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="location-phone">
                              Location Phone
                            </Label>
                            <Input
                              id="location-phone"
                              name="phone"
                              value={locationForm.phone}
                              onChange={handleLocationChange}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="location-email">
                              Location Email
                            </Label>
                            <Input
                              id="location-email"
                              name="email"
                              type="email"
                              value={locationForm.email}
                              onChange={handleLocationChange}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="primary-contact-name">
                              Primary Contact Name
                            </Label>
                            <Input
                              id="primary-contact-name"
                              name="primary_contact_name"
                              value={locationForm.primary_contact_name}
                              onChange={handleLocationChange}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="primary-contact-email">
                              Primary Contact Email
                            </Label>
                            <Input
                              id="primary-contact-email"
                              name="primary_contact_email"
                              type="email"
                              value={locationForm.primary_contact_email}
                              onChange={handleLocationChange}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="primary-contact-phone">
                              Primary Contact Phone
                            </Label>
                            <Input
                              id="primary-contact-phone"
                              name="primary_contact_phone"
                              value={locationForm.primary_contact_phone}
                              onChange={handleLocationChange}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="hours-of-operation">
                              Hours of Operation
                            </Label>
                            <Input
                              id="hours-of-operation"
                              name="hours_of_operation"
                              value={locationForm.hours_of_operation}
                              onChange={handleLocationChange}
                              placeholder="Mon-Fri: 9am-5pm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="location-ip-ranges">
                          Allowed IP Ranges (comma separated)
                        </Label>
                        <Input
                          id="location-ip-ranges"
                          name="allowed_ip_ranges"
                          value={locationForm.allowed_ip_ranges}
                          onChange={handleLocationChange}
                          placeholder="192.168.1.0/24, 10.0.0.0/8"
                        />
                        <p className="text-xs text-muted-foreground">
                          Enter IP ranges in CIDR notation, separated by commas
                        </p>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="location-notes">Notes</Label>
                        <Textarea
                          id="location-notes"
                          name="notes"
                          value={locationForm.notes}
                          onChange={handleLocationChange}
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading
                          ? "Saving..."
                          : locationForm.id
                            ? "Update Location"
                            : "Create Location"}
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
                      <TableHead>Region</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locations.length > 0 ? (
                      locations.map((location) => (
                        <TableRow key={location.id}>
                          <TableCell className="font-medium">
                            {location.name}
                          </TableCell>
                          <TableCell>{location.region_name}</TableCell>
                          <TableCell>{location.entity_name}</TableCell>
                          <TableCell>
                            {location.address && (
                              <>
                                {location.address}, {location.city},{" "}
                                {location.state} {location.zip_code}
                              </>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => editLocation(location)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleDelete("locations", location.id)
                                }
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
                          colSpan={5}
                          className="text-center py-4 text-muted-foreground"
                        >
                          No locations found. Create your first location to get
                          started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              selected item and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
