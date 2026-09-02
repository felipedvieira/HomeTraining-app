// Tipos manuais que espelham supabase/schema.sql.
// Se preferir, troque por tipos gerados com `supabase gen types typescript` depois de criar o projeto.

export type CardioPreference = "low" | "moderate" | "high";
export type WorkoutDayStatus = "pending" | "completed" | "skipped";

export interface Database {
  public: {
    Tables: {
      equipment_catalog: {
        Row: {
          id: string;
          name: string;
          category: "cardio" | "strength_machine" | "free_weight" | "bodyweight" | "accessory";
        };
        Insert: Partial<Database["public"]["Tables"]["equipment_catalog"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["equipment_catalog"]["Row"]>;
        Relationships: [];
      };
      profiles: {
        Row: { id: string; display_name: string | null; avatar_url: string | null; created_at: string };
        Insert: { id: string; display_name?: string | null; avatar_url?: string | null };
        Update: { display_name?: string | null; avatar_url?: string | null };
        Relationships: [];
      };
      profile_equipment: {
        Row: { profile_id: string; equipment_id: string };
        Insert: { profile_id: string; equipment_id: string };
        Update: Partial<{ profile_id: string; equipment_id: string }>;
        Relationships: [];
      };
      goals: {
        Row: {
          id: string;
          profile_id: string;
          current_weight_kg: number | null;
          height_cm: number | null;
          weight_loss_target_kg: number;
          duration_days: number;
          days_per_week: number;
          cardio_preference: CardioPreference;
          prefers_free_weights: boolean;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          profile_id: string;
          current_weight_kg: number;
          height_cm: number;
          weight_loss_target_kg: number;
          duration_days: number;
          days_per_week: number;
          cardio_preference: CardioPreference;
          prefers_free_weights: boolean;
          is_active?: boolean;
        };
        Update: { is_active?: boolean };
        Relationships: [];
      };
      exercises: {
        Row: {
          id: string;
          name: string;
          equipment_id: string | null;
          primary_muscle: string;
          category: "strength" | "cardio";
          is_compound: boolean;
          video_url: string | null;
          thumbnail_url: string | null;
          secondary_image_url: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["exercises"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["exercises"]["Row"]>;
        Relationships: [];
      };
      workout_plans: {
        Row: {
          id: string;
          profile_id: string;
          goal_id: string;
          split_type: string;
          weeks: number;
          days_per_week: number;
          cancelled_at: string | null;
          created_at: string;
        };
        Insert: {
          profile_id: string;
          goal_id: string;
          split_type: string;
          weeks: number;
          days_per_week: number;
        };
        Update: Partial<Database["public"]["Tables"]["workout_plans"]["Row"]>;
        Relationships: [];
      };
      workout_plan_days: {
        Row: {
          id: string;
          plan_id: string;
          profile_id: string;
          week_number: number;
          day_number: number;
          label: string;
          order_index: number;
          status: WorkoutDayStatus;
          completed_at: string | null;
          skipped_at: string | null;
        };
        Insert: {
          plan_id: string;
          profile_id: string;
          week_number: number;
          day_number: number;
          label: string;
          order_index: number;
        };
        Update: { status?: WorkoutDayStatus; completed_at?: string | null; skipped_at?: string | null };
        Relationships: [];
      };
      workout_plan_exercises: {
        Row: {
          id: string;
          plan_day_id: string;
          exercise_id: string;
          order_index: number;
          sets: number;
          reps: string;
          rest_seconds: number;
        };
        Insert: {
          plan_day_id: string;
          exercise_id: string;
          order_index: number;
          sets: number;
          reps: string;
          rest_seconds: number;
        };
        Update: Partial<Database["public"]["Tables"]["workout_plan_exercises"]["Row"]>;
        Relationships: [];
      };
      workout_logs: {
        Row: {
          id: string;
          plan_day_id: string;
          profile_id: string;
          duration_seconds: number;
          completed_at: string;
        };
        Insert: {
          plan_day_id: string;
          profile_id: string;
          duration_seconds: number;
        };
        Update: Partial<Database["public"]["Tables"]["workout_logs"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      cardio_preference: CardioPreference;
    };
    CompositeTypes: Record<string, never>;
  };
}
