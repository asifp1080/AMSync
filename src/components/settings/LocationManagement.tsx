import { useState, useEffect, useRef } from "react";
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
import {
  AlertCircle,
  CheckCircle2,
  Edit,
  Plus,
  Trash2,
  Download,
  Upload,
  Search,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Entity {
  id: string;
  name: string;
  description: string | null;
  entity_type?: string;
  status?: string;
  city?: string;
  state?: string;
  primary_contact_name?: string;
  primary_contact_email?: string;
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
  location_type?: string;
  status?: string;
  primary_contact_name?: string;
  primary_contact_email?: string;
  primary_contact_phone?: string;
  hours_of_operation?: string;
  notes?: string;
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEntities, setFilteredEntities] = useState<Entity[]>([]);
  const [filteredRegions, setFilteredRegions] = useState<Region[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);

  // Entity form state
  const [entityForm, setEntityForm] = useState({
    id: "",
    name: "",
    description: "",
    entity_type: "",
    status: "",
    city: "",
    state: "",
    primary_contact_name: "",
    primary_contact_email: "",
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
    location_type: "",
    status: "",
    primary_contact_name: "",
    primary_contact_email: "",
    primary_contact_phone: "",
    hours_of_operation: "",
    notes: "",
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

  // Filter data when search term changes
  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();

      setFilteredEntities(
        entities.filter(
          (entity) =>
            entity.name.toLowerCase().includes(term) ||
            (entity.description &&
              entity.description.toLowerCase().includes(term)) ||
            (entity.city && entity.city.toLowerCase().includes(term)) ||
            (entity.state && entity.state.toLowerCase().includes(term)),
        ),
      );

      setFilteredRegions(
        regions.filter(
          (region) =>
            region.name.toLowerCase().includes(term) ||
            (region.description &&
              region.description.toLowerCase().includes(term)) ||
            (region.entity_name &&
              region.entity_name.toLowerCase().includes(term)),
        ),
      );

      setFilteredLocations(
        locations.filter(
          (location) =>
            location.name.toLowerCase().includes(term) ||
            (location.address &&
              location.address.toLowerCase().includes(term)) ||
            (location.city && location.city.toLowerCase().includes(term)) ||
            (location.state && location.state.toLowerCase().includes(term)) ||
            (location.region_name &&
              location.region_name.toLowerCase().includes(term)) ||
            (location.entity_name &&
              location.entity_name.toLowerCase().includes(term)),
        ),
      );
    } else {
      setFilteredEntities(entities);
      setFilteredRegions(regions);
      setFilteredLocations(locations);
    }
  }, [searchTerm, entities, regions, locations]);

  const fetchEntities = async () => {
    try {
      const { data, error } = await supabase.from("entities").select("*");
      if (error) throw error;
      setEntities(data || []);
      setFilteredEntities(data || []);
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
      setFilteredRegions(formattedRegions);
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
      setFilteredLocations(formattedLocations);
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
            entity_type: entityForm.entity_type || null,
            status: entityForm.status || null,
            city: entityForm.city || null,
            state: entityForm.state || null,
            primary_contact_name: entityForm.primary_contact_name || null,
            primary_contact_email: entityForm.primary_contact_email || null,
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
          entity_type: entityForm.entity_type || null,
          status: entityForm.status || null,
          city: entityForm.city || null,
          state: entityForm.state || null,
          primary_contact_name: entityForm.primary_contact_name || null,
          primary_contact_email: entityForm.primary_contact_email || null,
        });

        if (error) throw error;
        setSuccessMessage("Entity created successfully");
      }

      // Reset form and refresh data
      setEntityForm({
        id: "",
        name: "",
        description: "",
        entity_type: "",
        status: "",
        city: "",
        state: "",
        primary_contact_name: "",
        primary_contact_email: "",
      });
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
      entity_type: entity.entity_type || "",
      status: entity.status || "",
      city: entity.city || "",
      state: entity.state || "",
      primary_contact_name: entity.primary_contact_name || "",
      primary_contact_email: entity.primary_contact_email || "",
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
            location_type: locationForm.location_type || null,
            status: locationForm.status || null,
            primary_contact_name: locationForm.primary_contact_name || null,
            primary_contact_email: locationForm.primary_contact_email || null,
            primary_contact_phone: locationForm.primary_contact_phone || null,
            hours_of_operation: locationForm.hours_of_operation || null,
            notes: locationForm.notes || null,
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
        location_type: "",
        status: "",
        primary_contact_name: "",
        primary_contact_email: "",
        primary_contact_phone: "",
        hours_of_operation: "",
        notes: "",
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
      location_type: location.location_type || "",
      status: location.status || "",
      primary_contact_name: location.primary_contact_name || "",
      primary_contact_email: location.primary_contact_email || "",
      primary_contact_phone: location.primary_contact_phone || "",
      hours_of_operation: location.hours_of_operation || "",
      notes: location.notes || "",
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

  // CSV Download Functions
  const handleDownloadEntities = () => {
    try {
      // Convert entities to CSV format
      const headers = [
        "name",
        "description",
        "entity_type",
        "status",
        "city",
        "state",
        "primary_contact_name",
        "primary_contact_email",
      ];
      const csvContent = [
        headers.join(","),
        ...entities.map((entity) => {
          return [
            entity.name,
            entity.description || "",
            entity.entity_type || "",
            entity.status || "",
            entity.city || "",
            entity.state || "",
            entity.primary_contact_name || "",
            entity.primary_contact_email || "",
          ]
            .map((value) => `"${String(value).replace(/"/g, '""')}"`)
            .join(",");
        }),
      ].join("\n");

      // Create and download the CSV file
      downloadCSV(csvContent, "entities.csv");
      setSuccessMessage("Entities exported successfully");
    } catch (error) {
      console.error("Error exporting entities:", error);
      setErrorMessage("Failed to export entities");
    }
  };

  const handleDownloadRegions = () => {
    try {
      // Convert regions to CSV format
      const headers = ["name", "description", "entity_id"];
      const csvContent = [
        headers.join(","),
        ...regions.map((region) => {
          return [region.name, region.description || "", region.entity_id]
            .map((value) => `"${String(value).replace(/"/g, '""')}"`)
            .join(",");
        }),
      ].join("\n");

      // Create and download the CSV file
      downloadCSV(csvContent, "regions.csv");
      setSuccessMessage("Regions exported successfully");
    } catch (error) {
      console.error("Error exporting regions:", error);
      setErrorMessage("Failed to export regions");
    }
  };

  const handleDownloadLocations = () => {
    try {
      // Convert locations to CSV format
      const headers = [
        "name",
        "region_id",
        "address",
        "city",
        "state",
        "zip_code",
        "phone",
        "email",
        "allowed_ip_ranges",
        "location_type",
        "status",
      ];
      const csvContent = [
        headers.join(","),
        ...locations.map((location) => {
          return [
            location.name,
            location.region_id,
            location.address || "",
            location.city || "",
            location.state || "",
            location.zip_code || "",
            location.phone || "",
            location.email || "",
            location.allowed_ip_ranges
              ? location.allowed_ip_ranges.join(";")
              : "",
            location.location_type || "",
            location.status || "",
          ]
            .map((value) => `"${String(value).replace(/"/g, '""')}"`)
            .join(",");
        }),
      ].join("\n");

      // Create and download the CSV file
      downloadCSV(csvContent, "locations.csv");
      setSuccessMessage("Locations exported successfully");
    } catch (error) {
      console.error("Error exporting locations:", error);
      setErrorMessage("Failed to export locations");
    }
  };

  const downloadCSV = (csvContent: string, fileName: string) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Upload Functions
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setSuccessMessage(null);
      setErrorMessage(null);

      const text = await readFileAsText(file);
      const { data, headers } = parseCSV(text);

      // Determine if this is an entity or location CSV based on headers
      if (headers.includes("entity_id") && headers.includes("region_id")) {
        await processLocationCSV(data, headers);
      } else if (headers.includes("entity_type")) {
        await processEntityCSV(data, headers);
      } else if (
        headers.includes("entity_id") &&
        !headers.includes("region_id")
      ) {
        await processRegionCSV(data, headers);
      } else {
        throw new Error("Unknown CSV format. Please check your file format.");
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSuccessMessage("Data imported successfully");
      fetchEntities();
      fetchRegions();
      fetchLocations();
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorMessage(
        `Failed to import data: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsUploading(false);
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  const parseCSV = (text: string) => {
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const headers = lines[0].split(",").map(
      (header) => header.trim().replace(/^"|"$/g, ""), // Remove quotes from headers
    );

    const data = lines.slice(1).map((line) => {
      // Handle quoted fields with commas inside them
      const values: string[] = [];
      let inQuotes = false;
      let currentValue = "";

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          if (i + 1 < line.length && line[i + 1] === '"') {
            // Handle escaped quotes
            currentValue += '"';
            i++; // Skip the next quote
          } else {
            // Toggle quote state
            inQuotes = !inQuotes;
          }
        } else if (char === "," && !inQuotes) {
          // End of field
          values.push(currentValue);
          currentValue = "";
        } else {
          currentValue += char;
        }
      }

      // Add the last value
      values.push(currentValue);

      // Create an object with header keys and values
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });

      return row;
    });

    return { headers, data };
  };

  const processEntityCSV = async (
    data: Record<string, string>[],
    headers: string[],
  ) => {
    const totalRows = data.length;
    let processedRows = 0;

    for (const row of data) {
      try {
        // Check if entity with same name exists
        const { data: existingEntities } = await supabase
          .from("entities")
          .select("id")
          .eq("name", row.name);

        if (existingEntities && existingEntities.length > 0) {
          // Update existing entity
          await supabase
            .from("entities")
            .update({
              name: row.name,
              description: row.description || null,
              entity_type: row.entity_type || "other",
              status: row.status || "active",
              city: row.city || null,
              state: row.state || null,
              primary_contact_name: row.primary_contact_name || null,
              primary_contact_email: row.primary_contact_email || null,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingEntities[0].id);
        } else {
          // Create new entity
          await supabase.from("entities").insert({
            name: row.name,
            description: row.description || null,
            entity_type: row.entity_type || "other",
            status: row.status || "active",
            city: row.city || null,
            state: row.state || null,
            primary_contact_name: row.primary_contact_name || null,
            primary_contact_email: row.primary_contact_email || null,
          });
        }

        processedRows++;
        setUploadProgress(Math.round((processedRows / totalRows) * 100));
      } catch (error) {
        console.error(`Error processing entity row:`, row, error);
        // Continue with next row
      }
    }
  };

  const processRegionCSV = async (
    data: Record<string, string>[],
    headers: string[],
  ) => {
    const totalRows = data.length;
    let processedRows = 0;

    for (const row of data) {
      try {
        if (!row.entity_id) {
          console.warn("Skipping row without entity_id:", row);
          continue;
        }

        // Check if region with same name exists
        const { data: existingRegions } = await supabase
          .from("regions")
          .select("id")
          .eq("name", row.name)
          .eq("entity_id", row.entity_id);

        if (existingRegions && existingRegions.length > 0) {
          // Update existing region
          await supabase
            .from("regions")
            .update({
              name: row.name,
              description: row.description || null,
              entity_id: row.entity_id,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingRegions[0].id);
        } else {
          // Create new region
          await supabase.from("regions").insert({
            name: row.name,
            description: row.description || null,
            entity_id: row.entity_id,
          });
        }

        processedRows++;
        setUploadProgress(Math.round((processedRows / totalRows) * 100));
      } catch (error) {
        console.error(`Error processing region row:`, row, error);
        // Continue with next row
      }
    }
  };

  const processLocationCSV = async (
    data: Record<string, string>[],
    headers: string[],
  ) => {
    const totalRows = data.length;
    let processedRows = 0;

    for (const row of data) {
      try {
        if (!row.region_id) {
          console.warn("Skipping row without region_id:", row);
          continue;
        }

        // Get entity_id from region
        const { data: regionData } = await supabase
          .from("regions")
          .select("entity_id")
          .eq("id", row.region_id)
          .single();

        if (!regionData) {
          console.warn(
            `Region with ID ${row.region_id} not found, skipping location:`,
            row,
          );
          continue;
        }

        // Parse IP ranges if present
        let ipRanges = null;
        if (row.allowed_ip_ranges) {
          ipRanges = row.allowed_ip_ranges.split(";").map((ip) => ip.trim());
        }

        // Check if location with same name exists
        const { data: existingLocations } = await supabase
          .from("locations")
          .select("id")
          .eq("name", row.name)
          .eq("region_id", row.region_id);

        if (existingLocations && existingLocations.length > 0) {
          // Update existing location
          await supabase
            .from("locations")
            .update({
              name: row.name,
              region_id: row.region_id,
              entity_id: regionData.entity_id,
              address: row.address || null,
              city: row.city || null,
              state: row.state || null,
              zip_code: row.zip_code || null,
              phone: row.phone || null,
              email: row.email || null,
              allowed_ip_ranges: ipRanges,
              location_type: row.location_type || null,
              status: row.status || "active",
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingLocations[0].id);
        } else {
          // Create new location
          await supabase.from("locations").insert({
            name: row.name,
            region_id: row.region_id,
            entity_id: regionData.entity_id,
            address: row.address || null,
            city: row.city || null,
            state: row.state || null,
            zip_code: row.zip_code || null,
            phone: row.phone || null,
            email: row.email || null,
            allowed_ip_ranges: ipRanges,
            location_type: row.location_type || null,
            status: row.status || "active",
          });
        }

        processedRows++;
        setUploadProgress(Math.round((processedRows / totalRows) * 100));
      } catch (error) {
        console.error(`Error processing location row:`, row, error);
        // Continue with next row
      }
    }
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

      {isUploading && (
        <Alert className="bg-blue-50 border-blue-200 text-blue-800">
          <div className="flex flex-col w-full">
            <div className="flex items-center">
              <Upload className="h-4 w-4 text-blue-600 mr-2" />
              <AlertDescription>
                Uploading data... {uploadProgress}%
              </AlertDescription>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        </Alert>
      )}

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search entities, regions, or locations..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

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
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleDownloadEntities}
                >
                  <Download className="h-4 w-4" /> Export CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" /> Import CSV
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileUpload}
                />
                <Dialog
                  open={entityDialogOpen}
                  onOpenChange={setEntityDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" /> Add Entity
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntities.length > 0 ? (
                      filteredEntities.map((entity) => (
                        <TableRow key={entity.id}>
                          <TableCell className="font-medium">
                            {entity.name}
                          </TableCell>
                          <TableCell>{entity.entity_type || "N/A"}</TableCell>
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
                          colSpan={6}
                          className="text-center py-4 text-muted-foreground"
                        >
                          {searchTerm
                            ? "No matching entities found."
                            : "No entities found. Create your first entity to get started."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Entity Dialog Content */}
            <Dialog open={entityDialogOpen} onOpenChange={setEntityDialogOpen}>
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
          </TabsContent>

          {/* Regions Tab */}
          <TabsContent value="regions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Regions</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleDownloadRegions}
                >
                  <Download className="h-4 w-4" /> Export CSV
                </Button>
                <Dialog
                  open={regionDialogOpen}
                  onOpenChange={setRegionDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" /> Add Region
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
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
                    {filteredRegions.length > 0 ? (
                      filteredRegions.map((region) => (
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
                          {searchTerm
                            ? "No matching regions found."
                            : "No regions found. Create your first region to get started."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Region Dialog Content */}
            <Dialog open={regionDialogOpen} onOpenChange={setRegionDialogOpen}>
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
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Locations</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleDownloadLocations}
                >
                  <Download className="h-4 w-4" /> Export CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" /> Import CSV
                </Button>
                <Dialog
                  open={locationDialogOpen}
                  onOpenChange={setLocationDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" /> Add Location
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
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
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map((location) => (
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
                          {searchTerm
                            ? "No matching locations found."
                            : "No locations found. Create your first location to get started."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Location Dialog Content */}
            <Dialog
              open={locationDialogOpen}
              onOpenChange={setLocationDialogOpen}
            >
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
                            <SelectItem value="warehouse">Warehouse</SelectItem>
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
                          <Label htmlFor="location-phone">Location Phone</Label>
                          <Input
                            id="location-phone"
                            name="phone"
                            value={locationForm.phone}
                            onChange={handleLocationChange}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="location-email">Location Email</Label>
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
