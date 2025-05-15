import { useState, useEffect } from "react";
import { useLocation } from "@/lib/location-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, MapPin } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

export default function LocationSelector() {
  const {
    userEntities,
    userRegions,
    userLocations,
    currentLocation,
    setCurrentLocation,
    loading,
  } = useLocation();
  const [open, setOpen] = useState(false);

  // Group locations by entity and region for better organization
  const groupedLocations = userLocations.reduce(
    (acc, location) => {
      const entityName = location.entity_name || "Unknown Entity";
      const regionName = location.region_name || "Unknown Region";

      if (!acc[entityName]) {
        acc[entityName] = {};
      }

      if (!acc[entityName][regionName]) {
        acc[entityName][regionName] = [];
      }

      acc[entityName][regionName].push(location);
      return acc;
    },
    {} as Record<string, Record<string, typeof userLocations>>,
  );

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">Loading locations...</span>
      </div>
    );
  }

  if (userLocations.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">No locations available</span>
      </div>
    );
  }

  // If there's only one location, just show it without dropdown
  if (userLocations.length === 1) {
    return (
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        <span className="text-sm font-medium">{userLocations[0].name}</span>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-[200px]"
        >
          <div className="flex items-center gap-2 truncate">
            <MapPin className="h-4 w-4" />
            <span className="truncate">
              {currentLocation?.name || "Select location"}
            </span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search location..." className="h-9" />
          <CommandEmpty>No location found.</CommandEmpty>
          {Object.entries(groupedLocations).map(([entityName, regions]) => (
            <div key={entityName}>
              {Object.entries(regions).map(([regionName, locations]) => (
                <CommandGroup
                  key={`${entityName}-${regionName}`}
                  heading={`${entityName} - ${regionName}`}
                >
                  {locations.map((location) => (
                    <CommandItem
                      key={location.id}
                      value={`${location.name}-${location.id}`}
                      onSelect={() => {
                        setCurrentLocation(location);
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {currentLocation?.id === location.id && (
                          <Check className="h-4 w-4" />
                        )}
                        <span
                          className={
                            currentLocation?.id === location.id
                              ? "ml-0"
                              : "ml-6"
                          }
                        >
                          {location.name}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </div>
          ))}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
