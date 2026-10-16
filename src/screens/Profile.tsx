import React, { useState, useCallback } from 'react';
import { useAppStore } from '../store/store';
import { Button } from '../components/ui/Button';
import { ArrowLeft, User, Camera, Mail, Phone } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { getDb, getStorageService } from '../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface Props {
  onBack: () => void;
}

/**
 * Profile Screen
 * User profile information and settings
 */
const Profile = ({ onBack }: Props) => {
  const { user, setUser } = useAppStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = useCallback(async () => {
    if (!user || !name) {
      setError('Name is required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const uref = doc(getDb(), 'users', user.uid);
      await updateDoc(uref, { name, email });
      setUser({ ...user, name, email });
      onBack();
    } catch (e) {
      console.error('[Profile] Profile update error:', e);
      // Update local state even if Firebase fails
      setUser({ ...user, name, email });
      setError('Failed to save profile');
    } finally {
      setLoading(false);
    }
  }, [user, setUser, onBack]);

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    setLoading(true);
    try {
      const sRef = ref(getStorageService(), `profiles/${user.uid}`);
      await uploadBytes(sRef, file);
      const url = await getDownloadURL(sRef);
      await updateDoc(doc(getDb(), 'users', user.uid), { photoURL: url });
      setUser({ ...user, photoURL: url });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[color:var(--bg)]">
      <div className="bg-teal p-4 flex items-center gap-3 shrink-0">
        <button onClick={onBack} className="bg-white/20 border-none text-white w-9 h-9 rounded-full flex items-center justify-center cursor-pointer">
          <ArrowLeft size={18} />
        </button>
        <span className="text-white text-[length:var(--flg)] font-bold">My Profile</span>
      </div>

      <div className="p-6 overflow-y-auto">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-teal-light border-4 border-teal flex items-center justify-center text-4xl font-black text-teal overflow-hidden shadow-lg">
              {user?.photoURL ? <img src={user.photoURL} className="w-full h-full object-cover" /> : user?.name.charAt(0) || <User />}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-teal text-white rounded-full flex items-center justify-center border-4 border-[color:var(--surface)] cursor-pointer">
              <Camera size={16} />
              <input type="file" className="hidden" accept="image/*" onChange={handlePhoto} />
            </label>
          </div>
          <div className="text-xs text-[color:var(--muted)] font-bold uppercase tracking-wider">Change Profile Photo</div>
        </div>

        <label className="label-text">Full Name</label>
        <input 
          className="input-field" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="Enter your name"
        />

        <label className="label-text">Mobile</label>
        <div className="input-field bg-gray-100/50 text-[color:var(--muted)] flex items-center gap-2">
          <Phone size={16} /> {user?.phone || user?.uid.slice(0, 10)}
        </div>

        <label className="label-text">Email (optional)</label>
        <div className="relative">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted)]" />
          <input 
            className="input-field pl-11" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="you@email.com"
          />
        </div>

        <Button className="mt-10 w-full" onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "💾 Save Profile"}
        </Button>
      </div>
    </div>
  );
};

export default Profile;
