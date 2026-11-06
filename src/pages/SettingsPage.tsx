import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  MapPin, 
  Eye, 
  Shield, 
  LogOut, 
  Check, 
  Moon, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import { User as UserType } from '../types';

interface SettingsPageProps {
  user: UserType;
  onLogout: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState<
    'account' | 'privacy' | 'notifications' | 'location' | 'appearance' | 'security'
  >('account');

  // Interactive toggle states
  const [allowLocationSharing, setAllowLocationSharing] = useState(true);
  const [preciseCoordinates, setPreciseCoordinates] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [placeAlerts, setPlaceAlerts] = useState(true);
  const [themeAccent, setThemeAccent] = useState<'cyan' | 'violet' | 'amber'>('cyan');
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'friends_only'>('public');
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  const showSaveNotice = (msg: string) => {
    setSavedFeedback(msg);
    setTimeout(() => setSavedFeedback(null), 2500);
  };

  const navItems = [
    { id: 'account', label: 'Account Profile', icon: <User className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy & Sharing', icon: <Eye className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications Radar', icon: <Bell className="w-4 h-4" /> },
    { id: 'location', label: 'Location & Telemetry', icon: <MapPin className="w-4 h-4" /> },
    { id: 'appearance', label: 'Visual Theme', icon: <Moon className="w-4 h-4" /> },
    { id: 'security', label: 'Security & Auth', icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Settings Container */}
      <div className="rounded-3xl bg-white border border-[#A8C9B2]/50 shadow-lg shadow-[#285943]/05 overflow-hidden flex flex-col md:flex-row min-h-[580px]">
        {/* Settings Navigation Sidebar */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#EDF5EE] p-4 bg-[#EDF5EE]/40 flex flex-col justify-between shrink-0">
          <div className="space-y-1">
            <div className="px-3 py-2 mb-2">
              <h3 className="font-display font-bold text-base text-[#243D32]">
                Preferences
              </h3>
              <p className="text-[11px] text-[#718579]">RoAmigos Experience</p>
            </div>

            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#BDE5CF] text-[#285943] border border-[#A8C9B2]/60 shadow-xs'
                      : 'text-[#718579] hover:text-[#243D32] hover:bg-white/80'
                  }`}
                >
                  <span className={isActive ? 'text-[#285943]' : 'text-[#718579]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#EDF5EE] mt-4">
            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of RoAmigos</span>
            </button>
          </div>
        </div>

        {/* Settings Form Pane */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6">
          {savedFeedback && (
            <div className="p-3 rounded-xl bg-[#DDF1E4] border border-[#A8C9B2]/50 text-[#285943] text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-[#285943]" />
              <span>{savedFeedback}</span>
            </div>
          )}

          {/* Account Settings */}
          {activeSection === 'account' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-lg text-[#243D32]">Account Details</h3>
                <p className="text-xs text-[#718579] mt-0.5">Manage your personal credentials and primary explorer identity.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#243D32]">Registered Email</label>
                  <input
                    type="email"
                    disabled
                    value={user.email || 'explorer@roamigos.app'}
                    className="w-full bg-[#EDF5EE]/40 border border-[#A8C9B2]/30 rounded-xl py-2 px-3 text-xs text-[#718579] cursor-not-allowed"
                  />
                  <span className="text-[10px] text-[#718579]">Firebase Authentication provider linked</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#243D32]">Explorer Tag</label>
                  <input
                    type="text"
                    disabled
                    value={`@${user.username}`}
                    className="w-full bg-[#EDF5EE]/40 border border-[#A8C9B2]/30 rounded-xl py-2 px-3 text-xs text-[#718579]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => showSaveNotice('Account details updated successfully.')}
                  className="px-4 py-2 rounded-xl bg-[#BDE5CF] hover:bg-[#A8C9B2] text-[#285943] font-bold text-xs border border-[#A8C9B2]/60 shadow-xs transition-all cursor-pointer"
                >
                  Save Account Changes
                </button>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-lg text-[#243D32]">Privacy & Social Discovery</h3>
                <p className="text-xs text-[#718579] mt-0.5">Control who can discover your saved places and spot recommendations.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#EDF5EE]/40 border border-[#A8C9B2]/30">
                  <div>
                    <h4 className="text-sm font-semibold text-[#243D32]">Profile Discovery</h4>
                    <p className="text-xs text-[#718579] mt-0.5">Allow friends of friends to find your profile in suggestions.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileVisibility === 'public'}
                    onChange={() => {
                      setProfileVisibility((prev) => (prev === 'public' ? 'friends_only' : 'public'));
                      showSaveNotice('Privacy preference updated.');
                    }}
                    className="w-4 h-4 accent-[#285943] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#EDF5EE]/40 border border-[#A8C9B2]/30">
                  <div>
                    <h4 className="text-sm font-semibold text-[#243D32]">Saved Places Visibility</h4>
                    <p className="text-xs text-[#718579] mt-0.5">Show your bookmarked curiosities to members in mutual groups.</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    onChange={() => showSaveNotice('Saved places privacy updated.')}
                    className="w-4 h-4 accent-[#285943] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-lg text-[#243D32]">Notifications Radar</h3>
                <p className="text-xs text-[#718579] mt-0.5">Manage push and in-app alerts for trips, places, and messages.</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#EDF5EE]/40 border border-[#A8C9B2]/30">
                  <div>
                    <h4 className="text-sm font-semibold text-[#243D32]">Direct Dispatch Alerts</h4>
                    <p className="text-xs text-[#718579]">Receive alerts when friends send messages or pin drops.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushNotifs}
                    onChange={(e) => {
                      setPushNotifs(e.target.checked);
                      showSaveNotice('Message notification settings updated.');
                    }}
                    className="w-4 h-4 accent-[#285943] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#EDF5EE]/40 border border-[#A8C9B2]/30">
                  <div>
                    <h4 className="text-sm font-semibold text-[#243D32]">Curiosity Radar Alerts</h4>
                    <p className="text-xs text-[#718579]">Notify when someone shares a new hidden gem near you.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={placeAlerts}
                    onChange={(e) => {
                      setPlaceAlerts(e.target.checked);
                      showSaveNotice('Place alerts updated.');
                    }}
                    className="w-4 h-4 accent-[#285943] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Location Settings */}
          {activeSection === 'location' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-lg text-[#243D32]">Location Services</h3>
                <p className="text-xs text-[#718579] mt-0.5">Control geolocation resolution for finding nearby spots.</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#EDF5EE]/40 border border-[#A8C9B2]/30">
                  <div>
                    <h4 className="text-sm font-semibold text-[#243D32]">Allow Proximity Scanning</h4>
                    <p className="text-xs text-[#718579]">Find curiosities within your current city or district.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowLocationSharing}
                    onChange={(e) => {
                      setAllowLocationSharing(e.target.checked);
                      showSaveNotice('Location sharing toggled.');
                    }}
                    className="w-4 h-4 accent-[#285943] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#EDF5EE]/40 border border-[#A8C9B2]/30">
                  <div>
                    <h4 className="text-sm font-semibold text-[#243D32]">Approximate Fuzzing (Privacy Shield)</h4>
                    <p className="text-xs text-[#718579]">Fuzz your coordinate radius to ~500m for added privacy.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={!preciseCoordinates}
                    onChange={(e) => {
                      setPreciseCoordinates(!e.target.checked);
                      showSaveNotice('Location precision adjusted.');
                    }}
                    className="w-4 h-4 accent-[#285943] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-lg text-[#243D32]">Visual Identity</h3>
                <p className="text-xs text-[#718579] mt-0.5">Mint Explorer nature-inspired pastel theme presets.</p>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-semibold text-[#243D32]">Active Theme Preset</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setThemeAccent('cyan');
                      showSaveNotice('Mint Explorer theme active.');
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      themeAccent === 'cyan'
                        ? 'border-[#285943] bg-[#DDF1E4] text-[#285943] font-bold shadow-xs'
                        : 'border-[#A8C9B2]/40 bg-white text-[#718579]'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-[#BDE5CF] border border-[#285943] mx-auto mb-2 shadow-xs" />
                    <span className="text-xs">Mint Explorer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setThemeAccent('violet');
                      showSaveNotice('Lavender Mist theme active.');
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      themeAccent === 'violet'
                        ? 'border-[#285943] bg-[#E9E2F7] text-[#243D32] font-bold shadow-xs'
                        : 'border-[#A8C9B2]/40 bg-white text-[#718579]'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-[#E9E2F7] border border-[#A8C9B2] mx-auto mb-2 shadow-xs" />
                    <span className="text-xs">Lavender Mist</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setThemeAccent('amber');
                      showSaveNotice('Sage Forest theme active.');
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      themeAccent === 'amber'
                        ? 'border-[#285943] bg-[#EDF5EE] text-[#285943] font-bold shadow-xs'
                        : 'border-[#A8C9B2]/40 bg-white text-[#718579]'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-[#A8C9B2] border border-[#285943] mx-auto mb-2 shadow-xs" />
                    <span className="text-xs">Sage Forest</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeSection === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-lg text-[#243D32]">Security & Encryption</h3>
                <p className="text-xs text-[#718579] mt-0.5">Protect your expedition logs and travel account.</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#EDF5EE]/40 border border-[#A8C9B2]/30">
                  <div>
                    <h4 className="text-sm font-semibold text-[#243D32]">Two-Factor Authentication</h4>
                    <p className="text-xs text-[#718579]">Requires verification dispatch on new login attempts.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={twoFactorAuth}
                    onChange={(e) => {
                      setTwoFactorAuth(e.target.checked);
                      showSaveNotice('Two-Factor Authentication updated.');
                    }}
                    className="w-4 h-4 accent-[#285943] cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#EDF5EE]/40 border border-[#A8C9B2]/30 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-[#243D32]">Session Credentials</h4>
                    <p className="text-xs text-[#718579]">Signed in on Chrome · Mac OS (San Francisco, CA)</p>
                  </div>
                  <span className="text-[11px] font-mono text-[#285943] font-semibold">Active Now</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
