import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./auth-context";

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

interface Group {
  id: string;
  name: string;
  description: string | null;
}

interface GroupLocation {
  id: string;
  group_id: string;
  location_id: string;
  group_name?: string;
  location_name?: string;
}

interface UserRole {
  role:
    | "organization_admin"
    | "entity_admin"
    | "location_manager"
    | "agent"
    | "staff";
  organization_id: string | null;
  entity_id: string | null;
  location_id: string | null;
}

type LocationContextType = {
  entities: Entity[];
  regions: Region[];
  locations: Location[];
  groups: Group[];
  groupLocations: GroupLocation[];
  userRole: UserRole | null;
  userEntities: Entity[];
  userRegions: Region[];
  userLocations: Location[];
  currentLocation: Location | null;
  setCurrentLocation: (location: Location | null) => void;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  hasAccessToEntity: (entityId: string) => boolean;
  hasAccessToRegion: (regionId: string) => boolean;
  hasAccessToLocation: (locationId: string) => boolean;
};

const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupLocations, setGroupLocations] = useState<GroupLocation[]>([]);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userEntities, setUserEntities] = useState<Entity[]>([]);
  const [userRegions, setUserRegions] = useState<Region[]>([]);
  const [userLocations, setUserLocations] = useState<Location[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all location data and user permissions
  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch user role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select()
        .eq("user_id", user.id)
        .single();

      if (roleError && roleError.code !== "PGRST116") {
        // PGRST116 is "No rows found" error
        throw roleError;
      }

      const userRoleData = roleData as UserRole | null;
      setUserRole(userRoleData);

      // Fetch all entities
      const { data: entitiesData, error: entitiesError } = await supabase
        .from("entities")
        .select()
        .order("name");

      if (entitiesError) throw entitiesError;
      setEntities(entitiesData || []);

      // Fetch all regions with entity names
      const { data: regionsData, error: regionsError } = await supabase
        .from("regions")
        .select("*, entities(name)")
        .order("name");

      if (regionsError) throw regionsError;

      const formattedRegions =
        regionsData?.map((region) => ({
          ...region,
          entity_name: region.entities?.name,
        })) || [];

      setRegions(formattedRegions);

      // Fetch all locations with region and entity names
      const { data: locationsData, error: locationsError } = await supabase
        .from("locations")
        .select("*, regions(name, entity_id, entities(name))")
        .order("name");

      if (locationsError) throw locationsError;

      const formattedLocations =
        locationsData?.map((location) => ({
          ...location,
          region_name: location.regions?.name,
          entity_name: location.regions?.entities?.name,
        })) || [];

      setLocations(formattedLocations);

      // Fetch all groups
      const { data: groupsData, error: groupsError } = await supabase
        .from("groups")
        .select()
        .order("id");

      if (groupsError) throw groupsError;
      setGroups(groupsData || []);

      // Fetch all group-location mappings with names
      try {
        const { data: groupLocationsData, error: groupLocationsError } =
          await supabase
            .from("group_locations")
            .select("*, groups(*), locations(*)");

        if (groupLocationsError) throw groupLocationsError;

        const formattedGroupLocations =
          groupLocationsData?.map((groupLocation) => ({
            ...groupLocation,
            group_name: groupLocation.groups?.name,
            location_name: groupLocation.locations?.name,
          })) || [];

        setGroupLocations(formattedGroupLocations);
      } catch (error) {
        console.error("Error fetching group locations:", error);
        setGroupLocations([]);
      }

      // Filter entities and locations based on user role
      if (userRoleData) {
        if (
          userRoleData.role === "organization_admin" &&
          userRoleData.organization_id
        ) {
          // Organization admin can see all entities and locations in their organization
          // This would require additional data fetching to get entities by organization_id
          // For now, we'll default to all entities and locations
          setUserEntities(entitiesData || []);
          setUserRegions(formattedRegions); // Keeping for backward compatibility
          setUserLocations(formattedLocations);
        } else if (
          userRoleData.role === "entity_admin" &&
          userRoleData.entity_id
        ) {
          // Entity admin can see their entity and all its locations
          const userEntityList =
            entitiesData?.filter((e) => e.id === userRoleData.entity_id) || [];
          setUserEntities(userEntityList);

          // For backward compatibility
          setUserRegions(
            formattedRegions.filter(
              (r) => r.entity_id === userRoleData.entity_id,
            ),
          );

          const userLocationList = formattedLocations.filter((l) => {
            return l.entity_id === userRoleData.entity_id;
          });
          setUserLocations(userLocationList);
        } else if (
          (userRoleData.role === "location_manager" ||
            userRoleData.role === "agent") &&
          userRoleData.location_id
        ) {
          // Location manager or agent can only see their location
          const location = formattedLocations.find(
            (l) => l.id === userRoleData.location_id,
          );
          if (location) {
            const entityId = location.entity_id;

            const userEntityList = entityId
              ? entitiesData?.filter((e) => e.id === entityId) || []
              : [];
            setUserEntities(userEntityList);

            // For backward compatibility
            const region = formattedRegions.find(
              (r) => r.entity_id === entityId,
            );
            const userRegionList = region ? [region] : [];
            setUserRegions(userRegionList);

            setUserLocations([location]);
          } else {
            setUserEntities([]);
            setUserRegions([]);
            setUserLocations([]);
          }
        } else {
          // Staff or unknown role - no access
          setUserEntities([]);
          setUserRegions([]);
          setUserLocations([]);
        }
      } else {
        // No role assigned yet - default to all access for now
        // In a production app, you might want to restrict this
        setUserEntities(entitiesData || []);
        setUserRegions(formattedRegions);
        setUserLocations(formattedLocations);
      }

      // Set current location if not already set
      if (!currentLocation && formattedLocations.length > 0) {
        // If user has specific locations, use the first one
        if (userRoleData?.location_id) {
          const userLocation = formattedLocations.find(
            (l) => l.id === userRoleData.location_id,
          );
          if (userLocation) setCurrentLocation(userLocation);
        }
        // Otherwise use the first available location
        else if (formattedLocations.length > 0) {
          setCurrentLocation(formattedLocations[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching location data:", err);
      setError("Failed to load location data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Helper functions to check access permissions
  const hasAccessToEntity = (entityId: string): boolean => {
    if (!userRole) return true; // Default to full access if no role set

    if (userRole.role === "entity_admin") {
      return userRole.entity_id === entityId;
    }

    // For regional managers, check if the entity contains their region
    if (userRole.role === "regional_manager" && userRole.region_id) {
      const region = regions.find((r) => r.id === userRole.region_id);
      return region?.entity_id === entityId;
    }

    // For location managers and agents, check if their location is in this entity
    if (
      (userRole.role === "location_manager" || userRole.role === "agent") &&
      userRole.location_id
    ) {
      const location = locations.find((l) => l.id === userRole.location_id);
      if (!location) return false;

      const region = regions.find((r) => r.id === location.region_id);
      return region?.entity_id === entityId;
    }

    return false;
  };

  const hasAccessToRegion = (regionId: string): boolean => {
    if (!userRole) return true; // Default to full access if no role set

    if (userRole.role === "entity_admin" && userRole.entity_id) {
      const region = regions.find((r) => r.id === regionId);
      return region?.entity_id === userRole.entity_id;
    }

    if (userRole.role === "regional_manager") {
      return userRole.region_id === regionId;
    }

    // For location managers and agents, check if their location is in this region
    if (
      (userRole.role === "location_manager" || userRole.role === "agent") &&
      userRole.location_id
    ) {
      const location = locations.find((l) => l.id === userRole.location_id);
      return location?.region_id === regionId;
    }

    return false;
  };

  const hasAccessToLocation = (locationId: string): boolean => {
    if (!userRole) return true; // Default to full access if no role set

    if (userRole.role === "entity_admin" && userRole.entity_id) {
      const location = locations.find((l) => l.id === locationId);
      if (!location) return false;
      return location.entity_id === userRole.entity_id;
    }

    if (userRole.role === "location_manager" || userRole.role === "agent") {
      return userRole.location_id === locationId;
    }

    return false;
  };

  const value = useMemo(
    () => ({
      entities,
      regions,
      locations,
      groups,
      groupLocations,
      userRole,
      userEntities,
      userRegions,
      userLocations,
      currentLocation,
      setCurrentLocation,
      loading,
      error,
      refreshData: fetchData,
      hasAccessToEntity,
      hasAccessToRegion,
      hasAccessToLocation,
    }),
    [
      entities,
      regions,
      locations,
      groups,
      groupLocations,
      userRole,
      userEntities,
      userRegions,
      userLocations,
      currentLocation,
      loading,
      error,
    ],
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

// Export the hook as a function declaration to fix HMR invalidation
export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
