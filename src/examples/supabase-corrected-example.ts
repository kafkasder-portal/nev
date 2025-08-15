import { supabase } from '../lib/supabase'

// Corrected Supabase client usage example
// This demonstrates the proper way to initialize and use Supabase client

// ✅ CORRECT: Proper Supabase client initialization (already done in src/lib/supabase.ts)
// export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)

// ❌ INCORRECT: Missing quotes around URL
// const supabase = createClient(http://localhost:54321, env.SUPABASE_ANON_KEY)

// ❌ INCORRECT: Extra comma
// const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY,)

// ✅ CORRECT: Using existing tables instead of non-existent 'todos' table
export async function getExistingData() {
  try {
    // Use 'tasks' table instead of 'todos'
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .limit(10)

    if (tasksError) {
      console.error('Error fetching tasks:', tasksError)
      return { tasks: [], error: tasksError }
    }

    // Use 'notifications' table
    const { data: notifications, error: notificationsError } = await supabase
      .from('notifications')
      .select('*')
      .limit(10)

    if (notificationsError) {
      console.error('Error fetching notifications:', notificationsError)
      return { notifications: [], error: notificationsError }
    }

    // Use 'user_profiles' table
    const { data: userProfiles, error: userProfilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(10)

    if (userProfilesError) {
      console.error('Error fetching user profiles:', userProfilesError)
      return { userProfiles: [], error: userProfilesError }
    }

    return {
      tasks: tasks || [],
      notifications: notifications || [],
      userProfiles: userProfiles || [],
      error: null
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      tasks: [],
      notifications: [],
      userProfiles: [],
      error: error instanceof Error ? error : new Error('Unknown error')
    }
  }
}

// ❌ INCORRECT: Trying to query non-existent 'todos' table
// const { data, error } = await supabase.from('todos').select('*')

// ✅ CORRECT: Query existing tables
export async function createTask(title: string, description: string) {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title,
      description,
      status: 'pending',
      priority: 'normal'
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating task:', error)
    throw error
  }

  return data
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    throw error
  }

  return data
}

export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching notifications:', error)
    throw error
  }

  return data || []
}