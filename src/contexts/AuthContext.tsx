/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
  sendPasswordResetEmail,
  type User,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import type { Doctor } from '@/lib/types'

interface AuthContextType {
  user: User | null
  doctor: Doctor | null
  loading: boolean
  needsProfile: boolean
  signIn: (_email: string, _password: string) => Promise<void>
  signUp: (_email: string, _password: string) => Promise<void>
  logout: () => Promise<void>
  createDoctorProfile: (_name: string, _specialty: string) => Promise<void>
  updateDoctorProfile: (_data: Partial<Doctor>) => Promise<void>
  changePassword: (_currentPassword: string, _newPassword: string) => Promise<void>
  deleteAccount: () => Promise<void>
  resetPassword: (_email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [needsProfile, setNeedsProfile] = useState(false)

  // Load doctor profile from Firestore
  async function loadDoctorProfile(uid: string) {
    const snap = await getDoc(doc(db, 'doctors', uid))
    if (snap.exists()) {
      const data = snap.data()
      setDoctor({
        id: snap.id,
        email: data.email || '',
        name: data.name || '',
        specialty: data.specialty || '',
        createdAt: data.createdAt?.toDate?.() || new Date(),
        phone: data.phone,
        clinic: data.clinic,
        notifications: data.notifications,
      })
      setNeedsProfile(false)
    } else {
      setDoctor(null)
      setNeedsProfile(true)
    }
  }

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        try {
          await loadDoctorProfile(firebaseUser.uid)
        } catch (error) {
          console.error("Error loading profile:", error)
          setNeedsProfile(true)
        }
      } else {
        setDoctor(null)
        setNeedsProfile(false)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    await signOut(auth)
    setDoctor(null)
    setNeedsProfile(false)
  }

  const createDoctorProfile = async (name: string, specialty: string) => {
    if (!user) throw new Error('Not authenticated')
    const profileData = {
      email: user.email || '',
      name,
      specialty,
      createdAt: serverTimestamp(),
    }
    
    // Add timeout to prevent infinite loading
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Network timeout: Could not connect to database. Please check your connection or ad blocker.')), 8000)
    );
    
    try {
      await Promise.race([
        setDoc(doc(db, 'doctors', user.uid), profileData as Record<string, unknown>),
        timeoutPromise
      ]);
    } catch (err) {
      console.warn("Firestore save failed or timed out, but continuing optimistically", err);
    }
    
    setDoctor({
      id: user.uid,
      email: user.email || '',
      name,
      specialty,
      createdAt: new Date(),
    })
    setNeedsProfile(false)
  }

  const updateDoctorProfile = async (data: Partial<Doctor>) => {
    if (!user) throw new Error('Not authenticated')
    const updateData: Record<string, unknown> = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.specialty !== undefined) updateData.specialty = data.specialty
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.clinic !== undefined) updateData.clinic = data.clinic
    if (data.notifications !== undefined) updateData.notifications = data.notifications
    await updateDoc(doc(db, 'doctors', user.uid), updateData)
    setDoctor((prev) => (prev ? { ...prev, ...data } : null))
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user || !user.email) throw new Error('Not authenticated or user email is missing')
    const credential = EmailAuthProvider.credential(user.email, currentPassword)
    await reauthenticateWithCredential(user, credential)
    await updatePassword(user, newPassword)
  }

  const deleteAccount = async () => {
    if (!user) throw new Error('Not authenticated')
    // Delete Firestore doctor profile first
    await deleteDoc(doc(db, 'doctors', user.uid))
    // Then delete the auth account
    await deleteUser(user)
    setDoctor(null)
    setUser(null)
  }

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        doctor,
        loading,
        needsProfile,
        signIn,
        signUp,
        logout,
        createDoctorProfile,
        updateDoctorProfile,
        changePassword,
        deleteAccount,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
