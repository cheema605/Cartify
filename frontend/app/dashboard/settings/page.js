"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, User, Bell, Shield, Check, Save, RefreshCw, Moon, Sun, Palette, Globe, DollarSign } from "lucide-react";
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

function ThemedCard({ children, ...props }) {
  return (
    <Card 
      className="shadow-sm border-0" 
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      {...props}
    >
      {children}
    </Card>
  );
}

function ThemedCardTitle({ children }) {
  return <CardTitle style={{ color: 'var(--text-primary)' }}>{children}</CardTitle>;
}

function ThemedCardDescription({ children }) {
  return <CardDescription style={{ color: 'var(--text-secondary)' }}>{children}</CardDescription>;
}

export default function SettingsPage() {
  // Get theme context
  const { theme, accentColor, toggleTheme, changeAccentColor } = useTheme();

  // State for account settings
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState('/default-avatar.png');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // State for notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // State for security settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [activityLog, setActivityLog] = useState([]);
  
  // Fetch user info on mount
  useEffect(() => {
    const fetchAccountInfo = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
          // Handle case where token is missing - just use default values
          setLoading(false);
          return;
        }
        
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
          if (data.avatar) setAvatar(data.avatar);
          
          // You can fetch activity log if available from API
          // This would typically come from a separate endpoint
          // For now, just set an empty array (defined in useState above)
        } else {
          console.error('Failed to fetch account info:', response.status);
        }
      } catch (err) {
        console.error('Error fetching account info:', err);
      }
      
      // Ensure loading state is cleared even if there's an error
      setLoading(false);
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
      if (!token) {
        setError('Authentication required. Please log in again.');
        setSaving(false);
        return;
      }
      
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
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || 'Failed to update account.');
      }
    } catch (err) {
      setError('Error updating account. Please try again.');
      console.error('Save error:', err);
    }
    setSaving(false);
  };
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Settings</h2>
      </div>
      
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center justify-between"
          >
            <div className="flex items-center">
              <Check className="h-5 w-5 mr-2" />
              {success}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      ) : (
        <Tabs defaultValue="account" className="space-y-4">
          <TabsList className="p-1 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <TabsTrigger 
              value="account" 
              className="rounded-md flex items-center gap-2 px-4 py-2 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <User className="h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger 
              value="appearance" 
              className="rounded-md flex items-center gap-2 px-4 py-2 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="rounded-md flex items-center gap-2 px-4 py-2 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="rounded-md flex items-center gap-2 px-4 py-2 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger 
              value="billing" 
              className="rounded-md flex items-center gap-2 px-4 py-2 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <DollarSign className="h-4 w-4" />
              Billing
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4">
            <ThemedCard>
              <CardHeader>
                <ThemedCardTitle>Profile</ThemedCardTitle>
                <ThemedCardDescription>
                  Manage your personal information and account settings
                </ThemedCardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/3 flex flex-col items-center">
                    <div className="bg-gray-100 h-20 w-20 rounded-full flex items-center justify-center mb-4">
                      <User className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">{name || 'Your Name'}</h3>
                      <p className="text-gray-500 text-sm">{email || 'your.email@example.com'}</p>
                    </div>
                  </div>
                  
                  <form className="w-full md:w-2/3 space-y-4" onSubmit={handleSave}>
                    {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Full Name</label>
                      <Input 
                        name="name" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="bg-gray-50 text-black focus:bg-white transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Email</label>
                      <Input 
                        name="email" 
                        value={email} 
                        disabled 
                        className="bg-gray-100 text-black cursor-not-allowed" 
                      />
                      <p className="text-xs text-gray-500 mt-1">Your email address cannot be changed</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Phone Number</label>
                      <Input 
                        name="phone" 
                        value={phone} 
                        onChange={e => setPhone(e.target.value)} 
                        className="bg-gray-50 text-black focus:bg-white transition-colors"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">Address</label>
                      <textarea
                        name="address"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        className="w-full p-3 border rounded bg-gray-50 text-black focus:bg-white transition-colors"
                        rows={3}
                        placeholder="Enter your address"
                      />
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button 
                        className="bg-black text-white hover:bg-gray-900 px-6 flex items-center gap-2" 
                        type="submit" 
                        disabled={saving}
                      >
                        {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </div>
              </CardContent>
            </ThemedCard>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4">
            <ThemedCard>
              <CardHeader>
                <ThemedCardTitle>Appearance</ThemedCardTitle>
                <ThemedCardDescription>
                  Customize how your dashboard looks and feels
                </ThemedCardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Theme</h3>
                    <Button 
                      className="bg-black text-white hover:bg-gray-900 flex items-center gap-2"
                      variant="outline"
                      style={{ backgroundColor: 'transparent', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                      onClick={toggleTheme}
                    >
                      {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                      {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Language & Region</h3>
                    <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg">
                      <Globe className="h-5 w-5 text-gray-400" />
                      <div>
                        <label className="block text-sm font-medium mb-1">Select Language</label>
                        <select className="w-full p-2 border rounded">
                          <option>English (US)</option>
                          <option>Urdu</option>
                          <option>Arabic</option>
                          <option>Hindi</option>
                          <option>Chinese</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </ThemedCard>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <ThemedCard>
              <CardHeader>
                <ThemedCardTitle>Notification Preferences</ThemedCardTitle>
                <ThemedCardDescription>
                  Customize how you receive notifications and updates
                </ThemedCardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        id="email-toggle"
                        checked={emailNotifications}
                        onChange={() => setEmailNotifications(!emailNotifications)}
                      />
                      <label 
                        htmlFor="email-toggle" 
                        className={`block w-14 h-7 rounded-full transition-colors cursor-pointer ${emailNotifications ? 'bg-black' : 'bg-gray-300'}`}
                      >
                        <span 
                          className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${emailNotifications ? 'transform translate-x-7' : ''}`}
                        ></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium">Push Notifications</h3>
                      <p className="text-sm text-gray-500">Receive notifications in your browser</p>
                    </div>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        id="push-toggle"
                        checked={pushNotifications}
                        onChange={() => setPushNotifications(!pushNotifications)}
                      />
                      <label 
                        htmlFor="push-toggle" 
                        className={`block w-14 h-7 rounded-full transition-colors cursor-pointer ${pushNotifications ? 'bg-black' : 'bg-gray-300'}`}
                      >
                        <span 
                          className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${pushNotifications ? 'transform translate-x-7' : ''}`}
                        ></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium">Order Updates</h3>
                      <p className="text-sm text-gray-500">Get notified about order status changes</p>
                    </div>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        id="order-toggle"
                        checked={orderUpdates}
                        onChange={() => setOrderUpdates(!orderUpdates)}
                      />
                      <label 
                        htmlFor="order-toggle" 
                        className={`block w-14 h-7 rounded-full transition-colors cursor-pointer ${orderUpdates ? 'bg-black' : 'bg-gray-300'}`}
                      >
                        <span 
                          className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${orderUpdates ? 'transform translate-x-7' : ''}`}
                        ></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium">Marketing Emails</h3>
                      <p className="text-sm text-gray-500">Receive promotional emails and offers</p>
                    </div>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        id="marketing-toggle"
                        checked={marketingEmails}
                        onChange={() => setMarketingEmails(!marketingEmails)}
                      />
                      <label 
                        htmlFor="marketing-toggle" 
                        className={`block w-14 h-7 rounded-full transition-colors cursor-pointer ${marketingEmails ? 'bg-black' : 'bg-gray-300'}`}
                      >
                        <span 
                          className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${marketingEmails ? 'transform translate-x-7' : ''}`}
                        ></span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </ThemedCard>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <ThemedCard>
              <CardHeader>
                <ThemedCardTitle>Security Settings</ThemedCardTitle>
                <ThemedCardDescription>
                  Manage your security preferences and login settings
                </ThemedCardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        id="2fa-toggle"
                        checked={twoFactorAuth}
                        onChange={() => setTwoFactorAuth(!twoFactorAuth)}
                      />
                      <label 
                        htmlFor="2fa-toggle" 
                        className={`block w-14 h-7 rounded-full transition-colors cursor-pointer ${twoFactorAuth ? 'bg-black' : 'bg-gray-300'}`}
                      >
                        <span 
                          className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${twoFactorAuth ? 'transform translate-x-7' : ''}`}
                        ></span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </ThemedCard>
          </TabsContent>
          
          <TabsContent value="billing" className="space-y-4">
            <ThemedCard>
              <CardHeader>
                <ThemedCardTitle>Billing & Subscription</ThemedCardTitle>
                <ThemedCardDescription>
                  Manage your billing information and subscription plans
                </ThemedCardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-lg p-6" style={{ 
                    backgroundColor: 'var(--bg-secondary)', 
                    borderColor: 'var(--border-color)' 
                  }}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>Current Plan</h3>
                      <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">Active</span>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Standard Plan</h4>
                      <p style={{ color: 'var(--text-secondary)' }}>Contact support for plan details</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button className="bg-black text-white hover:bg-gray-900">Upgrade Plan</Button>
                      <Button variant="outline" className="bg-black text-white hover:bg-gray-900" style={{ borderColor: 'var(--border-color)' }}>
                        Billing History
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>Payment Method</h3>
                    <div className="text-center py-6 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
                      <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>No payment methods found</p>
                      <Button variant="outline" className="bg-black text-white hover:bg-gray-900" style={{ borderColor: 'var(--border-color)' }}>
                        Add Payment Method
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </ThemedCard>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}