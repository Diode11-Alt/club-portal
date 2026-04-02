export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            public_events: {
                Row: {
                    id: string
                    created_by: string
                    title: string
                    slug: string
                    description: string
                    short_desc: string | null
                    event_date: string
                    end_date: string | null
                    location: string | null
                    meeting_link: string | null
                    cover_image_url: string | null
                    type: 'workshop' | 'ctf' | 'hackathon' | 'seminar' | 'meetup' | 'competition' | 'other'
                    max_attendees: number | null
                    is_published: boolean
                    is_registration_required: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    created_by: string
                    title: string
                    slug: string
                    description: string
                    short_desc?: string | null
                    event_date: string
                    end_date?: string | null
                    location?: string | null
                    meeting_link?: string | null
                    cover_image_url?: string | null
                    type?: 'workshop' | 'ctf' | 'hackathon' | 'seminar' | 'meetup' | 'competition' | 'other'
                    max_attendees?: number | null
                    is_published?: boolean
                    is_registration_required?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    created_by?: string
                    title?: string
                    slug?: string
                    description?: string
                    short_desc?: string | null
                    event_date?: string
                    end_date?: string | null
                    location?: string | null
                    meeting_link?: string | null
                    cover_image_url?: string | null
                    type?: 'workshop' | 'ctf' | 'hackathon' | 'seminar' | 'meetup' | 'competition' | 'other'
                    max_attendees?: number | null
                    is_published?: boolean
                    is_registration_required?: boolean
                    created_at?: string
                }
                Relationships: []
            }
            posts: {
                Row: Record<string, any>
                Insert: Record<string, any>
                Update: Record<string, any>
                Relationships: []
            }
            ctf_challenges: {
                Row: Record<string, any>
                Insert: Record<string, any>
                Update: Record<string, any>
                Relationships: []
            }
            ctf_solves: {
                Row: {
                    id: string
                    challenge_id: string
                    member_id: string
                    solved_at: string
                }
                Insert: {
                    id?: string
                    challenge_id: string
                    member_id: string
                    solved_at?: string
                }
                Update: {
                    id?: string
                    challenge_id?: string
                    member_id?: string
                    solved_at?: string
                }
                Relationships: []
            }
            event_rsvps: {
                Row: {
                    id: string
                    event_id: string
                    member_id: string
                    status: 'going' | 'maybe' | 'not_going'
                    created_at: string
                }
                Insert: {
                    id?: string
                    event_id: string
                    member_id: string
                    status?: 'going' | 'maybe' | 'not_going'
                    created_at?: string
                }
                Update: {
                    id?: string
                    event_id?: string
                    member_id?: string
                    status?: 'going' | 'maybe' | 'not_going'
                    created_at?: string
                }
                Relationships: []
            }
            documents: {
                Row: Record<string, any>
                Insert: Record<string, any>
                Update: Record<string, any>
                Relationships: []
            }
            messages: {
                Row: Record<string, any>
                Insert: Record<string, any>
                Update: Record<string, any>
                Relationships: []
            }
            conversations: {
                Row: Record<string, any>
                Insert: Record<string, any>
                Update: Record<string, any>
                Relationships: []
            }
            conversation_participants: {
                Row: Record<string, any>
                Insert: Record<string, any>
                Update: Record<string, any>
                Relationships: []
            }
            gallery_images: {
                Row: {
                    id: string
                    uploader_id: string
                    url: string
                    caption: string | null
                    event_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    uploader_id: string
                    url: string
                    caption?: string | null
                    event_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    uploader_id?: string
                    url?: string
                    caption?: string | null
                    event_id?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            contact_messages: {
                Row: {
                    id: string
                    name: string
                    email: string
                    subject: string
                    message: string
                    ip_address: string | null
                    is_read: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    email: string
                    subject: string
                    message: string
                    ip_address?: string | null
                    is_read?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    subject?: string
                    message?: string
                    ip_address?: string | null
                    is_read?: boolean
                    created_at?: string
                }
                Relationships: []
            }
            site_settings: {
                Row: {
                    key: string
                    value: string
                    updated_by: string | null
                    updated_at: string
                }
                Insert: {
                    key: string
                    value: string
                    updated_by?: string | null
                    updated_at?: string
                }
                Update: {
                    key?: string
                    value?: string
                    updated_by?: string | null
                    updated_at?: string
                }
                Relationships: []
            }
            members: {
                Row: {
                    id: string
                    user_id: string
                    full_name: string | null
                    email: string
                    role: 'member' | 'bod' | 'admin' | 'superadmin'
                    status: 'pending' | 'approved' | 'rejected' | 'banned'
                    club_post: string | null
                    avatar_url: string | null
                    bio: string | null
                    points: number
                    student_id: string | null
                    github_url: string | null
                    linkedin_url: string | null
                    program: string | null
                    intake: string | null
                    skills: string[] | null
                    created_at: string
                    deactivation_requested_at: string | null
                    deactivation_reason: string | null
                    is_public_profile: boolean
                    display_order: number
                }
                Insert: {
                    id?: string
                    user_id?: string
                    full_name?: string | null
                    email: string
                    role?: 'member' | 'bod' | 'admin' | 'superadmin'
                    status?: 'pending' | 'approved' | 'rejected' | 'banned'
                    club_post?: string | null
                    avatar_url?: string | null
                    bio?: string | null
                    points?: number
                    student_id?: string | null
                    github_url?: string | null
                    linkedin_url?: string | null
                    program?: string | null
                    intake?: string | null
                    skills?: string[] | null
                    created_at?: string
                    deactivation_requested_at?: string | null
                    deactivation_reason?: string | null
                    is_public_profile?: boolean
                    display_order?: number
                }
                Update: {
                    id?: string
                    user_id?: string
                    full_name?: string | null
                    email?: string
                    role?: 'member' | 'bod' | 'admin' | 'superadmin'
                    status?: 'pending' | 'approved' | 'rejected' | 'banned'
                    club_post?: string | null
                    avatar_url?: string | null
                    bio?: string | null
                    points?: number
                    student_id?: string | null
                    github_url?: string | null
                    linkedin_url?: string | null
                    program?: string | null
                    intake?: string | null
                    skills?: string[] | null
                    created_at?: string
                    deactivation_requested_at?: string | null
                    deactivation_reason?: string | null
                    is_public_profile?: boolean
                    display_order?: number
                }
                Relationships: []
            }
            skill_endorsements: {
                Row: {
                    id: string
                    member_id: string
                    endorsed_by: string
                    skill: string
                    status: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    member_id: string
                    endorsed_by: string
                    skill: string
                    status?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    member_id?: string
                    endorsed_by?: string
                    skill?: string
                    status?: string
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "skill_endorsements_member_id_fkey"
                        columns: ["member_id"]
                        isOneToOne: false
                        referencedRelation: "members"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "skill_endorsements_endorsed_by_fkey"
                        columns: ["endorsed_by"]
                        isOneToOne: false
                        referencedRelation: "members"
                        referencedColumns: ["id"]
                    }
                ]
            }
            superadmin_sessions: {
                Row: {
                    id: string
                    member_id: string
                    ip_address: string | null
                    user_agent: string | null
                    created_at: string
                    last_seen: string
                }
                Insert: {
                    id?: string
                    member_id: string
                    ip_address?: string | null
                    user_agent?: string | null
                    created_at?: string
                    last_seen?: string
                }
                Update: {
                    id?: string
                    member_id?: string
                    ip_address?: string | null
                    user_agent?: string | null
                    created_at?: string
                    last_seen?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "superadmin_sessions_member_id_fkey"
                        columns: ["member_id"]
                        isOneToOne: false
                        referencedRelation: "members"
                        referencedColumns: ["id"]
                    }
                ]
            }
            audit_logs: {
                Row: {
                    id: string
                    actor_id: string | null
                    action: string
                    target_id: string | null
                    details: Json | null
                    created_at: string
                    ip_address: string | null
                }
                Insert: {
                    id?: string
                    actor_id?: string | null
                    action: string
                    target_id?: string | null
                    details?: Json | null
                    created_at?: string
                    ip_address?: string | null
                }
                Update: {
                    id?: string
                    actor_id?: string | null
                    action?: string
                    target_id?: string | null
                    details?: Json | null
                    created_at?: string
                    ip_address?: string | null
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
