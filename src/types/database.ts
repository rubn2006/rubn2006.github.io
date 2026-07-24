// Hand-written to exactly match supabase/migrations/*.sql, in the same shape
// `supabase gen types typescript` produces. If you have Docker available,
// regenerate with `npm run db:types` against a running local stack and this
// file will be replaced 1:1 — keep the two in sync until then.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: string;
          stripe_customer_id: string | null;
          onboarding_completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: string;
          stripe_customer_id?: string | null;
          onboarding_completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      user_preferences: {
        Row: {
          user_id: string;
          profile_kind: string | null;
          content_type: string | null;
          main_platform: string | null;
          experience_level: string | null;
          monthly_goal: string | null;
          preferred_style: string | null;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          profile_kind?: string | null;
          content_type?: string | null;
          main_platform?: string | null;
          experience_level?: string | null;
          monthly_goal?: string | null;
          preferred_style?: string | null;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_preferences"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      credit_wallets: {
        Row: {
          user_id: string;
          balance: number;
          reserved: number;
          lifetime_granted: number;
          lifetime_spent: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          balance?: number;
          reserved?: number;
          lifetime_granted?: number;
          lifetime_spent?: number;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["credit_wallets"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "credit_wallets_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      credit_transactions: {
        Row: {
          id: string;
          user_id: string;
          type: Database["public"]["Enums"]["credit_transaction_type"];
          amount: number;
          balance_before: number;
          balance_after: number;
          project_id: string | null;
          generation_id: string | null;
          provider: string | null;
          reason: string | null;
          idempotency_key: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: Database["public"]["Enums"]["credit_transaction_type"];
          amount: number;
          balance_before: number;
          balance_after: number;
          project_id?: string | null;
          generation_id?: string | null;
          provider?: string | null;
          reason?: string | null;
          idempotency_key: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["credit_transactions"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "credit_transactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "credit_transactions_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "credit_transactions_generation_id_fkey";
            columns: ["generation_id"];
            isOneToOne: false;
            referencedRelation: "generation_jobs";
            referencedColumns: ["id"];
          },
        ];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: Database["public"]["Enums"]["subscription_plan"];
          status: Database["public"]["Enums"]["subscription_status"];
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          stripe_price_id: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          canceled_at: string | null;
          last_monthly_grant_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan?: Database["public"]["Enums"]["subscription_plan"];
          status?: Database["public"]["Enums"]["subscription_status"];
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          canceled_at?: string | null;
          last_monthly_grant_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          type: Database["public"]["Enums"]["project_type"];
          default_platform: string | null;
          cover_asset_id: string | null;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          type?: Database["public"]["Enums"]["project_type"];
          default_platform?: string | null;
          cover_asset_id?: string | null;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "projects_cover_asset_fk";
            columns: ["cover_asset_id"];
            isOneToOne: false;
            referencedRelation: "assets";
            referencedColumns: ["id"];
          },
        ];
      };
      series: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          name: string;
          universe_description: string | null;
          visual_style: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          name: string;
          universe_description?: string | null;
          visual_style?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["series"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "series_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "series_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      characters: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          series_id: string | null;
          name: string;
          description: string | null;
          species: Database["public"]["Enums"]["character_species"];
          species_other: string | null;
          physical_appearance: string | null;
          primary_colors: string[];
          accessories: string[];
          clothing: string | null;
          personality: string | null;
          speech_style: string | null;
          default_emotion: string;
          voice_provider: string | null;
          voice_id: string | null;
          voice_settings: Json;
          primary_reference_asset_id: string | null;
          visual_prompt_locked: string | null;
          negative_prompt: string | null;
          universe: string | null;
          is_locked: boolean;
          is_template: boolean;
          rights_confirmed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          series_id?: string | null;
          name: string;
          description?: string | null;
          species?: Database["public"]["Enums"]["character_species"];
          species_other?: string | null;
          physical_appearance?: string | null;
          primary_colors?: string[];
          accessories?: string[];
          clothing?: string | null;
          personality?: string | null;
          speech_style?: string | null;
          default_emotion?: string;
          voice_provider?: string | null;
          voice_id?: string | null;
          voice_settings?: Json;
          primary_reference_asset_id?: string | null;
          visual_prompt_locked?: string | null;
          negative_prompt?: string | null;
          universe?: string | null;
          is_locked?: boolean;
          is_template?: boolean;
          rights_confirmed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["characters"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "characters_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "characters_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "characters_series_id_fkey";
            columns: ["series_id"];
            isOneToOne: false;
            referencedRelation: "series";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "characters_primary_reference_asset_fk";
            columns: ["primary_reference_asset_id"];
            isOneToOne: false;
            referencedRelation: "assets";
            referencedColumns: ["id"];
          },
        ];
      };
      character_reference_images: {
        Row: {
          id: string;
          character_id: string;
          user_id: string;
          asset_id: string;
          label: string | null;
          is_primary: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          character_id: string;
          user_id: string;
          asset_id: string;
          label?: string | null;
          is_primary?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["character_reference_images"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "character_reference_images_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character_reference_images_asset_fk";
            columns: ["asset_id"];
            isOneToOne: false;
            referencedRelation: "assets";
            referencedColumns: ["id"];
          },
        ];
      };
      episodes: {
        Row: {
          id: string;
          user_id: string;
          project_id: string;
          series_id: string | null;
          title: string | null;
          idea_prompt: string;
          character_ids: string[];
          tone: string | null;
          duration_seconds: number;
          scene_count_target: number;
          target_platform: string | null;
          language: string;
          target_audience: string | null;
          absurdity_level: number | null;
          drama_intensity: number | null;
          call_to_action: string | null;
          visual_style: string | null;
          hook: string | null;
          synopsis: string | null;
          cliffhanger: string | null;
          caption: string | null;
          hashtags: string[];
          status: Database["public"]["Enums"]["generation_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id: string;
          series_id?: string | null;
          title?: string | null;
          idea_prompt: string;
          character_ids?: string[];
          tone?: string | null;
          duration_seconds?: number;
          scene_count_target?: number;
          target_platform?: string | null;
          language?: string;
          target_audience?: string | null;
          absurdity_level?: number | null;
          drama_intensity?: number | null;
          call_to_action?: string | null;
          visual_style?: string | null;
          hook?: string | null;
          synopsis?: string | null;
          cliffhanger?: string | null;
          caption?: string | null;
          hashtags?: string[];
          status?: Database["public"]["Enums"]["generation_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["episodes"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "episodes_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "episodes_series_id_fkey";
            columns: ["series_id"];
            isOneToOne: false;
            referencedRelation: "series";
            referencedColumns: ["id"];
          },
        ];
      };
      storyboards: {
        Row: {
          id: string;
          episode_id: string;
          user_id: string;
          status: Database["public"]["Enums"]["generation_status"];
          version: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          episode_id: string;
          user_id: string;
          status?: Database["public"]["Enums"]["generation_status"];
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["storyboards"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "storyboards_episode_id_fkey";
            columns: ["episode_id"];
            isOneToOne: false;
            referencedRelation: "episodes";
            referencedColumns: ["id"];
          },
        ];
      };
      scenes: {
        Row: {
          id: string;
          storyboard_id: string;
          episode_id: string;
          user_id: string;
          scene_number: number;
          duration_seconds: number;
          visual_description: string | null;
          camera_direction: string | null;
          environment: string | null;
          characters_present: string[];
          character_actions: Json;
          emotions: Json;
          dialogue: Json;
          narration: string | null;
          sound_effects: string[];
          transition: string | null;
          image_prompt: string | null;
          video_prompt: string | null;
          negative_prompt: string | null;
          reference_asset_id: string | null;
          estimated_credit_cost: number;
          status: Database["public"]["Enums"]["generation_status"];
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          storyboard_id: string;
          episode_id: string;
          user_id: string;
          scene_number: number;
          duration_seconds?: number;
          visual_description?: string | null;
          camera_direction?: string | null;
          environment?: string | null;
          characters_present?: string[];
          character_actions?: Json;
          emotions?: Json;
          dialogue?: Json;
          narration?: string | null;
          sound_effects?: string[];
          transition?: string | null;
          image_prompt?: string | null;
          video_prompt?: string | null;
          negative_prompt?: string | null;
          reference_asset_id?: string | null;
          estimated_credit_cost?: number;
          status?: Database["public"]["Enums"]["generation_status"];
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["scenes"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "scenes_storyboard_id_fkey";
            columns: ["storyboard_id"];
            isOneToOne: false;
            referencedRelation: "storyboards";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "scenes_episode_id_fkey";
            columns: ["episode_id"];
            isOneToOne: false;
            referencedRelation: "episodes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "scenes_reference_asset_fk";
            columns: ["reference_asset_id"];
            isOneToOne: false;
            referencedRelation: "assets";
            referencedColumns: ["id"];
          },
        ];
      };
      generation_jobs: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          episode_id: string | null;
          scene_id: string | null;
          job_type: Database["public"]["Enums"]["job_type"];
          status: Database["public"]["Enums"]["generation_status"];
          progress: number;
          step: string | null;
          user_message: string | null;
          internal_error: string | null;
          attempt_count: number;
          max_attempts: number;
          provider: string | null;
          external_id: string | null;
          input_payload: Json;
          output_payload: Json;
          credits_reserved: number;
          credits_debited: number;
          idempotency_key: string | null;
          started_at: string | null;
          finished_at: string | null;
          next_retry_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          episode_id?: string | null;
          scene_id?: string | null;
          job_type: Database["public"]["Enums"]["job_type"];
          status?: Database["public"]["Enums"]["generation_status"];
          progress?: number;
          step?: string | null;
          user_message?: string | null;
          internal_error?: string | null;
          attempt_count?: number;
          max_attempts?: number;
          provider?: string | null;
          external_id?: string | null;
          input_payload?: Json;
          output_payload?: Json;
          credits_reserved?: number;
          credits_debited?: number;
          idempotency_key?: string | null;
          started_at?: string | null;
          finished_at?: string | null;
          next_retry_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["generation_jobs"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "generation_jobs_episode_id_fkey";
            columns: ["episode_id"];
            isOneToOne: false;
            referencedRelation: "episodes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "generation_jobs_scene_id_fkey";
            columns: ["scene_id"];
            isOneToOne: false;
            referencedRelation: "scenes";
            referencedColumns: ["id"];
          },
        ];
      };
      scene_generations: {
        Row: {
          id: string;
          user_id: string;
          scene_id: string;
          job_id: string | null;
          generation_kind: string;
          provider: string;
          model: string | null;
          seed: string | null;
          prompt: string | null;
          negative_prompt: string | null;
          duration_seconds: number | null;
          resolution: string | null;
          cost_credits: number;
          provider_generation_id: string | null;
          status: Database["public"]["Enums"]["generation_status"];
          asset_id: string | null;
          error_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          scene_id: string;
          job_id?: string | null;
          generation_kind: string;
          provider: string;
          model?: string | null;
          seed?: string | null;
          prompt?: string | null;
          negative_prompt?: string | null;
          duration_seconds?: number | null;
          resolution?: string | null;
          cost_credits?: number;
          provider_generation_id?: string | null;
          status?: Database["public"]["Enums"]["generation_status"];
          asset_id?: string | null;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["scene_generations"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "scene_generations_scene_id_fkey";
            columns: ["scene_id"];
            isOneToOne: false;
            referencedRelation: "scenes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "scene_generations_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "generation_jobs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "scene_generations_asset_id_fkey";
            columns: ["asset_id"];
            isOneToOne: false;
            referencedRelation: "assets";
            referencedColumns: ["id"];
          },
        ];
      };
      audio_generations: {
        Row: {
          id: string;
          user_id: string;
          episode_id: string;
          scene_id: string | null;
          character_id: string | null;
          job_id: string | null;
          audio_kind: string;
          provider: string | null;
          voice_id: string | null;
          text_input: string | null;
          language: string;
          speed: number;
          stability: number | null;
          style: string | null;
          duration_seconds: number | null;
          cost_credits: number;
          status: Database["public"]["Enums"]["generation_status"];
          asset_id: string | null;
          error_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          episode_id: string;
          scene_id?: string | null;
          character_id?: string | null;
          job_id?: string | null;
          audio_kind: string;
          provider?: string | null;
          voice_id?: string | null;
          text_input?: string | null;
          language?: string;
          speed?: number;
          stability?: number | null;
          style?: string | null;
          duration_seconds?: number | null;
          cost_credits?: number;
          status?: Database["public"]["Enums"]["generation_status"];
          asset_id?: string | null;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["audio_generations"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "audio_generations_episode_id_fkey";
            columns: ["episode_id"];
            isOneToOne: false;
            referencedRelation: "episodes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "audio_generations_scene_id_fkey";
            columns: ["scene_id"];
            isOneToOne: false;
            referencedRelation: "scenes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "audio_generations_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "characters";
            referencedColumns: ["id"];
          },
        ];
      };
      video_renders: {
        Row: {
          id: string;
          user_id: string;
          episode_id: string;
          job_id: string | null;
          target_platform: string | null;
          resolution: string;
          fps: number;
          has_watermark: boolean;
          subtitle_style: string | null;
          music_asset_id: string | null;
          logo_asset_id: string | null;
          final_asset_id: string | null;
          thumbnail_asset_id: string | null;
          duration_seconds: number | null;
          file_size_bytes: number | null;
          status: Database["public"]["Enums"]["generation_status"];
          error_message: string | null;
          credits_cost: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          episode_id: string;
          job_id?: string | null;
          target_platform?: string | null;
          resolution?: string;
          fps?: number;
          has_watermark?: boolean;
          subtitle_style?: string | null;
          music_asset_id?: string | null;
          logo_asset_id?: string | null;
          final_asset_id?: string | null;
          thumbnail_asset_id?: string | null;
          duration_seconds?: number | null;
          file_size_bytes?: number | null;
          status?: Database["public"]["Enums"]["generation_status"];
          error_message?: string | null;
          credits_cost?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["video_renders"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "video_renders_episode_id_fkey";
            columns: ["episode_id"];
            isOneToOne: false;
            referencedRelation: "episodes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "video_renders_final_asset_id_fkey";
            columns: ["final_asset_id"];
            isOneToOne: false;
            referencedRelation: "assets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "video_renders_thumbnail_asset_id_fkey";
            columns: ["thumbnail_asset_id"];
            isOneToOne: false;
            referencedRelation: "assets";
            referencedColumns: ["id"];
          },
        ];
      };
      assets: {
        Row: {
          id: string;
          user_id: string;
          kind: Database["public"]["Enums"]["asset_kind"];
          bucket: string;
          storage_path: string;
          mime_type: string | null;
          file_size_bytes: number | null;
          width: number | null;
          height: number | null;
          duration_seconds: number | null;
          related_character_id: string | null;
          related_project_id: string | null;
          related_episode_id: string | null;
          related_scene_id: string | null;
          metadata: Json;
          is_temporary: boolean;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          kind: Database["public"]["Enums"]["asset_kind"];
          bucket: string;
          storage_path: string;
          mime_type?: string | null;
          file_size_bytes?: number | null;
          width?: number | null;
          height?: number | null;
          duration_seconds?: number | null;
          related_character_id?: string | null;
          related_project_id?: string | null;
          related_episode_id?: string | null;
          related_scene_id?: string | null;
          metadata?: Json;
          is_temporary?: boolean;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["assets"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "assets_related_character_id_fkey";
            columns: ["related_character_id"];
            isOneToOne: false;
            referencedRelation: "characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "assets_related_project_id_fkey";
            columns: ["related_project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      provider_costs: {
        Row: {
          id: string;
          provider: Database["public"]["Enums"]["provider_kind"];
          provider_name: string;
          model: string | null;
          unit: string;
          cost_usd: number;
          credits_charged: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          provider: Database["public"]["Enums"]["provider_kind"];
          provider_name: string;
          model?: string | null;
          unit: string;
          cost_usd: number;
          credits_charged: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["provider_costs"]["Insert"]>;
        Relationships: [];
      };
      webhook_events: {
        Row: {
          id: string;
          source: string;
          event_type: string;
          external_event_id: string;
          payload: Json;
          processed_at: string | null;
          processing_error: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          source?: string;
          event_type: string;
          external_event_id: string;
          payload: Json;
          processed_at?: string | null;
          processing_error?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["webhook_events"]["Insert"]>;
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          actor_user_id: string | null;
          actor_is_admin: boolean;
          action: string;
          target_table: string | null;
          target_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_user_id?: string | null;
          actor_is_admin?: boolean;
          action: string;
          target_table?: string | null;
          target_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      generation_status:
        | "draft"
        | "queued"
        | "processing"
        | "awaiting_provider"
        | "succeeded"
        | "partially_succeeded"
        | "failed"
        | "cancelled"
        | "refunded";
      subscription_plan: "free" | "starter" | "creator" | "pro";
      subscription_status:
        | "active"
        | "trialing"
        | "past_due"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "unpaid"
        | "paused";
      credit_transaction_type:
        | "grant_signup"
        | "grant_monthly"
        | "purchase"
        | "reservation"
        | "debit"
        | "refund"
        | "adjustment_admin"
        | "expiration";
      project_type: "series" | "standalone_ad";
      character_species: "fruit" | "animal" | "human" | "brainrot" | "mascot" | "object" | "other";
      asset_kind:
        | "character_reference"
        | "scene_image"
        | "scene_clip"
        | "audio_voice"
        | "audio_music"
        | "audio_sfx"
        | "final_video"
        | "thumbnail"
        | "subtitle"
        | "logo"
        | "avatar";
      job_type:
        | "script_generation"
        | "storyboard_generation"
        | "character_reference_generation"
        | "scene_image_generation"
        | "scene_video_generation"
        | "audio_generation"
        | "subtitle_generation"
        | "ffmpeg_render"
        | "upload_final";
      provider_kind: "text" | "image" | "video" | "voice" | "music" | "moderation";
    };
    CompositeTypes: Record<string, never>;
  };
}

type DefaultSchema = Database["public"];

export type Tables<T extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Update"];
export type Enums<T extends keyof DefaultSchema["Enums"]> = DefaultSchema["Enums"][T];
