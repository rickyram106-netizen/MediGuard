import React, { useState, useCallback } from 'react';
import { useAppStore } from '../store/store';
import { useContacts } from '../hooks/useContacts';
import { Button } from '../components/ui/Button';
import { UserPlus, ShieldAlert, X } from 'lucide-react';
import { cn } from '../utils/helpers';

const Family: React.FC = () => {
  const { user } = useAppStore();
  const { contacts, addContact } = useContacts(user?.uid);

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    role: '',
    alertLevel: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = useCallback(async () => {
    if (!user) {
      setError('You must be signed in to add a contact');
      return;
    }

    if (!form.name.trim() || form.phone.length !== 10) {
      setError('Enter a valid name and 10-digit phone number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await addContact({
        uid: user.uid,
        name: form.name.trim(),
        phone: form.phone,
        role: form.role.trim(),
        alertLevel: form.alertLevel,
      });

      setShowAdd(false);
      setForm({
        name: '',
        phone: '',
        role: '',
        alertLevel: 1,
      });
    } catch (err: unknown) {
      console.error('[Family] Failed to save contact:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to save contact'
      );
    } finally {
      setLoading(false);
    }
  }, [form, addContact, user]);

  return (
    <div className="flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="m-4 bg-teal-light border border-teal/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-teal-dark font-bold text-sm mb-2">
            <ShieldAlert size={16} />
            How alerts work
          </div>

          <div className="text-xs text-teal-dark/70 space-y-1">
            <p>â€¢ 10 min â†’ App Notification</p>
            <p>â€¢ 20 min â†’ SMS to Level 1 & 2</p>
            <p>â€¢ 30 min â†’ Call to Level 3</p>
          </div>
        </div>

        <div className="px-4 py-2 mt-2 uppercase text-[10px] font-bold text-[color:var(--muted)] tracking-widest">
          {contacts.length} {contacts.length === 1 ? 'Contact' : 'Contacts'}
        </div>

        <div className="px-4 flex flex-col gap-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-[color:var(--card)] p-4 rounded-2xl border border-[color:var(--border)] flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-teal-light text-teal flex items-center justify-center font-black text-lg">
                {contact.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1">
                <div className="text-[length:var(--fbase)] font-bold">
                  {contact.name}
                  {contact.role && (
                    <span className="font-normal text-xs opacity-50">
                      {' '}({contact.role})
                    </span>
                  )}
                </div>

                <div className="text-xs text-[color:var(--muted)]">
                  +91 {contact.phone}
                </div>
              </div>

              <div
                className={cn(
                  'px-2 py-1 rounded-lg text-[10px] font-bold',
                  contact.alertLevel === 1
                    ? 'bg-blue-100 text-blue-700'
                    : contact.alertLevel === 2
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-red-100 text-red-700'
                )}
              >
                LVL {contact.alertLevel}
              </div>
            </div>
          ))}
        </div>

        {contacts.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 opacity-50">
            <UserPlus size={48} className="text-teal mb-2" />
            <div className="font-bold">No contacts yet</div>
            <p className="text-sm text-center">
              Add family members to keep you safe
            </p>
          </div>
        )}

        <div className="p-4">
          <Button
            onClick={() => {
              setError(null);
              setShowAdd(true);
            }}
            className="w-full"
            disabled={!user}
          >
            + Add Contact
          </Button>
        </div>
      </div>

      {showAdd && (
        <div className="absolute inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              if (!loading) {
                setShowAdd(false);
              }
            }}
          />

          <div className="absolute bottom-0 left-0 right-0 bg-[color:var(--surface)] rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-20 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black">Add Contact</h2>

              <button
                type="button"
                onClick={() => {
                  if (!loading) {
                    setShowAdd(false);
                  }
                }}
                className="bg-none border-none text-[color:var(--muted)]"
              >
                <X />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 p-3 text-sm">
                {error}
              </div>
            )}

            <label className="label-text mt-0">Name *</label>

            <input
              className="input-field"
              placeholder="e.g. Priya Patel"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
            />

            <label className="label-text">Phone *</label>

            <div className="flex">
              <span className="bg-teal-light text-teal-dark rounded-l-xl px-4 py-3 font-bold border-2 border-[color:var(--border)] border-r-0">
                +91
              </span>

              <input
                className="input-field rounded-l-none"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="9876543210"
                value={form.phone}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    phone: event.target.value
                      .replace(/\D/g, '')
                      .slice(0, 10),
                  }))
                }
              />
            </div>

            <label className="label-text">Relationship</label>

            <input
              className="input-field"
              placeholder="e.g. Daughter, Doctor"
              value={form.role}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  role: event.target.value,
                }))
              }
            />

            <Button
              className="mt-8 w-full"
              onClick={handleSave}
              disabled={loading || !user}
            >
              {loading ? 'Saving...' : 'Save Contact'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Family;



