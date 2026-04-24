import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (uid) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('uid', uid)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
        console.error('Error fetching user profile:', error);
      }

      if (data) {
        setUserProfile(data);
      } else {
        // Create profile if it doesn't exist
        const newProfile = {
          uid,
          username: user?.user_metadata?.full_name || 'PuzzleMaster',
          points: 0,
          streak: 0,
          total_attempts: 0,
          referrals: 0,
          daily_entries: 0,
          accuracy: 0,
          last_active: new Date().toISOString(),
          referral_code: Math.random().toString(36).substring(7).toUpperCase()
        };
        
        const { data: insertedData, error: insertError } = await supabase
          .from('users')
          .insert([newProfile])
          .select()
          .single();
          
        if (insertError) {
          console.error('Error creating user profile:', insertError);
        } else {
          setUserProfile(insertedData);
        }
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Login Error:", error);
      return { data: null, error };
    }
  };

  const signup = async (email, password, fullName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Signup Error:", error);
      return { data: null, error };
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout Error:", error);
  };

  const recordPuzzleResult = async ({ pointsEarned = 0, isSolved = false, isDaily = false, attemptsUsed = 1 }) => {
    if (!user || !userProfile) return;
    
    // Calculate new accuracy
    const newTotalAttempts = (userProfile.total_attempts || 0) + 1;
    const currentCorrect = Math.round(((userProfile.total_attempts || 0) * (userProfile.accuracy || 0)) / 100);
    const newAccuracy = Math.round(((currentCorrect + (isSolved ? 1 : 0)) / newTotalAttempts) * 100);

    const updates = {
      points: (userProfile.points || 0) + pointsEarned,
      total_attempts: newTotalAttempts,
      accuracy: newAccuracy,
      last_active: new Date().toISOString()
    };

    if (isDaily) {
      updates.daily_entries = (userProfile.daily_entries || 0) + 1;
      if (isSolved) {
        updates.streak = (userProfile.streak || 0) + 1;
      }
    }

    // Optimistic UI update
    setUserProfile(prev => ({ ...prev, ...updates }));

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('uid', user.id);
      
    if (error) {
      console.error('Error updating puzzle stats:', error);
      // Revert if error (optional, but good practice)
      fetchUserProfile(user.id);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    login,
    signup,
    logout,
    recordPuzzleResult
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
