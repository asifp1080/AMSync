import React, { useState, useEffect } from "react";
import { useLocation } from "../../lib/location-context";
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

interface Entity {
  id: string;
  name: string;
  description: string | null;
  entity_type: string;
  status: string;
  city: string | null;
  state: string | null;
  primary_contact_name: string | null;
  primary_contact_email: string | null;
  primary_contact_phone: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  zip_code: string | null;
  country: string | null;
  legal_entity_type: string | null;
  ein: string | null;
  license_number: string | null;
  license_expiration_date: string | null;
  gl_policy_number: string | null;
  gl_liability_coverage: string | null;
  gl_policy_expiration_date: string | null;
  e_and_o_policy_number: string | null;
  e_and_o_liability_coverage: string | null;
  e_and_o_policy_expiration_date: string | null;
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
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  status: string | null;
  operating_hours: any | null;
  ip_whitelist: string[] | null;
  assigned_employees: string[] | null;
  assigned_policies: string[] | null;
  stripe_location_account_id: string | null;
  region_name?: string;
  entity_name?: string;
}

interface Group {
  id: string;
  group_name: string;
  group_description: string | null;
  group_manager_id: string | null;
  group_tags: string[] | null;
  status: string;
  created_at: string;
  updated_at: string;
  manager_name?: string;
}

interface GroupLocation {
  mapping_id: string;
  group_id: string;
  location_id: string;
  added_on: string;
  location_name?: string;
  region_name?: string;
  entity_name?: string;
}

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
}

