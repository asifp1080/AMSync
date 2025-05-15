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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle2,
  Edit,
  Plus,
  Trash2,
  MapPin,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Employee {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  phone?: string;
  hire_date?: string;
  locations: {
    id: string;
    name: string;
    entity_name?: string;
    region_name?: string;
  }[];
}

export default function EmployeeManagement() {
  const { userLocations, hasAccessToLocation } = useLocation();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  // Employee form state
  const [employeeForm, setEmployeeForm] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    role: "agent",
    phone: "",
    hire_date: "",
    selectedLocations: [] as string[],
  });

  // Fetch employees
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      // Fetch employees with their assigned locations
      const { data: employeesData, error: employeesError } = await supabase
        .from("employees")
        .select("*");

      if (employeesError) throw employeesError;

      // Fetch employee locations
      const { data: employeeLocationsData, error: locationsError } =
        await supabase
          .from("employee_locations")
          .select(
            "employee_id, location_id, locations(id, name, regions(name, entities(name)))",
          );

      if (locationsError) throw locationsError;

      // Map locations to employees
      const employeesWithLocations = employeesData.map((employee: any) => {
        const locations = employeeLocationsData
          .filter((el: any) => el.employee_id === employee.id)
          .map((el: any) => ({
            id: el.location_id,
            name: el.locations?.name || "Unknown Location",
            region_name: el.locations?.regions?.name || "Unknown Region",
            entity_name:
              el.locations?.regions?.entities?.name || "Unknown Entity",
          }));

        return {
          ...employee,
          locations,
        };
      });

      setEmployees(employeesWithLocations);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setErrorMessage("Failed to fetch employees");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployeeForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (value: string) => {
    setEmployeeForm((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const handleLocationToggle = (locationId: string) => {
    setEmployeeForm((prev) => {
      const selectedLocations = [...prev.selectedLocations];
      if (selectedLocations.includes(locationId)) {
        return {
          ...prev,
          selectedLocations: selectedLocations.filter(
            (id) => id !== locationId,
          ),
        };
      } else {
        return {
          ...prev,
          selectedLocations: [...selectedLocations, locationId],
        };
      }
    });
  };

  const handleEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      if (employeeForm.id) {
        // Update existing employee
        const { error } = await supabase
          .from("employees")
          .update({
            first_name: employeeForm.first_name,
            last_name: employeeForm.last_name,
            email: employeeForm.email,
            role: employeeForm.role,
            phone: employeeForm.phone || null,
            hire_date: employeeForm.hire_date || null,
          })
          .eq("id", employeeForm.id);

        if (error) throw error;

        // Delete existing location assignments
        const { error: deleteError } = await supabase
          .from("employee_locations")
          .delete()
          .eq("employee_id", employeeForm.id);

        if (deleteError) throw deleteError;

        // Add new location assignments
        if (employeeForm.selectedLocations.length > 0) {
          const locationAssignments = employeeForm.selectedLocations.map(
            (locationId) => ({
              employee_id: employeeForm.id,
              location_id: locationId,
            }),
          );

          const { error: insertError } = await supabase
            .from("employee_locations")
            .insert(locationAssignments);

          if (insertError) throw insertError;
        }

        setSuccessMessage("Employee updated successfully");
      } else {
        // Create new employee
        const { data, error } = await supabase
          .from("employees")
          .insert({
            first_name: employeeForm.first_name,
            last_name: employeeForm.last_name,
            email: employeeForm.email,
            role: employeeForm.role,
            phone: employeeForm.phone || null,
            hire_date: employeeForm.hire_date || null,
          })
          .select();

        if (error) throw error;

        const newEmployeeId = data[0].id;

        // Add location assignments
        if (employeeForm.selectedLocations.length > 0) {
          const locationAssignments = employeeForm.selectedLocations.map(
            (locationId) => ({
              employee_id: newEmployeeId,
              location_id: locationId,
            }),
          );

          const { error: insertError } = await supabase
            .from("employee_locations")
            .insert(locationAssignments);

          if (insertError) throw insertError;
        }

        setSuccessMessage("Employee created successfully");
      }

      // Reset form and refresh data
      setEmployeeForm({
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        role: "agent",
        phone: "",
        hire_date: "",
        selectedLocations: [],
      });
      setDialogOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error saving employee:", error);
      setErrorMessage("Failed to save employee");
    } finally {
      setIsLoading(false);
    }
  };

  const editEmployee = (employee: Employee) => {
    setEmployeeForm({
      id: employee.id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      role: employee.role,
      phone: employee.phone || "",
      hire_date: employee.hire_date || "",
      selectedLocations: employee.locations.map((loc) => loc.id),
    });
    setDialogOpen(true);
  };

  const confirmDeleteEmployee = async () => {
    if (!employeeToDelete) return;

    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // Delete location assignments first
      const { error: deleteLocationsError } = await supabase
        .from("employee_locations")
        .delete()
        .eq("employee_id", employeeToDelete);

      if (deleteLocationsError) throw deleteLocationsError;

      // Then delete the employee
      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("id", employeeToDelete);

      if (error) throw error;

      setSuccessMessage("Employee deleted successfully");
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      setErrorMessage("Failed to delete employee");
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employee Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {employeeForm.id ? "Edit" : "Add"} Employee
              </DialogTitle>
              <DialogDescription>
                {employeeForm.id
                  ? "Update employee details below."
                  : "Create a new employee by filling out the form below."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEmployeeSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={employeeForm.first_name}
                      onChange={handleEmployeeChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={employeeForm.last_name}
                      onChange={handleEmployeeChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={employeeForm.email}
                    onChange={handleEmployeeChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={employeeForm.role}
                      onValueChange={handleRoleChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="agent">Agent</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={employeeForm.phone}
                      onChange={handleEmployeeChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      value={employeeForm.date_of_birth}
                      onChange={handleEmployeeChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hire_date">Hire Date</Label>
                    <Input
                      id="hire_date"
                      name="hire_date"
                      type="date"
                      value={employeeForm.hire_date}
                      onChange={handleEmployeeChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={employeeForm.address}
                    onChange={handleEmployeeChange}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={employeeForm.city}
                      onChange={handleEmployeeChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={employeeForm.state}
                      onChange={handleEmployeeChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip_code">Zip Code</Label>
                    <Input
                      id="zip_code"
                      name="zip_code"
                      value={employeeForm.zip_code}
                      onChange={handleEmployeeChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_name">
                      Emergency Contact Name
                    </Label>
                    <Input
                      id="emergency_contact_name"
                      name="emergency_contact_name"
                      value={employeeForm.emergency_contact_name}
                      onChange={handleEmployeeChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_phone">
                      Emergency Contact Phone
                    </Label>
                    <Input
                      id="emergency_contact_phone"
                      name="emergency_contact_phone"
                      value={employeeForm.emergency_contact_phone}
                      onChange={handleEmployeeChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employment_type">Employment Type</Label>
                    <Select
                      value={employeeForm.employment_type || ""}
                      onValueChange={(value) =>
                        setEmployeeForm((prev) => ({
                          ...prev,
                          employment_type: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="temporary">Temporary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      name="department"
                      value={employeeForm.department}
                      onChange={handleEmployeeChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      name="position"
                      value={employeeForm.position}
                      onChange={handleEmployeeChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Assigned Locations</Label>
                  <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                    {userLocations.length > 0 ? (
                      userLocations.map((location) => (
                        <div
                          key={location.id}
                          className="flex items-center space-x-2 py-2"
                        >
                          <input
                            type="checkbox"
                            id={`location-${location.id}`}
                            checked={employeeForm.selectedLocations.includes(
                              location.id,
                            )}
                            onChange={() => handleLocationToggle(location.id)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <label
                            htmlFor={`location-${location.id}`}
                            className="text-sm flex-1"
                          >
                            <div className="font-medium">{location.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {location.entity_name} &gt; {location.region_name}
                            </div>
                          </label>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No locations available
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? "Saving..."
                    : employeeForm.id
                      ? "Update Employee"
                      : "Create Employee"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Locations</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">
                      {employee.first_name} {employee.last_name}
                    </TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>
                      {employee.role.charAt(0).toUpperCase() +
                        employee.role.slice(1)}
                    </TableCell>
                    <TableCell>
                      {employee.locations.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {employee.locations.map((location) => (
                            <div
                              key={location.id}
                              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80"
                            >
                              <MapPin className="mr-1 h-3 w-3" />
                              {location.name}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          No locations assigned
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => editEmployee(employee)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEmployeeToDelete(employee.id);
                            setDeleteDialogOpen(true);
                          }}
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
                    {isLoading
                      ? "Loading employees..."
                      : "No employees found. Add your first employee to get started."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              employee and remove all location assignments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteEmployee}
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
