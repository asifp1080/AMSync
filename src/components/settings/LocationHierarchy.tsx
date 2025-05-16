import React, { useState, useEffect, useRef } from "react";
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
import { Alert, AlertDescription } from "../ui/alert";
import {
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function LocationHierarchy() {
  // Note: This component is being updated to reflect the new hierarchy: Organization → Entity → Location
  const [entities, setEntities] = useState([]);
  const [locations, setLocations] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Entity form state
  const [entityForm, setEntityForm] = useState({
    id: "",
    name: "",
    description: "",
    organization_id: "",
    entity_type: "LLC", // Default value for required field
    ein: "",
    license_number: "",
    license_expiration_date: "",
    status: "Active",
    gl_policy_number: "",
    gl_liability_coverage: "",
    gl_policy_expiration_date: "",
    e_and_o_policy_number: "",
    e_and_o_liability_coverage: "",
    e_and_o_policy_expiration_date: "",
  });

  // Location form state
  const [locationForm, setLocationForm] = useState({
    id: "",
    name: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    phone: "",
    email: "",
    entity_id: "",
    location_type: "",
    address_line_1: "",
    address_line_2: "",
    country: "",
    primary_contact_name: "",
    primary_contact_email: "",
    primary_contact_phone: "",
    hours_of_operation: "",
    notes: "",
    time_zone: "",
    status: "Active",
    stripe_location_account_id: "",
  });

  // Group form state
  const [groupForm, setGroupForm] = useState({
    id: "",
    name: "",
    description: "",
  });

  // Dialog states
  const [entityDialogOpen, setEntityDialogOpen] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch entities
        const { data: entitiesData, error: entitiesError } = await supabase
          .from("entities")
          .select("*");
        if (entitiesError) throw entitiesError;
        setEntities(entitiesData || []);

        // Fetch locations
        const { data: locationsData, error: locationsError } = await supabase
          .from("locations")
          .select("*, entities(name)");
        if (locationsError) throw locationsError;
        setLocations(locationsData || []);

        // Fetch groups
        const { data: groupsData, error: groupsError } = await supabase
          .from("groups")
          .select("*");
        if (groupsError) throw groupsError;
        setGroups(groupsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle entity form changes
  const handleEntityChange = (e) => {
    const { name, value } = e.target;
    setEntityForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle location form changes
  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocationForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle group form changes
  const handleGroupChange = (e) => {
    const { name, value } = e.target;
    setGroupForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle entity form submission
  const handleEntitySubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare entity data with all fields
      const entityData = {
        name: entityForm.name,
        description: entityForm.description || null,
        organization_id: entityForm.organization_id || null,
        entity_type: entityForm.entity_type || "LLC",
        ein: entityForm.ein || null,
        license_number: entityForm.license_number || null,
        license_expiration_date: entityForm.license_expiration_date || null,
        status: entityForm.status || "Active",
        gl_policy_number: entityForm.gl_policy_number || null,
        gl_liability_coverage: entityForm.gl_liability_coverage || null,
        gl_policy_expiration_date: entityForm.gl_policy_expiration_date || null,
        e_and_o_policy_number: entityForm.e_and_o_policy_number || null,
        e_and_o_liability_coverage:
          entityForm.e_and_o_liability_coverage || null,
        e_and_o_policy_expiration_date:
          entityForm.e_and_o_policy_expiration_date || null,
      };

      if (entityForm.id) {
        // Update entity
        const { error } = await supabase
          .from("entities")
          .update(entityData)
          .eq("id", entityForm.id);

        if (error) {
          console.error("Error updating entity:", error);
          throw error;
        }
      } else {
        // Create entity
        const { error } = await supabase.from("entities").insert(entityData);

        if (error) {
          console.error("Error creating entity:", error);
          throw error;
        }
      }

      // Reset form and close dialog
      setEntityForm({
        id: "",
        name: "",
        description: "",
        organization_id: "",
        entity_type: "LLC",
        ein: "",
        license_number: "",
        license_expiration_date: "",
        status: "Active",
        gl_policy_number: "",
        gl_liability_coverage: "",
        gl_policy_expiration_date: "",
        e_and_o_policy_number: "",
        e_and_o_liability_coverage: "",
        e_and_o_policy_expiration_date: "",
      });
      setEntityDialogOpen(false);
      setSuccessMessage(
        entityForm.id
          ? "Entity updated successfully"
          : "Entity created successfully",
      );

      // Refresh entities
      const { data } = await supabase.from("entities").select("*");
      setEntities(data || []);
    } catch (error) {
      console.error("Error saving entity:", error);
      setErrorMessage(
        `Error saving entity: ${error.message || "Unknown error"}`,
      );
    }
  };

  // Handle location form submission
  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare location data with all fields
      const locationData = {
        name: locationForm.name,
        address: locationForm.address || null,
        city: locationForm.city || null,
        state: locationForm.state || null,
        zip_code: locationForm.zip_code || null,
        phone: locationForm.phone || null,
        email: locationForm.email || null,
        entity_id: locationForm.entity_id || null,
        location_type: locationForm.location_type || null,
        address_line_1: locationForm.address_line_1 || null,
        address_line_2: locationForm.address_line_2 || null,
        country: locationForm.country || null,
        primary_contact_name: locationForm.primary_contact_name || null,
        primary_contact_email: locationForm.primary_contact_email || null,
        primary_contact_phone: locationForm.primary_contact_phone || null,
        hours_of_operation: locationForm.hours_of_operation || null,
        notes: locationForm.notes || null,
        time_zone: locationForm.time_zone || null,
        status: locationForm.status || "Active",
        stripe_location_account_id:
          locationForm.stripe_location_account_id || null,
      };

      if (locationForm.id) {
        // Update location
        const { error } = await supabase
          .from("locations")
          .update(locationData)
          .eq("id", locationForm.id);

        if (error) {
          console.error("Error updating location:", error);
          throw error;
        }
      } else {
        // Create location
        const { error } = await supabase.from("locations").insert(locationData);

        if (error) {
          console.error("Error creating location:", error);
          throw error;
        }
      }

      // Reset form and close dialog
      setLocationForm({
        id: "",
        name: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        phone: "",
        email: "",
        entity_id: "",
        location_type: "",
        address_line_1: "",
        address_line_2: "",
        country: "",
        primary_contact_name: "",
        primary_contact_email: "",
        primary_contact_phone: "",
        hours_of_operation: "",
        notes: "",
        time_zone: "",
        status: "Active",
        stripe_location_account_id: "",
      });
      setLocationDialogOpen(false);
      setSuccessMessage(
        locationForm.id
          ? "Location updated successfully"
          : "Location created successfully",
      );

      // Refresh locations
      const { data } = await supabase
        .from("locations")
        .select("*, entities(name)");
      setLocations(data || []);
    } catch (error) {
      console.error("Error saving location:", error);
      setErrorMessage(
        `Error saving location: ${error.message || "Unknown error"}`,
      );
    }
  };

  // Handle group form submission
  const handleGroupSubmit = async (e) => {
    e.preventDefault();
    try {
      if (groupForm.id) {
        // Update group
        const { error } = await supabase
          .from("groups")
          .update({
            name: groupForm.name,
            description: groupForm.description || null,
          })
          .eq("id", groupForm.id);

        if (error) {
          console.error("Error updating group:", error);
          throw error;
        }
      } else {
        // Create group
        const { error } = await supabase.from("groups").insert({
          name: groupForm.name,
          description: groupForm.description || null,
        });

        if (error) {
          console.error("Error creating group:", error);
          throw error;
        }
      }

      // Reset form and close dialog
      setGroupForm({ id: "", name: "", description: "" });
      setGroupDialogOpen(false);
      setSuccessMessage(
        groupForm.id
          ? "Group updated successfully"
          : "Group created successfully",
      );

      // Refresh groups
      const { data } = await supabase.from("groups").select("*");
      setGroups(data || []);
    } catch (error) {
      console.error("Error saving group:", error);
      setErrorMessage(
        `Error saving group: ${error.message || "Unknown error"}`,
      );
    }
  };

  // Edit entity
  const editEntity = (entity) => {
    setEntityForm({
      id: entity.id,
      name: entity.name,
      description: entity.description || "",
      organization_id: entity.organization_id || "",
      entity_type: entity.entity_type || "LLC",
      ein: entity.ein || "",
      license_number: entity.license_number || "",
      license_expiration_date: entity.license_expiration_date || "",
      status: entity.status || "Active",
      gl_policy_number: entity.gl_policy_number || "",
      gl_liability_coverage: entity.gl_liability_coverage || "",
      gl_policy_expiration_date: entity.gl_policy_expiration_date || "",
      e_and_o_policy_number: entity.e_and_o_policy_number || "",
      e_and_o_liability_coverage: entity.e_and_o_liability_coverage || "",
      e_and_o_policy_expiration_date:
        entity.e_and_o_policy_expiration_date || "",
    });
    setEntityDialogOpen(true);
  };

  // Edit location
  const editLocation = (location) => {
    setLocationForm({
      id: location.id,
      name: location.name,
      address: location.address || "",
      city: location.city || "",
      state: location.state || "",
      zip_code: location.zip_code || "",
      phone: location.phone || "",
      email: location.email || "",
      entity_id: location.entity_id || "",
      location_type: location.location_type || "",
      address_line_1: location.address_line_1 || "",
      address_line_2: location.address_line_2 || "",
      country: location.country || "",
      primary_contact_name: location.primary_contact_name || "",
      primary_contact_email: location.primary_contact_email || "",
      primary_contact_phone: location.primary_contact_phone || "",
      hours_of_operation: location.hours_of_operation || "",
      notes: location.notes || "",
      time_zone: location.time_zone || "",
      status: location.status || "Active",
      stripe_location_account_id: location.stripe_location_account_id || "",
    });
    setLocationDialogOpen(true);
  };

  // Edit group
  const editGroup = (group) => {
    setGroupForm({
      id: group.id,
      name: group.name,
      description: group.description || "",
    });
    setGroupDialogOpen(true);
  };

  // Delete entity
  const deleteEntity = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entity?")) return;

    try {
      await supabase.from("entities").delete().eq("id", id);
      setEntities(entities.filter((entity) => entity.id !== id));
    } catch (error) {
      console.error("Error deleting entity:", error);
    }
  };

  // Delete location
  const deleteLocation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this location?"))
      return;

    try {
      await supabase.from("locations").delete().eq("id", id);
      setLocations(locations.filter((location) => location.id !== id));
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  // Delete group
  const deleteGroup = async (id) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;

    try {
      await supabase.from("groups").delete().eq("id", id);
      setGroups(groups.filter((group) => group.id !== id));
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  // CSV Download Functions
  const handleDownloadEntities = () => {
    try {
      // Convert entities to CSV format
      const headers = ["name", "description", "organization_id"];
      const csvContent = [
        headers.join(","),
        ...entities.map((entity) => {
          return [
            entity.name,
            entity.description || "",
            entity.organization_id || "",
            entity.entity_type || "",
            entity.ein || "",
            entity.license_number || "",
            entity.license_expiration_date || "",
            entity.status || "",
            entity.gl_policy_number || "",
            entity.gl_liability_coverage || "",
            entity.gl_policy_expiration_date || "",
            entity.e_and_o_policy_number || "",
            entity.e_and_o_liability_coverage || "",
            entity.e_and_o_policy_expiration_date || "",
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

  const handleDownloadLocations = () => {
    try {
      // Convert locations to CSV format
      const headers = [
        "name",
        "entity_id",
        "address",
        "city",
        "state",
        "zip_code",
        "phone",
        "email",
      ];
      const csvContent = [
        headers.join(","),
        ...locations.map((location) => {
          return [
            location.name,
            location.entity_id || "",
            location.address || "",
            location.city || "",
            location.state || "",
            location.zip_code || "",
            location.phone || "",
            location.email || "",
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

  const handleDownloadGroups = () => {
    try {
      // Convert groups to CSV format
      const headers = ["name", "description"];
      const csvContent = [
        headers.join(","),
        ...groups.map((group) => {
          return [group.name, group.description || ""]
            .map((value) => `"${String(value).replace(/"/g, '""')}"`)
            .join(",");
        }),
      ].join("\n");

      // Create and download the CSV file
      downloadCSV(csvContent, "groups.csv");
      setSuccessMessage("Groups exported successfully");
    } catch (error) {
      console.error("Error exporting groups:", error);
      setErrorMessage("Failed to export groups");
    }
  };

  const downloadCSV = (csvContent, fileName) => {
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
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setSuccessMessage(null);
      setErrorMessage(null);

      const text = await readFileAsText(file);
      const { data, headers } = parseCSV(text);

      if (data.length === 0) {
        throw new Error(
          "CSV file appears to be empty or improperly formatted.",
        );
      }

      // More robust detection of CSV type based on headers
      // Check for location-specific fields
      if (
        headers.includes("entity_id") ||
        headers.includes("address") ||
        headers.includes("city") ||
        headers.includes("zip_code")
      ) {
        await processLocationCSV(data, headers);
        setSuccessMessage(
          "Location data imported successfully with full schema support",
        );
      }
      // Check for entity-specific fields
      else if (
        headers.includes("organization_id") ||
        (headers.includes("name") &&
          !headers.includes("address") &&
          headers.length > 2)
      ) {
        await processEntityCSV(data, headers);
        setSuccessMessage(
          "Entity data imported successfully with full schema support",
        );
      }
      // Check for group data (simplest schema)
      else if (
        headers.includes("name") &&
        headers.includes("description") &&
        headers.length <= 3
      ) {
        await processGroupCSV(data, headers);
        setSuccessMessage("Group data imported successfully");
      } else {
        throw new Error(
          "Unknown CSV format. Please check your file format and ensure it contains the required headers.",
        );
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Refresh data
      const fetchData = async () => {
        try {
          // Fetch entities
          const { data: entitiesData } = await supabase
            .from("entities")
            .select("*");
          setEntities(entitiesData || []);

          // Fetch locations
          const { data: locationsData } = await supabase
            .from("locations")
            .select("*, entities(name)");
          setLocations(locationsData || []);

          // Fetch groups
          const { data: groupsData } = await supabase
            .from("groups")
            .select("*");
          setGroups(groupsData || []);
        } catch (error) {
          console.error("Error refreshing data:", error);
        }
      };
      fetchData();
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorMessage(
        `Failed to import data: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsUploading(false);
    }
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  const parseCSV = (text) => {
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const headers = lines[0].split(",").map(
      (header) => header.trim().replace(/^"|"$/g, ""), // Remove quotes from headers
    );

    const data = lines.slice(1).map((line) => {
      // Handle quoted fields with commas inside them
      const values = [];
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
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });

      return row;
    });

    return { headers, data };
  };

  const processEntityCSV = async (data, headers) => {
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
              organization_id: row.organization_id || null,
              entity_type: row.entity_type || "LLC",
            })
            .eq("id", existingEntities[0].id);
        } else {
          // Create new entity
          await supabase.from("entities").insert({
            name: row.name,
            description: row.description || null,
            organization_id: row.organization_id || null,
            entity_type: row.entity_type || "LLC",
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

  const processLocationCSV = async (data, headers) => {
    const totalRows = data.length;
    let processedRows = 0;

    for (const row of data) {
      try {
        // Check if location with same name exists
        const { data: existingLocations } = await supabase
          .from("locations")
          .select("id")
          .eq("name", row.name);

        if (existingLocations && existingLocations.length > 0) {
          // Update existing location
          await supabase
            .from("locations")
            .update({
              name: row.name,
              address: row.address || null,
              city: row.city || null,
              state: row.state || null,
              zip_code: row.zip_code || null,
              phone: row.phone || null,
              email: row.email || null,
              entity_id: row.entity_id || null,
              country: row.country || null,
              status: row.status || "Active",
              operating_hours: row.operating_hours || null,
              website: row.website || null,
              stripe_location_account_id:
                row.stripe_location_account_id || null,
            })
            .eq("id", existingLocations[0].id);
        } else {
          // Create new location
          await supabase.from("locations").insert({
            name: row.name,
            address: row.address || null,
            city: row.city || null,
            state: row.state || null,
            zip_code: row.zip_code || null,
            phone: row.phone || null,
            email: row.email || null,
            entity_id: row.entity_id || null,
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

  const processGroupCSV = async (data, headers) => {
    const totalRows = data.length;
    let processedRows = 0;

    for (const row of data) {
      try {
        // Check if group with same name exists
        const { data: existingGroups } = await supabase
          .from("groups")
          .select("id")
          .eq("name", row.name);

        if (existingGroups && existingGroups.length > 0) {
          // Update existing group
          await supabase
            .from("groups")
            .update({
              name: row.name,
              description: row.description || null,
            })
            .eq("id", existingGroups[0].id);
        } else {
          // Create new group
          await supabase.from("groups").insert({
            name: row.name,
            description: row.description || null,
          });
        }

        processedRows++;
        setUploadProgress(Math.round((processedRows / totalRows) * 100));
      } catch (error) {
        console.error(`Error processing group row:`, row, error);
        // Continue with next row
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {successMessage && (
        <Alert className="bg-green-50 border-green-200 text-green-800 mb-4">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert className="bg-red-50 border-red-200 text-red-800 mb-4">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {isUploading && (
        <Alert className="bg-blue-50 border-blue-200 text-blue-800 mb-4">
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

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".csv"
        onChange={handleFileUpload}
      />

      <Tabs defaultValue="entities">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="entities">Entities</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="organizations" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Organizations</h3>
            <p className="text-sm text-muted-foreground">
              Manage organizations in the Organizations tab
            </p>
          </div>
        </TabsContent>

        <TabsContent value="entities" className="mt-6">
          <div className="flex justify-between items-center mb-4">
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
              <Dialog
                open={entityDialogOpen}
                onOpenChange={setEntityDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Entity
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {entityForm.id ? "Edit Entity" : "Add Entity"}
                    </DialogTitle>
                    <DialogDescription>
                      {entityForm.id
                        ? "Update entity information"
                        : "Create a new entity"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleEntitySubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={entityForm.name}
                          onChange={handleEntityChange}
                          className="col-span-3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={entityForm.description}
                          onChange={handleEntityChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="organization_id" className="text-right">
                          Organization ID
                        </Label>
                        <Input
                          id="organization_id"
                          name="organization_id"
                          value={entityForm.organization_id}
                          onChange={handleEntityChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="entity_type" className="text-right">
                          Legal Entity Type
                        </Label>
                        <Select
                          value={entityForm.entity_type}
                          onValueChange={(value) =>
                            setEntityForm((prev) => ({
                              ...prev,
                              entity_type: value,
                            }))
                          }
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select entity type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="LLC">LLC</SelectItem>
                            <SelectItem value="C-Corp">C-Corp</SelectItem>
                            <SelectItem value="S-Corp">S-Corp</SelectItem>
                            <SelectItem value="Inc">Inc</SelectItem>
                            <SelectItem value="Sole Proprietorship">
                              Sole Proprietorship
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="ein" className="text-right">
                          EIN
                        </Label>
                        <Input
                          id="ein"
                          name="ein"
                          value={entityForm.ein}
                          onChange={handleEntityChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="license_number" className="text-right">
                          License Number
                        </Label>
                        <Input
                          id="license_number"
                          name="license_number"
                          value={entityForm.license_number}
                          onChange={handleEntityChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="license_expiration_date"
                          className="text-right"
                        >
                          License Expiration Date
                        </Label>
                        <Input
                          id="license_expiration_date"
                          name="license_expiration_date"
                          type="date"
                          value={entityForm.license_expiration_date}
                          onChange={handleEntityChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                          Status
                        </Label>
                        <Select
                          value={entityForm.status}
                          onValueChange={(value) =>
                            setEntityForm((prev) => ({
                              ...prev,
                              status: value,
                            }))
                          }
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="gl_policy_number"
                          className="text-right"
                        >
                          GL Policy Number
                        </Label>
                        <Input
                          id="gl_policy_number"
                          name="gl_policy_number"
                          value={entityForm.gl_policy_number}
                          onChange={handleEntityChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="gl_liability_coverage"
                          className="text-right"
                        >
                          GL Liability Coverage
                        </Label>
                        <Input
                          id="gl_liability_coverage"
                          name="gl_liability_coverage"
                          value={entityForm.gl_liability_coverage}
                          onChange={handleEntityChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="gl_policy_expiration_date"
                          className="text-right"
                        >
                          GL Policy Expiration Date
                        </Label>
                        <Input
                          id="gl_policy_expiration_date"
                          name="gl_policy_expiration_date"
                          type="date"
                          value={entityForm.gl_policy_expiration_date}
                          onChange={handleEntityChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="e_and_o_policy_number"
                          className="text-right"
                        >
                          E&O Policy Number
                        </Label>
                        <Input
                          id="e_and_o_policy_number"
                          name="e_and_o_policy_number"
                          value={entityForm.e_and_o_policy_number}
                          onChange={handleEntityChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="e_and_o_liability_coverage"
                          className="text-right"
                        >
                          E&O Liability Coverage
                        </Label>
                        <Input
                          id="e_and_o_liability_coverage"
                          name="e_and_o_liability_coverage"
                          value={entityForm.e_and_o_liability_coverage}
                          onChange={handleEntityChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="e_and_o_policy_expiration_date"
                          className="text-right"
                        >
                          E&O Policy Expiration Date
                        </Label>
                        <Input
                          id="e_and_o_policy_expiration_date"
                          name="e_and_o_policy_expiration_date"
                          type="date"
                          value={entityForm.e_and_o_policy_expiration_date}
                          onChange={handleEntityChange}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">
                        {entityForm.id ? "Update" : "Create"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Organization</TableHead>
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
                      <TableCell>{entity.description || "N/A"}</TableCell>
                      <TableCell>{entity.organization_id || "N/A"}</TableCell>
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
                            onClick={() => deleteEntity(entity.id)}
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
                      No entities found. Create your first entity to get
                      started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="locations" className="mt-6">
          <div className="flex justify-between items-center mb-4">
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
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {locationForm.id ? "Edit Location" : "Add Location"}
                    </DialogTitle>
                    <DialogDescription>
                      {locationForm.id
                        ? "Update location information"
                        : "Create a new location"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleLocationSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={locationForm.name}
                          onChange={handleLocationChange}
                          className="col-span-3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="entity_id" className="text-right">
                          Entity
                        </Label>
                        <Select
                          value={locationForm.entity_id}
                          onValueChange={(value) =>
                            setLocationForm((prev) => ({
                              ...prev,
                              entity_id: value,
                            }))
                          }
                        >
                          <SelectTrigger className="col-span-3">
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
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="location_type" className="text-right">
                          Location Type
                        </Label>
                        <Select
                          value={locationForm.location_type}
                          onValueChange={(value) =>
                            setLocationForm((prev) => ({
                              ...prev,
                              location_type: value,
                            }))
                          }
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select location type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Office">Office</SelectItem>
                            <SelectItem value="Branch">Branch</SelectItem>
                            <SelectItem value="Headquarters">
                              Headquarters
                            </SelectItem>
                            <SelectItem value="Remote">Remote</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-right">
                          Address
                        </Label>
                        <Input
                          id="address"
                          name="address"
                          value={locationForm.address}
                          onChange={handleLocationChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address_line_1" className="text-right">
                          Address Line 1
                        </Label>
                        <Input
                          id="address_line_1"
                          name="address_line_1"
                          value={locationForm.address_line_1}
                          onChange={handleLocationChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address_line_2" className="text-right">
                          Address Line 2
                        </Label>
                        <Input
                          id="address_line_2"
                          name="address_line_2"
                          value={locationForm.address_line_2}
                          onChange={handleLocationChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="city" className="text-right">
                          City
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          value={locationForm.city}
                          onChange={handleLocationChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="state" className="text-right">
                          State
                        </Label>
                        <Input
                          id="state"
                          name="state"
                          value={locationForm.state}
                          onChange={handleLocationChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="zip_code" className="text-right">
                          ZIP Code
                        </Label>
                        <Input
                          id="zip_code"
                          name="zip_code"
                          value={locationForm.zip_code}
                          onChange={handleLocationChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="country" className="text-right">
                          Country
                        </Label>
                        <Input
                          id="country"
                          name="country"
                          value={locationForm.country}
                          onChange={handleLocationChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={locationForm.phone}
                          onChange={handleLocationChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          value={locationForm.email}
                          onChange={handleLocationChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="primary_contact_name"
                          className="text-right"
                        >
                          Primary Contact Name
                        </Label>
                        <Input
                          id="primary_contact_name"
                          name="primary_contact_name"
                          value={locationForm.primary_contact_name}
                          onChange={handleLocationChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="primary_contact_email"
                          className="text-right"
                        >
                          Primary Contact Email
                        </Label>
                        <Input
                          id="primary_contact_email"
                          name="primary_contact_email"
                          value={locationForm.primary_contact_email}
                          onChange={handleLocationChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="primary_contact_phone"
                          className="text-right"
                        >
                          Primary Contact Phone
                        </Label>
                        <Input
                          id="primary_contact_phone"
                          name="primary_contact_phone"
                          value={locationForm.primary_contact_phone}
                          onChange={handleLocationChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="hours_of_operation"
                          className="text-right"
                        >
                          Hours of Operation
                        </Label>
                        <Input
                          id="hours_of_operation"
                          name="hours_of_operation"
                          value={locationForm.hours_of_operation}
                          onChange={handleLocationChange}
                          className="col-span-3"
                          placeholder="e.g., Mon-Fri 9am-5pm"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="notes" className="text-right">
                          Notes
                        </Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={locationForm.notes}
                          onChange={handleLocationChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time_zone" className="text-right">
                          Time Zone
                        </Label>
                        <Input
                          id="time_zone"
                          name="time_zone"
                          value={locationForm.time_zone}
                          onChange={handleLocationChange}
                          className="col-span-3"
                          placeholder="e.g., America/New_York"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                          Status
                        </Label>
                        <Select
                          value={locationForm.status || "Active"}
                          onValueChange={(value) =>
                            setLocationForm((prev) => ({
                              ...prev,
                              status: value,
                            }))
                          }
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="stripe_location_account_id"
                          className="text-right"
                        >
                          Stripe Account ID
                        </Label>
                        <Input
                          id="stripe_location_account_id"
                          name="stripe_location_account_id"
                          value={locationForm.stripe_location_account_id}
                          onChange={handleLocationChange}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">
                        {locationForm.id ? "Update" : "Create"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Contact</TableHead>
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
                      <TableCell>{location.entities?.name || "N/A"}</TableCell>
                      <TableCell>
                        {location.address
                          ? `${location.address}, ${location.city || ""} ${location.state || ""} ${location.zip_code || ""}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {location.phone || location.email || "N/A"}
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
                            onClick={() => deleteLocation(location.id)}
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
          </div>
        </TabsContent>

        <TabsContent value="groups" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Groups</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={handleDownloadGroups}
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
              <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Group
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {groupForm.id ? "Edit Group" : "Add Group"}
                    </DialogTitle>
                    <DialogDescription>
                      {groupForm.id
                        ? "Update group information"
                        : "Create a new group"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleGroupSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={groupForm.name}
                          onChange={handleGroupChange}
                          className="col-span-3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={groupForm.group_description}
                          onChange={handleGroupChange}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">
                        {groupForm.id ? "Update" : "Create"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.length > 0 ? (
                  groups.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell className="font-medium">
                        {group.group_name || ""}
                      </TableCell>
                      <TableCell>{group.group_description || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => editGroup(group)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteGroup(group.id)}
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
                      No groups found. Create your first group to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
