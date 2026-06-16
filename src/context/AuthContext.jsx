import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(undefined) // undefined = chargement, null = non connecté
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else setProfile(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(uid) {
    const { data } = await supabase.from('profiles').select('*').eq('id', uid).single()
    setProfile(data)
  }

  async function signUp({ email, password, nom, role = 'cliente', telephone = '' }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nom, role } },
    })
    // Mettre à jour le téléphone dès que le profil est créé par le trigger
    if (!error && data.user && telephone) {
      await supabase.from('profiles').update({ telephone }).eq('id', data.user.id)
    }
    return { data, error }
  }

  async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  async function signInWithGoogle() {
    return supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthCtx.Provider value={{ user, profile, signUp, signIn, signInWithGoogle, signOut, loading: user === undefined }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