export default function LocationHierarchy() {
  const { entities, regions, locations, groups, groupLocations, refreshData } =
    useLocation();

  // Define fetch functions
  const fetchEntities = async () => {
    await refreshData();
  };

  const fetchRegions = async () => {
    await refreshData();
  };

  const fetchLocations = async () => {
    await refreshData();
  };

  const fetchGroups = async () => {
    await refreshData();
  };

  const fetchGroupLocations = async () => {
    await refreshData();
  };

  const fetchEmployees = async () => {
    await refreshData();
  };

  // Define CRUD functions for entities
  const createEntity = async (data: any) => {
    try {
      const { error } = await supabase.from("entities").insert(data);
      if (error) throw error;
      await refreshData();
    } catch (error) {
      console.error("Error creating entity:", error);
      throw error;
    }
  };

  const updateEntity = async ({ id, data }: { id: string; data: any }) => {
    try {
      const { error } = await supabase
        .from("entities")
        .update(data)
        .eq("id", id);
      if (error) throw error;
      await refreshData();
    } catch (error) {
      console.error("Error updating entity:", error);
      throw error;
    }
  };

  const deleteEntity = async (id: string) => {
    try {
      const { error } = await supabase.from("entities").delete().eq("id", id);
      if (error) throw error;
      await refreshData();
    } catch (error) {
      console.error("Error deleting entity:", error);
      throw error;
    }
  };

  // Define CRUD functions for regions
  const createRegion = async (data: any) => {
    try {
      const { error } = await supabase.from("regions").insert(data);
      if (error) throw error;
      await refreshData();
    } catch (error) {
      console.error("Error creating region:", error);
      throw error;
    }
  };

  const updateRegion = async ({ id, data }: { id: string; data: any }) => {
    try {
      const { error } = await supabase
        .from("regions")
        .update(data)
        .eq("id", id);
      if (error) throw error;
      await refreshData();
    } catch (error) {
      console.error("Error updating region:", error);
      throw error;
    }
  };

  const deleteRegion = async (id: string) => {
    try {
      const { error } = await supabase.from("regions").delete().eq("id", id);
      if (error) throw error;
      await refreshData();
    } catch (error) {
      console.error("Error deleting region:", error);
      throw error;
    }
  };

  // Define CRUD functions for locations
  const createLocation = async (data: any) => {
    try {
      const { error } = await supabase.from("locations").insert(data);
      if (error) throw error;
      await refreshData();
    } catch (error) {
      console.error("Error creating location:", error);
      throw error;
    }
  };

  const updateLocation = async ({ id, data }: { id: string; data: any }) => {
    try {
      const { error } = await supabase
        .from("locations")
        .update(data)
        .eq("id", id);
      if (error) throw error;
      await refreshData();
    } catch (error) {
      console.error("Error updating location:", error);
      throw error;
    }
  };

  const deleteLocation = async (id: string) => {
    try {
      const { error } = await supabase.from("locations").delete().eq("id", id);
      if (error) throw error;
      await refreshData();
    } catch (error) {
      console.error("Error deleting location:", error);
      throw error;
    }
  };

  // Define CRUD functions for groups
  const createGroup = async (data: any) => {
    try {
      const { error } = await supabase.from("groups").insert(data);
      if (error) throw error;
      await refreshData();
    } catch (error) {
      console.error("Error creating group:", error);
      throw error;
    }
  };

  const updateGroup = async ({ id, data }: { id: string; data: any }) => {
    try {
      const { error } = await supabase.from("groups").update(data).eq("id", id);
      if (error) throw error;
      await refreshData();
    } catch (error) {
      console.error("Error updating group:", error);
      throw error;
    }
  };

  const deleteGroup = async (id: string) => {
    try {
      const { error } = await supabase.from("groups").delete().eq("id", id);
      if (error) throw error;
      await refreshData();
    } catch (error) {
      console.error("Error deleting group:", error);
      throw error;
    }
  };

  // Define CRUD functions for group locations
  const createGroupLocation = async (data: any) => {
    try {
      const { error } = await supabase.from("group_locations").insert(data);
      if (error) throw error;
      await refreshData();
    } catch (error) {
      console.error("Error creating group location mapping:", error);
      throw error;
    }
  };

  const deleteGroupLocation = async (id: string) => {
    try {
      const { error } = await supabase
        .from("group_locations")
        .delete()
        .eq("id", id);
      if (error) throw error;
      await refreshData();
    } catch (error) {
      console.error("Error deleting group location mapping:", error);
      throw error;
    }
  };

  // Employees state
  const [employees, setEmployees] = useState([]);

  // State for dialog visibility
  const [entityDialogOpen, setEntityDialogOpen] = useState(false);
  const [regionDialogOpen, setRegionDialogOpen] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [groupLocationDialogOpen, setGroupLocationDialogOpen] = useState(false);

  // State for loading status
  const [isLoading, setIsLoading] = useState(false);

  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // Entity form state
  const [entityForm, setEntityForm] = useState({
    id: "",
    name: "",
    description: "",
    entity_type: "",
    status: "active",
    city: "",
    state: "",
    primary_contact_name: "",
    primary_contact_email: "",
    primary_contact_phone: "",
    address_line_1: "",
    address_line_2: "",
    zip_code: "",
    country: "USA",
    legal_entity_type: "",
    ein: "",
    license_number: "",
    license_expiration_date: "",
    gl_policy_number: "",
    gl_liability_coverage: "",
    gl_policy_expiration_date: "",
    e_and_o_policy_number: "",
    e_and_o_liability_coverage: "",
    e_and_o_policy_expiration_date: "",
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
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    zip_code: "",
    country: "USA",
    status: "active",
    operating_hours: null,
    ip_whitelist: "",
    assigned_employees: [],
    assigned_policies: [],
    stripe_location_account_id: "",
  });

  // Group form state
  const [groupForm, setGroupForm] = useState({
    id: "",
    group_name: "",
    group_description: "",
    group_manager_id: "",
    group_tags: "",
    status: "active",
  });

  // Group-Location mapping form state
  const [groupLocationForm, setGroupLocationForm] = useState({
    group_id: "",
    location_id: "",
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchEntities(),
          fetchRegions(),
          fetchLocations(),
          fetchGroups(),
          fetchGroupLocations(),
          fetchEmployees(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, []);

  // Filter entities based on search query
  const filteredEntities = entities.filter(
    (entity) =>
      entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.entity_type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Filter regions based on search query
  const filteredRegions = regions.filter(
    (region) =>
      region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      region.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      region.entity_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Filter locations based on search query
  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.state?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.region_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.entity_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Filter groups based on search query
  const filteredGroups = groups.filter(
    (group) =>
      group.group_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.group_description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      group.manager_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Reset entity form
  const resetEntityForm = () => {
    setEntityForm({
      id: "",
      name: "",
      description: "",
      entity_type: "",
      status: "active",
      city: "",
      state: "",
      primary_contact_name: "",
      primary_contact_email: "",
      primary_contact_phone: "",
      address_line_1: "",
      address_line_2: "",
      zip_code: "",
      country: "USA",
      legal_entity_type: "",
      ein: "",
      license_number: "",
      license_expiration_date: "",
      gl_policy_number: "",
      gl_liability_coverage: "",
      gl_policy_expiration_date: "",
      e_and_o_policy_number: "",
      e_and_o_liability_coverage: "",
      e_and_o_policy_expiration_date: "",
    });
  };

  // Reset region form
  const resetRegionForm = () => {
    setRegionForm({
      id: "",
      entity_id: "",
      name: "",
      description: "",
    });
  };

  // Reset location form
  const resetLocationForm = () => {
    setLocationForm({
      id: "",
      region_id: "",
      name: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      zip_code: "",
      country: "USA",
      status: "active",
      operating_hours: null,
      ip_whitelist: "",
      assigned_employees: [],
      assigned_policies: [],
      stripe_location_account_id: "",
    });
  };

  // Reset group form
  const resetGroupForm = () => {
    setGroupForm({
      id: "",
      group_name: "",
      group_description: "",
      group_manager_id: "",
      group_tags: "",
      status: "active",
    });
  };

  // Reset group-location mapping form
  const resetGroupLocationForm = () => {
    setGroupLocationForm({
      group_id: "",
      location_id: "",
    });
  };

  // Handle entity form changes
  const handleEntityChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEntityForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle region form changes
  const handleRegionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setRegionForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle location form changes
  const handleLocationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setLocationForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle group form changes
  const handleGroupChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setGroupForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle group status change
  const handleGroupStatusChange = (value: string) => {
    setGroupForm((prev) => ({ ...prev, status: value }));
  };

  // Handle group manager change
  const handleGroupManagerChange = (value: string) => {
    setGroupForm((prev) => ({ ...prev, group_manager_id: value }));
  };

  // Handle group-location mapping changes
  const handleGroupLocationChange = (name: string, value: string) => {
    setGroupLocationForm((prev) => ({ ...prev, [name]: value }));
  };

  // Edit entity
  const editEntity = (entity: Entity) => {
    setEntityForm({
      id: entity.id,
      name: entity.name,
      description: entity.description || "",
      entity_type: entity.entity_type || "",
      status: entity.status || "active",
      city: entity.city || "",
      state: entity.state || "",
      primary_contact_name: entity.primary_contact_name || "",
      primary_contact_email: entity.primary_contact_email || "",
      primary_contact_phone: entity.primary_contact_phone || "",
      address_line_1: entity.address_line_1 || "",
      address_line_2: entity.address_line_2 || "",
      zip_code: entity.zip_code || "",
      country: entity.country || "USA",
      legal_entity_type: entity.legal_entity_type || "",
      ein: entity.ein || "",
      license_number: entity.license_number || "",
      license_expiration_date: entity.license_expiration_date || "",
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

  // Edit region
  const editRegion = (region: Region) => {
    setRegionForm({
      id: region.id,
      entity_id: region.entity_id,
      name: region.name,
      description: region.description || "",
    });
    setRegionDialogOpen(true);
  };

  // Edit location
  const editLocation = (location: Location) => {
    setLocationForm({
      id: location.id,
      region_id: location.region_id,
      name: location.name,
      address_line_1: location.address_line_1 || "",
      address_line_2: location.address_line_2 || "",
      city: location.city || "",
      state: location.state || "",
      zip_code: location.zip_code || "",
      country: location.country || "USA",
      status: location.status || "active",
      operating_hours: location.operating_hours,
      ip_whitelist: location.ip_whitelist
        ? location.ip_whitelist.join(", ")
        : "",
      assigned_employees: location.assigned_employees || [],
      assigned_policies: location.assigned_policies || [],
      stripe_location_account_id: location.stripe_location_account_id || "",
    });
    setLocationDialogOpen(true);
  };

  // Edit group
  const editGroup = (group: Group) => {
    setGroupForm({
      id: group.id,
      group_name: group.group_name,
      group_description: group.group_description || "",
      group_manager_id: group.group_manager_id || "",
      group_tags: group.group_tags ? group.group_tags.join(", ") : "",
      status: group.status,
    });
    setGroupDialogOpen(true);
  };

  // Handle entity form submission
  const handleEntitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // No IP whitelist or notification channels in the updated schema

      if (entityForm.id) {
        // Update existing entity
        await updateEntity({
          id: entityForm.id,
          data: {
            name: entityForm.name,
            description: entityForm.description || null,
            entity_type: entityForm.entity_type,
            status: entityForm.status,
            city: entityForm.city || null,
            state: entityForm.state || null,
            primary_contact_name: entityForm.primary_contact_name || null,
            primary_contact_email: entityForm.primary_contact_email || null,
            primary_contact_phone: entityForm.primary_contact_phone || null,
            address_line_1: entityForm.address_line_1 || null,
            address_line_2: entityForm.address_line_2 || null,
            zip_code: entityForm.zip_code || null,
            country: entityForm.country || null,
            legal_entity_type: entityForm.legal_entity_type || null,
            ein: entityForm.ein || null,
            license_number: entityForm.license_number || null,
            license_expiration_date: entityForm.license_expiration_date || null,
            gl_policy_number: entityForm.gl_policy_number || null,
            gl_liability_coverage: entityForm.gl_liability_coverage || null,
            gl_policy_expiration_date:
              entityForm.gl_policy_expiration_date || null,
            e_and_o_policy_number: entityForm.e_and_o_policy_number || null,
            e_and_o_liability_coverage:
              entityForm.e_and_o_liability_coverage || null,
            e_and_o_policy_expiration_date:
              entityForm.e_and_o_policy_expiration_date || null,
          },
        });
      } else {
        // Create new entity
        await createEntity({
          name: entityForm.name,
          description: entityForm.description || null,
          entity_type: entityForm.entity_type,
          status: entityForm.status,
          city: entityForm.city || null,
          state: entityForm.state || null,
          primary_contact_name: entityForm.primary_contact_name || null,
          primary_contact_email: entityForm.primary_contact_email || null,
          primary_contact_phone: entityForm.primary_contact_phone || null,
          address_line_1: entityForm.address_line_1 || null,
          address_line_2: entityForm.address_line_2 || null,
          zip_code: entityForm.zip_code || null,
          country: entityForm.country || null,
          legal_entity_type: entityForm.legal_entity_type || null,
          ein: entityForm.ein || null,
          license_number: entityForm.license_number || null,
          license_expiration_date: entityForm.license_expiration_date || null,
          gl_policy_number: entityForm.gl_policy_number || null,
          gl_liability_coverage: entityForm.gl_liability_coverage || null,
          gl_policy_expiration_date:
            entityForm.gl_policy_expiration_date || null,
          e_and_o_policy_number: entityForm.e_and_o_policy_number || null,
          e_and_o_liability_coverage:
            entityForm.e_and_o_liability_coverage || null,
          e_and_o_policy_expiration_date:
            entityForm.e_and_o_policy_expiration_date || null,
        });
      }

      // Reset form and close dialog
      resetEntityForm();
      setEntityDialogOpen(false);
      fetchEntities();
    } catch (error) {
      console.error("Error saving entity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle region form submission
  const handleRegionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (regionForm.id) {
        // Update existing region
        await updateRegion({
          id: regionForm.id,
          data: {
            entity_id: regionForm.entity_id,
            name: regionForm.name,
            description: regionForm.description || null,
          },
        });
      } else {
        // Create new region
        await createRegion({
          entity_id: regionForm.entity_id,
          name: regionForm.name,
          description: regionForm.description || null,
        });
      }

      // Reset form and close dialog
      resetRegionForm();
      setRegionDialogOpen(false);
      fetchRegions();
    } catch (error) {
      console.error("Error saving region:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle location form submission
  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Parse IP whitelist from comma-separated string to array
      const ipWhitelist = locationForm.ip_whitelist
        ? locationForm.ip_whitelist.split(",").map((ip) => ip.trim())
        : [];

      if (locationForm.id) {
        // Update existing location
        await updateLocation({
          id: locationForm.id,
          data: {
            region_id: locationForm.region_id,
            name: locationForm.name,
            address_line_1: locationForm.address_line_1 || null,
            address_line_2: locationForm.address_line_2 || null,
            city: locationForm.city || null,
            state: locationForm.state || null,
            zip_code: locationForm.zip_code || null,
            country: locationForm.country || null,
            status: locationForm.status || null,
            operating_hours: locationForm.operating_hours,
            ip_whitelist: ipWhitelist.length > 0 ? ipWhitelist : null,
            assigned_employees: locationForm.assigned_employees,
            assigned_policies: locationForm.assigned_policies,
            stripe_location_account_id:
              locationForm.stripe_location_account_id || null,
          },
        });
      } else {
        // Create new location
        await createLocation({
          region_id: locationForm.region_id,
          name: locationForm.name,
          address_line_1: locationForm.address_line_1 || null,
          address_line_2: locationForm.address_line_2 || null,
          city: locationForm.city || null,
          state: locationForm.state || null,
          zip_code: locationForm.zip_code || null,
          country: locationForm.country || null,
          status: locationForm.status || null,
          operating_hours: locationForm.operating_hours,
          ip_whitelist: ipWhitelist.length > 0 ? ipWhitelist : null,
          assigned_employees: locationForm.assigned_employees,
          assigned_policies: locationForm.assigned_policies,
          stripe_location_account_id:
            locationForm.stripe_location_account_id || null,
        });
      }

      // Reset form and close dialog
      resetLocationForm();
      setLocationDialogOpen(false);
      fetchLocations();
    } catch (error) {
      console.error("Error saving location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle group form submission
  const handleGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Parse group tags from comma-separated string to array
      const groupTags = groupForm.group_tags
        ? groupForm.group_tags.split(",").map((tag) => tag.trim())
        : [];

      if (groupForm.id) {
        // Update existing group
        await updateGroup({
          id: groupForm.id,
          data: {
            group_name: groupForm.group_name,
            group_description: groupForm.group_description || null,
            group_manager_id: groupForm.group_manager_id || null,
            group_tags: groupTags.length > 0 ? groupTags : null,
            status: groupForm.status,
          },
        });
      } else {
        // Create new group
        await createGroup({
          group_name: groupForm.group_name,
          group_description: groupForm.group_description || null,
          group_manager_id: groupForm.group_manager_id || null,
          group_tags: groupTags.length > 0 ? groupTags : null,
          status: groupForm.status,
        });
      }

      // Reset form and close dialog
      resetGroupForm();
      setGroupDialogOpen(false);
      fetchGroups();
    } catch (error) {
      console.error("Error saving group:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle group-location mapping submission
  const handleGroupLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createGroupLocation({
        group_id: groupLocationForm.group_id,
        location_id: groupLocationForm.location_id,
      });

      // Reset form and close dialog
      resetGroupLocationForm();
      setGroupLocationDialogOpen(false);
      fetchGroupLocations();
    } catch (error) {
      console.error("Error creating group-location mapping:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete for entities, regions, locations, groups, and group-location mappings
  const handleDelete = async (type: string, id: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete this ${type.replace("_", " ")}?`,
      )
    ) {
      return;
    }

    setIsLoading(true);

    try {
      switch (type) {
        case "entities":
          await deleteEntity(id);
          fetchEntities();
          break;
        case "regions":
          await deleteRegion(id);
          fetchRegions();
          break;
        case "locations":
          await deleteLocation(id);
          fetchLocations();
          break;
        case "groups":
          await deleteGroup(id);
          fetchGroups();
          break;
        case "group_locations":
          await deleteGroupLocation(id);
          fetchGroupLocations();
          break;
        default:
          console.error("Unknown delete type:", type);
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Location Hierarchy Management</h1>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search entities, regions, locations, or groups..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="entities">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="entities">Entities</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* Groups Tab */}
          <TabsContent value="groups" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Groups</h3>
              <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Group
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {groupForm.id ? "Edit" : "Add"} Group
                    </DialogTitle>
                    <DialogDescription>
                      {groupForm.id
                        ? "Update the group details below."
                        : "Create a new group by filling out the form below."}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleGroupSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="group-name">Group Name*</Label>
                        <Input
                          id="group-name"
                          name="group_name"
                          value={groupForm.group_name}
                          onChange={handleGroupChange}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="group-description">Description</Label>
                        <Textarea
                          id="group-description"
                          name="group_description"
                          value={groupForm.group_description}
                          onChange={handleGroupChange}
                          rows={3}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="group-manager">Group Manager</Label>
                        <Select
                          value={groupForm.group_manager_id}
                          onValueChange={handleGroupManagerChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a manager" />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Add employee options here when available */}
                            <SelectItem value="">No manager</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="group-tags">
                          Tags (comma separated)
                        </Label>
                        <Input
                          id="group-tags"
                          name="group_tags"
                          value={groupForm.group_tags}
                          onChange={handleGroupChange}
                          placeholder="sales, marketing, support"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="group-status">Status*</Label>
                        <Select
                          value={groupForm.status}
                          onValueChange={handleGroupStatusChange}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading
                          ? "Saving..."
                          : groupForm.id
                            ? "Update Group"
                            : "Create Group"}
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
                      <TableHead>Manager</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGroups.length > 0 ? (
                      filteredGroups.map((group) => (
                        <TableRow key={group.id}>
                          <TableCell className="font-medium">
                            {group.group_name}
                          </TableCell>
                          <TableCell>{group.group_description}</TableCell>
                          <TableCell>{group.manager_name || "N/A"}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${group.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                            >
                              {group.status || "N/A"}
                            </span>
                          </TableCell>
                          <TableCell>
                            {group.group_tags && group.group_tags.length > 0
                              ? group.group_tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center mr-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {tag}
                                  </span>
                                ))
                              : "N/A"}
                          </TableCell>
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
                                onClick={() => handleDelete("groups", group.id)}
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
                            ? "No matching groups found."
                            : "No groups found. Create your first group to get started."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="mt-8">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Group-Location Mappings</h3>
                <Dialog
                  open={groupLocationDialogOpen}
                  onOpenChange={setGroupLocationDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" /> Add Location to Group
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Location to Group</DialogTitle>
                      <DialogDescription>
                        Select a group and location to create a mapping.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleGroupLocationSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="group-select">Group*</Label>
                          <Select
                            value={groupLocationForm.group_id}
                            onValueChange={(value) =>
                              handleGroupLocationChange("group_id", value)
                            }
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a group" />
                            </SelectTrigger>
                            <SelectContent>
                              {groups.map((group) => (
                                <SelectItem key={group.id} value={group.id}>
                                  {group.group_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="location-select">Location*</Label>
                          <Select
                            value={groupLocationForm.location_id}
                            onValueChange={(value) =>
                              handleGroupLocationChange("location_id", value)
                            }
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a location" />
                            </SelectTrigger>
                            <SelectContent>
                              {locations.map((location) => (
                                <SelectItem
                                  key={location.id}
                                  value={location.id}
                                >
                                  {location.name} ({location.region_name} -
                                  {location.entity_name})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Adding..." : "Add to Group"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Card className="mt-4">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Group</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Entity</TableHead>
                        <TableHead>Added On</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupLocations.length > 0 ? (
                        groupLocations.map((mapping) => (
                          <TableRow key={mapping.mapping_id}>
                            <TableCell>
                              {groups.find((g) => g.id === mapping.group_id)
                                ?.group_name || "N/A"}
                            </TableCell>
                            <TableCell>
                              {mapping.location_name || "N/A"}
                            </TableCell>
                            <TableCell>
                              {mapping.region_name || "N/A"}
                            </TableCell>
                            <TableCell>
                              {mapping.entity_name || "N/A"}
                            </TableCell>
                            <TableCell>
                              {new Date(mapping.added_on).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleDelete(
                                    "group_locations",
                                    mapping.mapping_id,
                                  )
                                }
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-4 text-muted-foreground"
                          >
                            No group-location mappings found. Add locations to
                            groups to get started.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

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
                <DialogContent className="max-w-3xl">
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
                    <div className="grid gap-6 py-4">
                      <div className="grid gap-4">
                        <h3 className="text-lg font-medium">
                          Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="entity-name">Entity Name*</Label>
                            <Input
                              id="entity-name"
                              name="name"
                              value={entityForm.name}
                              onChange={handleEntityChange}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="entity-type">Entity Type*</Label>
                            <Input
                              id="entity-type"
                              name="entity_type"
                              value={entityForm.entity_type}
                              onChange={handleEntityChange}
                              required
                            />
                          </div>
                          <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="entity-description">
                              Description
                            </Label>
                            <Textarea
                              id="entity-description"
                              name="description"
                              value={entityForm.description}
                              onChange={handleEntityChange}
                              rows={3}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="entity-status">Status*</Label>
                            <Select
                              value={entityForm.status}
                              onValueChange={(value) =>
                                setEntityForm((prev) => ({
                                  ...prev,
                                  status: value,
                                }))
                              }
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">
                                  Inactive
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="entity-legal-type">
                              Legal Entity Type*
                            </Label>
                            <Select
                              value={entityForm.legal_entity_type || ""}
                              onValueChange={(value) =>
                                setEntityForm((prev) => ({
                                  ...prev,
                                  legal_entity_type: value,
                                }))
                              }
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sole_proprietorship">
                                  Sole Proprietorship
                                </SelectItem>
                                <SelectItem value="general_partnership">
                                  General Partnership
                                </SelectItem>
                                <SelectItem value="llc">LLC</SelectItem>
                                <SelectItem value="c_corporation">
                                  C Corporation
                                </SelectItem>
                                <SelectItem value="s_corporation">
                                  S Corporation
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        <h3 className="text-lg font-medium">
                          Contact Information
                        </h3>
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
                          <div className="grid gap-2">
                            <Label htmlFor="entity-contact-phone">
                              Primary Contact Phone
                            </Label>
                            <Input
                              id="entity-contact-phone"
                              name="primary_contact_phone"
                              value={entityForm.primary_contact_phone}
                              onChange={handleEntityChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        <h3 className="text-lg font-medium">Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="entity-address-line1">
                              Address Line 1*
                            </Label>
                            <Input
                              id="entity-address-line1"
                              name="address_line_1"
                              value={entityForm.address_line_1}
                              onChange={handleEntityChange}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="entity-address-line2">
                              Address Line 2
                            </Label>
                            <Input
                              id="entity-address-line2"
                              name="address_line_2"
                              value={entityForm.address_line_2}
                              onChange={handleEntityChange}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="entity-city">City*</Label>
                            <Input
                              id="entity-city"
                              name="city"
                              value={entityForm.city}
                              onChange={handleEntityChange}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="entity-state">State*</Label>
                            <Input
                              id="entity-state"
                              name="state"
                              value={entityForm.state}
                              onChange={handleEntityChange}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="entity-zip">ZIP Code*</Label>
                            <Input
                              id="entity-zip"
                              name="zip_code"
                              value={entityForm.zip_code}
                              onChange={handleEntityChange}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="entity-country">Country</Label>
                            <Input
                              id="entity-country"
                              name="country"
                              value={entityForm.country}
                              onChange={handleEntityChange}
                              placeholder="USA"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        <h3 className="text-lg font-medium">
                          Licensing & Insurance
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="entity-ein">EIN*</Label>
                            <Input
                              id="entity-ein"
                              name="ein"
                              value={entityForm.ein}
                              onChange={handleEntityChange}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="entity-license">
                              License Number*
                            </Label>
                            <Input
                              id="entity-license"
                              name="license_number"
                              value={entityForm.license_number}
                              onChange={handleEntityChange}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="entity-license-expiration">
                              License Expiration Date*
                            </Label>
                            <Input
                              id="entity-license-expiration"
                              name="license_expiration_date"
                              type="date"
                              value={entityForm.license_expiration_date}
                              onChange={handleEntityChange}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="entity-gl-policy">
                              GL Policy Number
                            </Label>
                            <Input
                              id="entity-gl-policy"
                              name="gl_policy_number"
                              value={entityForm.gl_policy_number}
                              onChange={handleEntityChange}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="entity-gl-liability">
                              GL Liability Coverage
                            </Label>
                            <Input
                              id="entity-gl-liability"
                              name="gl_liability_coverage"
                              value={entityForm.gl_liability_coverage}
                              onChange={handleEntityChange}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="entity-gl-expiration">
                              GL Policy Expiration Date
                            </Label>
                            <Input
                              id="entity-gl-expiration"
                              name="gl_policy_expiration_date"
                              type="date"
                              value={entityForm.gl_policy_expiration_date}
                              onChange={handleEntityChange}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="entity-eo-policy">
                              E&O Policy Number
                            </Label>
                            <Input
                              id="entity-eo-policy"
                              name="e_and_o_policy_number"
                              value={entityForm.e_and_o_policy_number}
                              onChange={handleEntityChange}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="entity-eo-liability">
                              E&O Liability Coverage
                            </Label>
                            <Input
                              id="entity-eo-liability"
                              name="e_and_o_liability_coverage"
                              value={entityForm.e_and_o_liability_coverage}
                              onChange={handleEntityChange}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="entity-eo-expiration">
                              E&O Policy Expiration Date
                            </Label>
                            <Input
                              id="entity-eo-expiration"
                              name="e_and_o_policy_expiration_date"
                              type="date"
                              value={entityForm.e_and_o_policy_expiration_date}
                              onChange={handleEntityChange}
                            />
                          </div>
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
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Legal Entity Type</TableHead>
                      <TableHead>Location</TableHead>
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
                          <TableCell>{entity.entity_type}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${entity.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                            >
                              {entity.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            {entity.legal_entity_type
                              ? entity.legal_entity_type
                                  .replace("_", " ")
                                  .replace(/\b\w/g, (l) => l.toUpperCase())
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {entity.city && entity.state
                              ? `${entity.city}, ${entity.state}`
                              : "N/A"}
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
                          {searchQuery
                            ? "No matching entities found."
                            : "No entities found. Create your first entity to get started."}
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
                        <Label htmlFor="region-entity">Entity*</Label>
                        <Select
                          value={regionForm.entity_id}
                          onValueChange={(value) =>
                            setRegionForm((prev) => ({
                              ...prev,
                              entity_id: value,
                            }))
                          }
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
                        <Label htmlFor="region-name">Region Name*</Label>
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
                    {filteredRegions.length > 0 ? (
                      filteredRegions.map((region) => (
                        <TableRow key={region.id}>
                          <TableCell className="font-medium">
                            {region.name}
                          </TableCell>
                          <TableCell>{region.entity_name || "N/A"}</TableCell>
                          <TableCell>
                            {region.description || "No description"}
                          </TableCell>
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
                          {searchQuery
                            ? "No matching regions found."
                            : "No regions found. Create your first region to get started."}
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
                <DialogContent className="max-w-3xl">
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
                    <div className="grid gap-6 py-4">
                      <div className="grid gap-4">
                        <h3 className="text-lg font-medium">
                          Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="location-region">Region*</Label>
                            <Select
                              value={locationForm.region_id}
                              onValueChange={(value) =>
                                setLocationForm((prev) => ({
                                  ...prev,
                                  region_id: value,
                                }))
                              }
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
                            <Label htmlFor="location-name">
                              Location Name*
                            </Label>
                            <Input
                              id="location-name"
                              name="name"
                              value={locationForm.name}
                              onChange={handleLocationChange}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="location-status">Status*</Label>
                            <Select
                              value={locationForm.status}
                              onValueChange={(value) =>
                                setLocationForm((prev) => ({
                                  ...prev,
                                  status: value,
                                }))
                              }
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">
                                  Inactive
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        <h3 className="text-lg font-medium">Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="location-address-1">
                              Address Line 1*
                            </Label>
                            <Input
                              id="location-address-1"
                              name="address_line_1"
                              value={locationForm.address_line_1}
                              onChange={handleLocationChange}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="location-address-2">
                              Address Line 2
                            </Label>
                            <Input
                              id="location-address-2"
                              name="address_line_2"
                              value={locationForm.address_line_2}
                              onChange={handleLocationChange}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="location-city">City*</Label>
                            <Input
                              id="location-city"
                              name="city"
                              value={locationForm.city}
                              onChange={handleLocationChange}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="location-state">State*</Label>
                            <Input
                              id="location-state"
                              name="state"
                              value={locationForm.state}
                              onChange={handleLocationChange}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="location-zip">ZIP Code*</Label>
                            <Input
                              id="location-zip"
                              name="zip_code"
                              value={locationForm.zip_code}
                              onChange={handleLocationChange}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="location-country">Country</Label>
                            <Input
                              id="location-country"
                              name="country"
                              value={locationForm.country}
                              onChange={handleLocationChange}
                              placeholder="USA"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        <h3 className="text-lg font-medium">Operating Hours</h3>
                        <div className="grid gap-2">
                          <Label htmlFor="operating-hours">
                            Operating Hours (JSON format)
                          </Label>
                          <Textarea
                            id="operating-hours"
                            name="operating_hours"
                            value={
                              locationForm.operating_hours
                                ? JSON.stringify(
                                    locationForm.operating_hours,
                                    null,
                                    2,
                                  )
                                : ""
                            }
                            onChange={(e) => {
                              try {
                                const parsed = e.target.value
                                  ? JSON.parse(e.target.value)
                                  : null;
                                setLocationForm((prev) => ({
                                  ...prev,
                                  operating_hours: parsed,
                                }));
                              } catch (error) {
                                // Handle invalid JSON
                                console.error("Invalid JSON format", error);
                              }
                            }}
                            placeholder='{"monday":{"start_time":"09:00","end_time":"17:00"},"tuesday":{"start_time":"09:00","end_time":"17:00"}}'
                            rows={5}
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter operating hours in JSON format with days of
                            the week
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        <h3 className="text-lg font-medium">
                          Security Settings
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="location-ip-whitelist">
                              IP Whitelist (comma separated)
                            </Label>
                            <Input
                              id="location-ip-whitelist"
                              name="ip_whitelist"
                              value={locationForm.ip_whitelist}
                              onChange={handleLocationChange}
                              placeholder="192.168.1.0/24, 10.0.0.0/8"
                            />
                            <p className="text-xs text-muted-foreground">
                              Enter IP addresses in IPv4 format, separated by
                              commas
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        <h3 className="text-lg font-medium">
                          Financial Settings
                        </h3>
                        <div className="grid gap-2">
                          <Label htmlFor="location-stripe">
                            Stripe Location Account ID
                          </Label>
                          <Input
                            id="location-stripe"
                            name="stripe_location_account_id"
                            value={locationForm.stripe_location_account_id}
                            onChange={handleLocationChange}
                          />
                        </div>
                      </div>

                      <div className="grid gap-4">
                        <h3 className="text-lg font-medium">Assignments</h3>
                        <div className="grid gap-2">
                          <Label htmlFor="assigned-employees">
                            Assigned Employees (IDs)
                          </Label>
                          <Input
                            id="assigned-employees"
                            name="assigned_employees"
                            value={
                              Array.isArray(locationForm.assigned_employees)
                                ? locationForm.assigned_employees.join(", ")
                                : ""
                            }
                            onChange={(e) => {
                              const employeeIds = e.target.value
                                .split(",")
                                .map((id) => id.trim())
                                .filter((id) => id);
                              setLocationForm((prev) => ({
                                ...prev,
                                assigned_employees: employeeIds,
                              }));
                            }}
                            placeholder="emp_123, emp_456"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="assigned-policies">
                            Assigned Policies (IDs)
                          </Label>
                          <Input
                            id="assigned-policies"
                            name="assigned_policies"
                            value={
                              Array.isArray(locationForm.assigned_policies)
                                ? locationForm.assigned_policies.join(", ")
                                : ""
                            }
                            onChange={(e) => {
                              const policyIds = e.target.value
                                .split(",")
                                .map((id) => id.trim())
                                .filter((id) => id);
                              setLocationForm((prev) => ({
                                ...prev,
                                assigned_policies: policyIds,
                              }));
                            }}
                            placeholder="pol_123, pol_456"
                          />
                        </div>
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
                      <TableHead>Status</TableHead>
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
                          <TableCell>{location.entity_name || "N/A"}</TableCell>
                          <TableCell>{location.region_name || "N/A"}</TableCell>
                          <TableCell>
                            {location.address_line_1 ? (
                              <>
                                {location.address_line_1}, {location.city},{" "}
                                {location.state} {location.zip_code}
                              </>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${location.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                            >
                              {location.status || "N/A"}
                            </span>
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
                          colSpan={6}
                          className="text-center py-4 text-muted-foreground"
                        >
                          {searchQuery
                            ? "No matching locations found."
                            : "No locations found. Create your first location to get started."}
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
    </div>
  );
}
