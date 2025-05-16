export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      communications: {
        Row: {
          content: string
          created_at: string | null
          customer_id: string
          date: string | null
          from_user: string
          id: string
          type: string
        }
        Insert: {
          content: string
          created_at?: string | null
          customer_id: string
          date?: string | null
          from_user: string
          id?: string
          type: string
        }
        Update: {
          content?: string
          created_at?: string | null
          customer_id?: string
          date?: string | null
          from_user?: string
          id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "communications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          email: string
          id: string
          last_contact: string | null
          location_id: string | null
          name: string
          phone: string | null
          state: string | null
          status: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email: string
          id?: string
          last_contact?: string | null
          location_id?: string | null
          name: string
          phone?: string | null
          state?: string | null
          status?: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string
          id?: string
          last_contact?: string | null
          location_id?: string | null
          name?: string
          phone?: string | null
          state?: string | null
          status?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_locations: {
        Row: {
          created_at: string | null
          employee_id: string
          id: string
          location_id: string
        }
        Insert: {
          created_at?: string | null
          employee_id: string
          id?: string
          location_id: string
        }
        Update: {
          created_at?: string | null
          employee_id?: string
          id?: string
          location_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_locations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_locations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          hire_date: string | null
          id: string
          last_name: string
          phone: string | null
          role: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          hire_date?: string | null
          id?: string
          last_name: string
          phone?: string | null
          role: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          hire_date?: string | null
          id?: string
          last_name?: string
          phone?: string | null
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      entities: {
        Row: {
          associated_regions: string[] | null
          city: string | null
          country: string | null
          created_at: string | null
          default_currency: string | null
          description: string | null
          e_and_o_liability_coverage: string | null
          e_and_o_policy_expiration_date: string | null
          e_and_o_policy_number: string | null
          ein: string | null
          email_marketing_enabled: boolean | null
          entity_type: string
          gl_liability_coverage: string | null
          gl_policy_expiration_date: string | null
          gl_policy_number: string | null
          headquarters_address: string | null
          id: string
          ip_whitelist: string[] | null
          legal_entity_type: string | null
          license_expiration_date: string | null
          license_number: string | null
          name: string
          organization_id: string | null
          preferred_notification_channels: string[] | null
          primary_contact_email: string | null
          primary_contact_name: string | null
          primary_contact_phone: string | null
          sms_marketing_enabled: boolean | null
          state: string | null
          status: string | null
          stripe_account_id: string | null
          time_zone: string | null
          updated_at: string | null
          uploaded_documents: Json | null
          zip_code: string | null
        }
        Insert: {
          associated_regions?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          default_currency?: string | null
          description?: string | null
          e_and_o_liability_coverage?: string | null
          e_and_o_policy_expiration_date?: string | null
          e_and_o_policy_number?: string | null
          ein?: string | null
          email_marketing_enabled?: boolean | null
          entity_type: string
          gl_liability_coverage?: string | null
          gl_policy_expiration_date?: string | null
          gl_policy_number?: string | null
          headquarters_address?: string | null
          id?: string
          ip_whitelist?: string[] | null
          legal_entity_type?: string | null
          license_expiration_date?: string | null
          license_number?: string | null
          name: string
          organization_id?: string | null
          preferred_notification_channels?: string[] | null
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          sms_marketing_enabled?: boolean | null
          state?: string | null
          status?: string | null
          stripe_account_id?: string | null
          time_zone?: string | null
          updated_at?: string | null
          uploaded_documents?: Json | null
          zip_code?: string | null
        }
        Update: {
          associated_regions?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          default_currency?: string | null
          description?: string | null
          e_and_o_liability_coverage?: string | null
          e_and_o_policy_expiration_date?: string | null
          e_and_o_policy_number?: string | null
          ein?: string | null
          email_marketing_enabled?: boolean | null
          entity_type?: string
          gl_liability_coverage?: string | null
          gl_policy_expiration_date?: string | null
          gl_policy_number?: string | null
          headquarters_address?: string | null
          id?: string
          ip_whitelist?: string[] | null
          legal_entity_type?: string | null
          license_expiration_date?: string | null
          license_number?: string | null
          name?: string
          organization_id?: string | null
          preferred_notification_channels?: string[] | null
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          sms_marketing_enabled?: boolean | null
          state?: string | null
          status?: string | null
          stripe_account_id?: string | null
          time_zone?: string | null
          updated_at?: string | null
          uploaded_documents?: Json | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      group_locations: {
        Row: {
          added_on: string | null
          group_id: string
          location_id: string
          mapping_id: string
        }
        Insert: {
          added_on?: string | null
          group_id: string
          location_id: string
          mapping_id?: string
        }
        Update: {
          added_on?: string | null
          group_id?: string
          location_id?: string
          mapping_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_locations_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_locations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string | null
          group_description: string | null
          group_manager_id: string | null
          group_name: string
          group_tags: string[] | null
          id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          group_description?: string | null
          group_manager_id?: string | null
          group_name: string
          group_tags?: string[] | null
          id?: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          group_description?: string | null
          group_manager_id?: string | null
          group_name?: string
          group_tags?: string[] | null
          id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_group_manager_id_fkey"
            columns: ["group_manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          address_line_1: string | null
          address_line_2: string | null
          allowed_ip_ranges: string[] | null
          assigned_employees: string[] | null
          assigned_policies: string[] | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string | null
          entity_id: string
          hours_of_operation: string | null
          id: string
          ip_whitelist: string[] | null
          location_type: string | null
          name: string
          notes: string | null
          operating_hours: Json | null
          phone: string | null
          primary_contact_email: string | null
          primary_contact_name: string | null
          primary_contact_phone: string | null
          state: string | null
          status: string | null
          stripe_location_account_id: string | null
          time_zone: string | null
          updated_at: string | null
          uploaded_documents: Json | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          address_line_1?: string | null
          address_line_2?: string | null
          allowed_ip_ranges?: string[] | null
          assigned_employees?: string[] | null
          assigned_policies?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          entity_id: string
          hours_of_operation?: string | null
          id?: string
          ip_whitelist?: string[] | null
          location_type?: string | null
          name: string
          notes?: string | null
          operating_hours?: Json | null
          phone?: string | null
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          state?: string | null
          status?: string | null
          stripe_location_account_id?: string | null
          time_zone?: string | null
          updated_at?: string | null
          uploaded_documents?: Json | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          address_line_1?: string | null
          address_line_2?: string | null
          allowed_ip_ranges?: string[] | null
          assigned_employees?: string[] | null
          assigned_policies?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          entity_id?: string
          hours_of_operation?: string | null
          id?: string
          ip_whitelist?: string[] | null
          location_type?: string | null
          name?: string
          notes?: string | null
          operating_hours?: Json | null
          phone?: string | null
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          state?: string | null
          status?: string | null
          stripe_location_account_id?: string | null
          time_zone?: string | null
          updated_at?: string | null
          uploaded_documents?: Json | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          billing_address: string | null
          billing_email: string | null
          city: string | null
          country: string | null
          created_at: string | null
          description: string | null
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          primary_contact_email: string | null
          primary_contact_name: string | null
          primary_contact_phone: string | null
          state: string | null
          status: string | null
          subscription_renewal_date: string | null
          subscription_status: string | null
          subscription_tier: string | null
          tax_id: string | null
          updated_at: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          billing_address?: string | null
          billing_email?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          state?: string | null
          status?: string | null
          subscription_renewal_date?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          tax_id?: string | null
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          billing_address?: string | null
          billing_email?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          state?: string | null
          status?: string | null
          subscription_renewal_date?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          tax_id?: string | null
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      policies: {
        Row: {
          created_at: string | null
          customer_id: string
          end_date: string
          id: string
          location_id: string | null
          policy_number: string
          policy_type: string
          premium: number
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          end_date: string
          id?: string
          location_id?: string | null
          policy_number: string
          policy_type: string
          premium: number
          start_date: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          end_date?: string
          id?: string
          location_id?: string | null
          policy_number?: string
          policy_type?: string
          premium?: number
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "policies_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policies_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          customer_id: string
          date: string | null
          id: string
          location_id: string | null
          policy_id: string | null
          status: string
          transaction_id: string
          type: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          customer_id: string
          date?: string | null
          id?: string
          location_id?: string | null
          policy_id?: string | null
          status?: string
          transaction_id: string
          type: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          customer_id?: string
          date?: string | null
          id?: string
          location_id?: string | null
          policy_id?: string | null
          status?: string
          transaction_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          entity_id: string | null
          location_id: string | null
          organization_id: string | null
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          entity_id?: string | null
          location_id?: string | null
          organization_id?: string | null
          role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          entity_id?: string | null
          location_id?: string | null
          organization_id?: string | null
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
