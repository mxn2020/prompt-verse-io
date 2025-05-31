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
      agents: {
        Row: {
          created_at: string
          description: string | null
          flow_id: string | null
          id: string
          last_run_at: string | null
          name: string
          next_run_at: string | null
          owner_id: string
          prompt_id: string | null
          schedule: Json
          settings: Json
          status: Database["public"]["Enums"]["agent_status"]
          updated_at: string
          webhook_url: string | null
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          flow_id?: string | null
          id?: string
          last_run_at?: string | null
          name: string
          next_run_at?: string | null
          owner_id: string
          prompt_id?: string | null
          schedule?: Json
          settings?: Json
          status?: Database["public"]["Enums"]["agent_status"]
          updated_at?: string
          webhook_url?: string | null
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          flow_id?: string | null
          id?: string
          last_run_at?: string | null
          name?: string
          next_run_at?: string | null
          owner_id?: string
          prompt_id?: string | null
          schedule?: Json
          settings?: Json
          status?: Database["public"]["Enums"]["agent_status"]
          updated_at?: string
          webhook_url?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agents_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "flows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agents_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agents_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agents_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          }
        ]
      }
      blocks: {
        Row: {
          block_type: string
          content: string
          created_at: string
          description: string | null
          id: string
          name: string
          owner_id: string
          tags: string[]
          updated_at: string
          visibility: Database["public"]["Enums"]["visibility_type"]
          workspace_id: string | null
        }
        Insert: {
          block_type?: string
          content: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          owner_id: string
          tags?: string[]
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_type"]
          workspace_id?: string | null
        }
        Update: {
          block_type?: string
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          tags?: string[]
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_type"]
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blocks_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          }
        ]
      }
      comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          flow_id: string | null
          id: string
          module_id: string | null
          parent_id: string | null
          prompt_id: string | null
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          flow_id?: string | null
          id?: string
          module_id?: string | null
          parent_id?: string | null
          prompt_id?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          flow_id?: string | null
          id?: string
          module_id?: string | null
          parent_id?: string | null
          prompt_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "flows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          }
        ]
      }
      execution_logs: {
        Row: {
          agent_id: string | null
          cost: number | null
          created_at: string
          error_message: string | null
          execution_time_ms: number | null
          flow_id: string | null
          id: string
          input_data: Json | null
          model_settings: Json | null
          output_data: Json | null
          prompt_id: string | null
          status: string | null
          tokens_used: number | null
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          cost?: number | null
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          flow_id?: string | null
          id?: string
          input_data?: Json | null
          model_settings?: Json | null
          output_data?: Json | null
          prompt_id?: string | null
          status?: string | null
          tokens_used?: number | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          cost?: number | null
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          flow_id?: string | null
          id?: string
          input_data?: Json | null
          model_settings?: Json | null
          output_data?: Json | null
          prompt_id?: string | null
          status?: string | null
          tokens_used?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "execution_logs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "execution_logs_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "flows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "execution_logs_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "execution_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      flow_steps: {
        Row: {
          conditions: Json
          created_at: string
          flow_id: string
          id: string
          position: number
          prompt_id: string
          settings: Json
        }
        Insert: {
          conditions?: Json
          created_at?: string
          flow_id: string
          id?: string
          position: number
          prompt_id: string
          settings?: Json
        }
        Update: {
          conditions?: Json
          created_at?: string
          flow_id?: string
          id?: string
          position?: number
          prompt_id?: string
          settings?: Json
        }
        Relationships: [
          {
            foreignKeyName: "flow_steps_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "flows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flow_steps_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          }
        ]
      }
      flows: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          owner_id: string
          settings: Json
          status: Database["public"]["Enums"]["flow_status"]
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          owner_id: string
          settings?: Json
          status?: Database["public"]["Enums"]["flow_status"]
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          settings?: Json
          status?: Database["public"]["Enums"]["flow_status"]
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flows_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flows_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          }
        ]
      }
      model_patterns: {
        Row: {
          created_at: string
          description: string | null
          id: string
          model_name: string
          name: string
          owner_id: string
          settings: Json
          tags: string[]
          updated_at: string
          visibility: Database["public"]["Enums"]["visibility_type"]
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          model_name: string
          name: string
          owner_id: string
          settings: Json
          tags?: string[]
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_type"]
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          model_name?: string
          name?: string
          owner_id?: string
          settings?: Json
          tags?: string[]
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_type"]
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "model_patterns_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "model_patterns_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          }
        ]
      }
      modules: {
        Row: {
          content: string
          created_at: string
          description: string | null
          id: string
          name: string
          owner_id: string
          tags: string[]
          updated_at: string
          usage_count: number
          variables: Json
          visibility: Database["public"]["Enums"]["visibility_type"]
          workspace_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          owner_id: string
          tags?: string[]
          updated_at?: string
          usage_count?: number
          variables?: Json
          visibility?: Database["public"]["Enums"]["visibility_type"]
          workspace_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          tags?: string[]
          updated_at?: string
          usage_count?: number
          variables?: Json
          visibility?: Database["public"]["Enums"]["visibility_type"]
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "modules_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "modules_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          }
        ]
      }
      prompt_modules: {
        Row: {
          created_at: string
          id: string
          module_id: string
          position: number
          prompt_id: string
          variables: Json
        }
        Insert: {
          created_at?: string
          id?: string
          module_id: string
          position: number
          prompt_id: string
          variables?: Json
        }
        Update: {
          created_at?: string
          id?: string
          module_id?: string
          position?: number
          prompt_id?: string
          variables?: Json
        }
        Relationships: [
          {
            foreignKeyName: "prompt_modules_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_modules_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          }
        ]
      }
      prompts: {
        Row: {
          content: string
          created_at: string
          description: string | null
          id: string
          model_settings: Json
          owner_id: string
          parent_id: string | null
          prompt_type: Database["public"]["Enums"]["prompt_type"]
          starred: boolean
          tags: string[]
          title: string
          updated_at: string
          usage_count: number
          version: number
          visibility: Database["public"]["Enums"]["visibility_type"]
          workspace_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          description?: string | null
          id?: string
          model_settings?: Json
          owner_id: string
          parent_id?: string | null
          prompt_type?: Database["public"]["Enums"]["prompt_type"]
          starred?: boolean
          tags?: string[]
          title: string
          updated_at?: string
          usage_count?: number
          version?: number
          visibility?: Database["public"]["Enums"]["visibility_type"]
          workspace_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          model_settings?: Json
          owner_id?: string
          parent_id?: string | null
          prompt_type?: Database["public"]["Enums"]["prompt_type"]
          starred?: boolean
          tags?: string[]
          title?: string
          updated_at?: string
          usage_count?: number
          version?: number
          visibility?: Database["public"]["Enums"]["visibility_type"]
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompts_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompts_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          }
        ]
      }
      stripe_customers: {
        Row: {
          created_at: string | null
          customer_id: string
          deleted_at: string | null
          id: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          deleted_at?: string | null
          id?: never
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          deleted_at?: string | null
          id?: never
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stripe_customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      stripe_orders: {
        Row: {
          amount_subtotal: number
          amount_total: number
          checkout_session_id: string
          created_at: string | null
          currency: string
          customer_id: string
          deleted_at: string | null
          id: number
          payment_intent_id: string
          payment_status: string
          status: Database["public"]["Enums"]["stripe_order_status"]
          updated_at: string | null
        }
        Insert: {
          amount_subtotal: number
          amount_total: number
          checkout_session_id: string
          created_at?: string | null
          currency: string
          customer_id: string
          deleted_at?: string | null
          id?: never
          payment_intent_id: string
          payment_status: string
          status?: Database["public"]["Enums"]["stripe_order_status"]
          updated_at?: string | null
        }
        Update: {
          amount_subtotal?: number
          amount_total?: number
          checkout_session_id?: string
          created_at?: string | null
          currency?: string
          customer_id?: string
          deleted_at?: string | null
          id?: never
          payment_intent_id?: string
          payment_status?: string
          status?: Database["public"]["Enums"]["stripe_order_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      stripe_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: number | null
          current_period_start: number | null
          customer_id: string
          deleted_at: string | null
          id: number
          payment_method_brand: string | null
          payment_method_last4: string | null
          price_id: string | null
          status: Database["public"]["Enums"]["stripe_subscription_status"]
          subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: number | null
          current_period_start?: number | null
          customer_id: string
          deleted_at?: string | null
          id?: never
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          price_id?: string | null
          status: Database["public"]["Enums"]["stripe_subscription_status"]
          subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: number | null
          current_period_start?: number | null
          customer_id?: string
          deleted_at?: string | null
          id?: never
          payment_method_brand?: string | null
          payment_method_last4?: string | null
          price_id?: string | null
          status?: Database["public"]["Enums"]["stripe_subscription_status"]
          subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      team_memberships: {
        Row: {
          id: string
          joined_at: string
          role: string
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role?: string
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_memberships_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      teams: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          owner_id: string
          settings: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          owner_id: string
          settings?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          settings?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          name: string | null
          plan_tier: string
          preferences: Json
          role: string
          team_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          name?: string | null
          plan_tier?: string
          preferences?: Json
          role?: string
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string | null
          plan_tier?: string
          preferences?: Json
          role?: string
          team_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      wrappers: {
        Row: {
          content: string
          created_at: string
          description: string | null
          id: string
          name: string
          owner_id: string
          tags: string[]
          template: string
          updated_at: string
          variables: Json
          visibility: Database["public"]["Enums"]["visibility_type"]
          workspace_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          owner_id: string
          tags?: string[]
          template: string
          updated_at?: string
          variables?: Json
          visibility?: Database["public"]["Enums"]["visibility_type"]
          workspace_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          tags?: string[]
          template?: string
          updated_at?: string
          variables?: Json
          visibility?: Database["public"]["Enums"]["visibility_type"]
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wrappers_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wrappers_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          }
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          owner_id: string
          settings: Json
          team_id: string | null
          updated_at: string
          visibility: Database["public"]["Enums"]["visibility_type"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          owner_id: string
          settings?: Json
          team_id?: string | null
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_type"]
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          settings?: Json
          team_id?: string | null
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility_type"]
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspaces_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      stripe_user_orders: {
        Row: {
          amount_subtotal: number | null
          amount_total: number | null
          checkout_session_id: string | null
          currency: string | null
          customer_id: string | null
          order_date: string | null
          order_id: number | null
          order_status: Database["public"]["Enums"]["stripe_order_status"] | null
          payment_intent_id: string | null
          payment_status: string | null
        }
        Relationships: []
      }
      stripe_user_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          current_period_end: number | null
          current_period_start: number | null
          customer_id: string | null
          payment_method_brand: string | null
          payment_method_last4: string | null
          price_id: string | null
          subscription_id: string | null
          subscription_status: Database["public"]["Enums"]["stripe_subscription_status"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      agent_status: "inactive" | "active" | "paused" | "error"
      flow_status: "draft" | "active" | "paused" | "archived"
      prompt_type: "standard" | "structured" | "modularized" | "advanced"
      stripe_order_status: "pending" | "completed" | "canceled"
      stripe_subscription_status:
        | "not_started"
        | "incomplete"
        | "incomplete_expired"
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "unpaid"
        | "paused"
      visibility_type: "private" | "team" | "public"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}