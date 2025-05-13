"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, User, Bell, Shield } from "lucide-react";
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  // State for account settings
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Fetch user info on mount
  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch('http://localhost:5000/api/seller/account-info', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setName(data.name || '');
          setEmail(data.email || '');
          setPhone(data.phone || '');
          setAddress(data.address || '');
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchAccountInfo();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch('http://localhost:5000/api/seller/update-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone, address }),
      });
      if (response.ok) {
        setSuccess('Account updated successfully!');
      } else {
        setError('Failed to update account.');
      }
    } catch (err) {
      setError('Error updating account.');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 pt-24">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-black">Settings</h2>
      </div>
      <Tabs defaultValue="general" className="space-y-4 text-black">
        <TabsList className="bg-gray-200">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your general application settings and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Configure your general settings here. This section will be expanded with more options.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="account" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Update your account details and contact information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSave}>
                {success && <div className="text-green-600 text-sm">{success}</div>}
                {error && <div className="text-red-600 text-sm">{error}</div>}
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Name</label>
                  <Input name="name" value={name} onChange={e => setName(e.target.value)} className="bg-white text-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Email</label>
                  <Input name="email" value={email} disabled className="bg-white text-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Phone Number</label>
                  <Input name="phone" value={phone} onChange={e => setPhone(e.target.value)} className="bg-white text-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Address</label>
                  <textarea
                    name="address"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full p-2 border rounded bg-white text-black"
                    rows={2}
                  />
                </div>
                <Button className="bg-black text-white" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Customize how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Configure your notification preferences and alert settings.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your security preferences and authentication settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Update your security settings and privacy preferences here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}