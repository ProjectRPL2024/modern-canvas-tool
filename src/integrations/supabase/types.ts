export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          created_at: string
          id: string
          keterangan: string | null
          placement_id: string | null
          status: string
          student_id: string
          tanggal: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          keterangan?: string | null
          placement_id?: string | null
          status: string
          student_id: string
          tanggal: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          keterangan?: string | null
          placement_id?: string | null
          status?: string
          student_id?: string
          tanggal?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_placement_id_fkey"
            columns: ["placement_id"]
            isOneToOne: false
            referencedRelation: "pkl_placements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          created_at: string
          id: string
          nomor_sertifikat: string | null
          placement_id: string | null
          student_id: string
          tanggal_terbit: string | null
          template_type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nomor_sertifikat?: string | null
          placement_id?: string | null
          student_id: string
          tanggal_terbit?: string | null
          template_type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nomor_sertifikat?: string | null
          placement_id?: string | null
          student_id?: string
          tanggal_terbit?: string | null
          template_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_placement_id_fkey"
            columns: ["placement_id"]
            isOneToOne: false
            referencedRelation: "pkl_placements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          alamat: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          nama: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          alamat?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nama: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          alamat?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nama?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      mentoring: {
        Row: {
          catatan_pembimbingan: string | null
          created_at: string
          id: string
          placement_id: string | null
          student_id: string
          tanggal: string
          teacher_id: string | null
          updated_at: string
        }
        Insert: {
          catatan_pembimbingan?: string | null
          created_at?: string
          id?: string
          placement_id?: string | null
          student_id: string
          tanggal: string
          teacher_id?: string | null
          updated_at?: string
        }
        Update: {
          catatan_pembimbingan?: string | null
          created_at?: string
          id?: string
          placement_id?: string | null
          student_id?: string
          tanggal?: string
          teacher_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentoring_placement_id_fkey"
            columns: ["placement_id"]
            isOneToOne: false
            referencedRelation: "pkl_placements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentoring_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentoring_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      monitoring: {
        Row: {
          catatan: string | null
          created_at: string
          id: string
          jenis_monitoring: string | null
          placement_id: string | null
          student_id: string
          tanggal: string
          teacher_id: string | null
          tindak_lanjut: string | null
          updated_at: string
        }
        Insert: {
          catatan?: string | null
          created_at?: string
          id?: string
          jenis_monitoring?: string | null
          placement_id?: string | null
          student_id: string
          tanggal: string
          teacher_id?: string | null
          tindak_lanjut?: string | null
          updated_at?: string
        }
        Update: {
          catatan?: string | null
          created_at?: string
          id?: string
          jenis_monitoring?: string | null
          placement_id?: string | null
          student_id?: string
          tanggal?: string
          teacher_id?: string | null
          tindak_lanjut?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "monitoring_placement_id_fkey"
            columns: ["placement_id"]
            isOneToOne: false
            referencedRelation: "pkl_placements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monitoring_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monitoring_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      pickup_delivery: {
        Row: {
          company_id: string
          created_at: string
          guru_pendamping_id: string | null
          id: string
          kelompok: string | null
          period_id: string
          status: string | null
          tanggal_pengantaran: string | null
          tanggal_penjemputan: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          guru_pendamping_id?: string | null
          id?: string
          kelompok?: string | null
          period_id: string
          status?: string | null
          tanggal_pengantaran?: string | null
          tanggal_penjemputan?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          guru_pendamping_id?: string | null
          id?: string
          kelompok?: string | null
          period_id?: string
          status?: string | null
          tanggal_pengantaran?: string | null
          tanggal_penjemputan?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pickup_delivery_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickup_delivery_guru_pendamping_id_fkey"
            columns: ["guru_pendamping_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickup_delivery_period_id_fkey"
            columns: ["period_id"]
            isOneToOne: false
            referencedRelation: "pkl_periods"
            referencedColumns: ["id"]
          },
        ]
      }
      pkl_periods: {
        Row: {
          created_at: string
          end_date: string
          id: string
          is_active: boolean | null
          nama: string
          start_date: string
          tahun_ajaran: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          is_active?: boolean | null
          nama: string
          start_date: string
          tahun_ajaran?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          is_active?: boolean | null
          nama?: string
          start_date?: string
          tahun_ajaran?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      pkl_placements: {
        Row: {
          company_id: string
          created_at: string
          end_date: string | null
          id: string
          jenis_pkl: string | null
          mentor_teacher_id: string | null
          period_id: string
          start_date: string | null
          status: string | null
          student_id: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          jenis_pkl?: string | null
          mentor_teacher_id?: string | null
          period_id: string
          start_date?: string | null
          status?: string | null
          student_id: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          jenis_pkl?: string | null
          mentor_teacher_id?: string | null
          period_id?: string
          start_date?: string | null
          status?: string | null
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pkl_placements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pkl_placements_mentor_teacher_id_fkey"
            columns: ["mentor_teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pkl_placements_period_id_fkey"
            columns: ["period_id"]
            isOneToOne: false
            referencedRelation: "pkl_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pkl_placements_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_grades: {
        Row: {
          aspek_penilaian: string | null
          created_at: string
          id: string
          nilai: number | null
          placement_id: string | null
          student_id: string
          updated_at: string
        }
        Insert: {
          aspek_penilaian?: string | null
          created_at?: string
          id?: string
          nilai?: number | null
          placement_id?: string | null
          student_id: string
          updated_at?: string
        }
        Update: {
          aspek_penilaian?: string | null
          created_at?: string
          id?: string
          nilai?: number | null
          placement_id?: string | null
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_grades_placement_id_fkey"
            columns: ["placement_id"]
            isOneToOne: false
            referencedRelation: "pkl_placements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string
          id: string
          nama: string
          nis: string
          rombel: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nama: string
          nis: string
          rombel?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nama?: string
          nis?: string
          rombel?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      teachers: {
        Row: {
          created_at: string
          id: string
          nama: string
          nip: string | null
          position: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nama: string
          nip?: string | null
          position?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nama?: string
          nip?: string | null
          position?: string | null
          updated_at?: string
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
