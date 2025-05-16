import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import LocationHierarchy from "./LocationHierarchy";
import OrganizationManagement from "./OrganizationManagement";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="hierarchy" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="hierarchy">Location Hierarchy</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="users">Users & Permissions</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="hierarchy" className="space-y-4">
          <div className="p-4 mb-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-sm font-medium text-blue-800">
              Updated Hierarchy Structure
            </h3>
            <p className="text-sm text-blue-600">
              The location hierarchy has been updated to follow the Organization
              → Entity → Location structure.
            </p>
          </div>
          <LocationHierarchy />
        </TabsContent>

        <TabsContent value="organizations" className="space-y-4">
          <OrganizationManagement />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Users & Permissions</h2>
            <p>
              User management and permission settings will be available here.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <div className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Integrations</h2>
            <p>Configure third-party integrations here.</p>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <div className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Billing</h2>
            <p>Manage your subscription and billing information here.</p>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <div className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Preferences</h2>
            <p>Configure your application preferences here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
