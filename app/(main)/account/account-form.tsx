'use client';
import { SetStateAction, useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';
import Avatar from './avatar';
import { Calendar } from "@/components/ui/calendar";

export default function AccountForm({ user }: { user: User | null }) {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState<string | null>(null);
    const [surname, setSurname] = useState<string | null>(null);
    const [birthday, setBirthday] = useState<Date | undefined>(undefined);
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [website, setWebsite] = useState<string | null>(null);
    const [avatar_url, setAvatarUrl] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [phone, setPhone] = useState<string | null>(null);
    const [location, setLocation] = useState<string | null>(null);
    const [summary, setSummary] = useState<string | null>(null);

    const getProfile = useCallback(async () => {
        try {
            setLoading(true)

            const { data, error} = await supabase.functions.invoke('restful-api/profile/'+user?.id, {
                method: 'GET'
            })
            const {profile} = data;
            if (error) {
                console.log(error)
                throw error
            }

            if (profile) {
                setName(profile.name)
                setSurname(profile.surname)
                setWebsite(profile.website)
                setBirthday(profile.birthday)
                setEmail(profile.email)
                setPhone(profile.phone)
                setLocation(profile.location)
                setSummary(profile.summary)
                setAvatarUrl(profile.avatar_url)
            }
        } catch (error) {
            alert('Error loading user data!')
        } finally {
            setLoading(false)
        }
    }, [user, supabase])

    useEffect(() => {
        getProfile()
    }, [user, getProfile])

    async function updateProfile({
        name,
        surname,
        birthday,
        email,
        phone,
        location,
        summary,
        website,
        avatar_url,
    }: {
        name: string | null;
        surname: string | null;
        birthday: Date | undefined;
        email: string | null;
        phone: string | null;
        location: string | null;
        summary: string | null;
        website: string | null;
        avatar_url: string | null;
    }) {
        try {
            setLoading(true)

            const { error } = await supabase.functions.invoke('restful-api/profile/'+user?.id, {
                method: 'PUT',
                body: { 
                    profile: {
                        id: user?.id as string,
                        name,
                        surname,
                        birthday: birthday? birthday.toISOString():null,
                        email,
                        phone,
                        location,
                        summary,
                        website,
                        avatar_url,
                        updated_at: new Date().toISOString(),
                    }    
                }
            });
            if (error) throw error
            alert('Profile updated!')
        } catch (error) {
            console.log(error);
            alert('Error updating the data!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="form-widget">

            <Avatar
                uid={user?.id ?? null}
                url={avatar_url}
                size={150}
                onUpload={(url) => {
                    setAvatarUrl(url)
                    updateProfile({ 
                        name,
                        surname,
                        birthday,
                        email,
                        phone,
                        location,
                        summary,
                        website, 
                        avatar_url: url 
                    })
                }}
            />
            <div>
                <label htmlFor="username">Username</label>
                <input id="username" type="text" value={user?.email} disabled />
            </div>
            <div>
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    type="text"
                    value={name || ''}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="surname">Surname</label>
                <input
                    id="surname"
                    type="text"
                    value={surname || ''}
                    onChange={(e) => setSurname(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="birthday">Birthday</label>
                <Calendar
            mode="single"
            selected={birthday}
            captionLayout="dropdown"
            onSelect={(birthday: Date | undefined) => {
              setBirthday(birthday)
              setDatePickerOpen(false)
            }}
          />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="text"
                    value={email || ''}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="phone">Phone</label>
                <input
                    id="phone"
                    type="text"
                    value={phone || ''}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="location">Location</label>
                <input
                    id="location"
                    type="text"
                    value={location || ''}
                    onChange={(e) => setLocation(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="summary">Summary</label>
                <input
                    id="summary"
                    type="text"
                    value={summary || ''}
                    onChange={(e) => setSummary(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="website">Website</label>
                <input
                    id="website"
                    type="url"
                    value={website || ''}
                    onChange={(e) => setWebsite(e.target.value)}
                />
            </div>

            <div>
                <button
                    className="button primary block"
                    onClick={() => updateProfile({ 
                        name,
                        surname,
                        birthday,
                        email,
                        phone,
                        location,
                        summary,
                        website, 
                        avatar_url })}
                    disabled={loading}
                >
                    {loading ? 'Loading ...' : 'Update'}
                </button>
            </div>

            <div>
                <form action="/auth/signout" method="post">
                    <button className="button block" type="submit">
                        Sign out
                    </button>
                </form>
            </div>
        </div>
    )
}