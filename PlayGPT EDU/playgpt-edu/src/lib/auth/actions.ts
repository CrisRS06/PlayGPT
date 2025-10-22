"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"

export async function login(email: string, password: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/", "layout")
  redirect("/chat")
}

export async function signup(email: string, password: string, name?: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  if (data.user) {
    // Create student profile using admin client to bypass RLS
    // (session is not yet established on server after signup)
    const adminClient = getAdminClient()
    const { error: profileError } = await adminClient
      .from("student_profiles")
      .insert({
        user_id: data.user.id,
        learning_style: "visual", // Default
        level: "beginner",
        current_module: "Module_1_Foundations",
      })

    if (profileError) {
      console.error("Error creating profile:", profileError)
      throw new Error("Error al crear el perfil del estudiante")
    }
  }

  revalidatePath("/", "layout")
  redirect("/chat")
}

export async function logout() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/", "layout")
  redirect("/")
}

export async function getUser() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

export async function resetPassword(email: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/update-password`,
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function updatePassword(newPassword: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/", "layout")
  redirect("/chat")
}
