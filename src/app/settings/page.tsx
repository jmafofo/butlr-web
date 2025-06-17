'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'
import { ProfileData } from '@/types/insights'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<ProfileData>()
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      console.debug('📡 Starting profile fetch...');
  
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
  
      if (sessionError) {
        console.error('❌ Error getting session:', sessionError);
      }
  
      console.debug('🧾 Current session:', session);
  
      const currentSession = session;
  
      if (!currentSession?.access_token) {
        console.warn('⚠️ No access token found. Setting up listener...');
        
        // fallback to auth state change if session is initially null
        const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
          console.debug('📦 Session from auth change:', newSession);
          if (newSession?.access_token) {
            fetchProfileWithToken(newSession.access_token);
          }
        });
  
        return () => {
          listener.subscription?.unsubscribe();
        };
      } else {
        await fetchProfileWithToken(currentSession.access_token);
      }
    };
  
    const fetchProfileWithToken = async (token: string) => {
      console.debug('🔑 Using token to fetch profile:', token);
  
      try {
        const res = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.debug('🌐 Response status:', res.status);
  
        const data = await res.json();
        console.debug('📬 Profile data:', data);
  
        if (data.error) {
          console.error('❌ Profile fetch error:', data.error);
          setMessage(data.error);
        } else {
          setProfile(data.profile);
          setMessage('');
        }
      } catch (err) {
        console.error('❌ Exception fetching profile:', err);
        setMessage('Failed to fetch profile');
      }
    };
  
    fetchProfile();
  }, []);
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="max-w-5xl mx-auto px-6 pt-40 pb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
        >
          Profile Settings
        </motion.h1>

        {profile ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-10 space-y-4 max-w-md mx-auto"
          >
            <p className="text-lg">
              <strong>First Name:</strong> {profile.first_name}
            </p>
            <p className="text-lg">
              <strong>Last Name:</strong> {profile.last_name}
            </p>
          </motion.div>
        ) : (
          <p className="mt-10 text-slate-300">{message || 'Loading profile...'}</p>
        )}
      </div>
    </div>
  )
}
