import React, { useState, useRef } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  Camera, 
  AlertCircle, 
  Check, 
  AtSign, 
  FileText, 
  Compass,
  X
} from 'lucide-react';
import { CurioLogo } from '../components/common/CurioLogo';
import { useAuth } from '../hooks/useAuth';
import { checkUsernameAvailability, uploadProfilePicture } from '../services/users/userService';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { 
    loginWithEmail, 
    registerWithEmail, 
    loginWithGoogle, 
    sendPasswordReset,
    authError,
    clearAuthError
  } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Hidden Gems', 'Secret Cafes']);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Username validation state
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const interestOptions = [
    'Hidden Gems', 
    'Secret Cafes', 
    'Night Views', 
    'Sea Caves', 
    'Cliff Hikes', 
    'Architectural', 
    'Stargazing', 
    'Boutique Stays'
  ];

  const handleUsernameChange = (val: string) => {
    const clean = val.trim().toLowerCase().replace(/[^a-zA-Z0-9_.]/g, '').slice(0, 30);
    setUsername(clean);
    setLocalError(null);

    if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);

    if (clean.length < 3) {
      setUsernameStatus(clean.length === 0 ? 'idle' : 'invalid');
      return;
    }

    setUsernameStatus('checking');
    checkTimeoutRef.current = setTimeout(async () => {
      try {
        const available = await checkUsernameAvailability(clean);
        setUsernameStatus(available ? 'available' : 'taken');
      } catch (err) {
        console.warn('Username availability check error:', err);
        setUsernameStatus('idle');
      }
    }, 350);
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setLocalError('Please choose an image file (PNG, JPG, or WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setLocalError('Avatar file must be less than 5MB.');
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  // Sign In Handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setLocalError(null);
    setStatusMessage(null);

    if (!email.trim() || !password) {
      setLocalError('Please provide both your email and password.');
      return;
    }

    setLoading(true);
    try {
      await loginWithEmail(email, password);
      onLoginSuccess?.();
    } catch (err: any) {
      // Friendly message handled in authService / errors.ts
    } finally {
      setLoading(false);
    }
  };

  // Sign Up Handler
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setLocalError(null);
    setStatusMessage(null);

    const cleanName = name.trim();
    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim();

    // Validation
    if (!cleanName) {
      setLocalError('Please provide your full name.');
      return;
    }
    if (!cleanUsername || cleanUsername.length < 3) {
      setLocalError('Username must be at least 3 characters.');
      return;
    }
    if (usernameStatus === 'taken') {
      setLocalError(`The username @${cleanUsername} is already taken.`);
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setLocalError('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match. Please verify your confirmation password.');
      return;
    }

    setLoading(true);
    try {
      let finalPhotoURL = '';
      if (avatarFile) {
        try {
          // If avatar file provided, convert to data URL or upload
          const reader = new FileReader();
          finalPhotoURL = await new Promise((resolve) => {
            reader.onload = (ev) => resolve(ev.target?.result as string || '');
            reader.readAsDataURL(avatarFile);
          });
        } catch (e) {
          console.warn('Avatar read issue:', e);
        }
      }

      await registerWithEmail({
        name: cleanName,
        username: cleanUsername,
        email: cleanEmail,
        password,
        bio: bio.trim(),
        interests: selectedInterests,
        photoURL: finalPhotoURL,
      });

      onLoginSuccess?.();
    } catch (err: any) {
      // Errors handled via context
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    clearAuthError();
    setLocalError(null);
    setStatusMessage(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onLoginSuccess?.();
    } catch (err: any) {
      // Errors handled via context
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Handler
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setLocalError(null);
    try {
      await sendPasswordReset(email.trim());
      setStatusMessage('If an account is registered with this address, a reset dispatch has been transmitted.');
    } catch {
      setStatusMessage('If an account is registered with this address, a reset dispatch has been transmitted.');
    } finally {
      setLoading(false);
    }
  };

  const activeError = localError || authError;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#FFFDF4] via-[#F5FAF5] to-[#EDF5EE] flex items-center justify-center p-4 relative overflow-hidden py-10 selection:bg-[#BDE5CF] selection:text-[#285943]">
      {/* Soft pastel ambient background blobs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#BDE5CF]/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#E9E2F7]/35 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-[#DDF1E4]/40 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Glass Card in Clean White */}
      <div className={`relative w-full ${isSignUp ? 'max-w-lg' : 'max-w-md'} rounded-3xl bg-white border border-[#A8C9B2]/50 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-[#285943]/5 z-10 transition-all duration-300`}>
        {/* RoAmigos Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <CurioLogo size="lg" showTagline={true} />
        </div>

        {/* Status Message (e.g. Password reset) */}
        {statusMessage && (
          <div className="mb-5 p-3 rounded-xl bg-[#DDF1E4]/70 border border-[#A8C9B2]/50 text-[#285943] text-xs text-center font-medium flex items-center justify-center gap-2 shadow-2xs">
            <Check className="w-4 h-4 text-[#285943] shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Error Alert Box */}
        {activeError && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs text-center font-medium flex items-center justify-center gap-2 shadow-2xs">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{activeError}</span>
          </div>
        )}

        {isForgotPassword ? (
          /* Forgot Password View */
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="font-display text-lg font-bold text-[#243D32]">Reset Coordinates</h2>
              <p className="text-xs text-[#718579] mt-1">
                Enter your explorer email to receive secure recovery instructions.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#243D32]">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A8C9B2] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="explorer@roamigos.app"
                  className="w-full bg-[#F5FAF5] border border-[#A8C9B2]/60 focus:border-[#285943] focus:ring-2 focus:ring-[#BDE5CF]/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#243D32] focus:outline-none transition-all placeholder:text-[#9BAA9F]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#285943] hover:bg-[#1f4634] text-[#FFFDF4] font-bold text-sm shadow-md shadow-[#285943]/15 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Send Recovery Dispatch'
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsForgotPassword(false);
                clearAuthError();
                setLocalError(null);
              }}
              className="w-full text-center text-xs text-[#718579] hover:text-[#285943] transition-colors pt-2 cursor-pointer font-medium"
            >
              Back to Sign In
            </button>
          </form>
        ) : (
          /* Sign In & Sign Up Tab Views */
          <div>
            {/* Segmented Auth Mode Switch */}
            <div className="flex p-1 bg-[#EDF5EE] rounded-xl border border-[#A8C9B2]/40 mb-6">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  clearAuthError();
                  setLocalError(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  !isSignUp
                    ? 'bg-white text-[#285943] font-bold shadow-xs border border-[#A8C9B2]/30'
                    : 'text-[#718579] hover:text-[#243D32]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  clearAuthError();
                  setLocalError(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  isSignUp
                    ? 'bg-white text-[#285943] font-bold shadow-xs border border-[#A8C9B2]/30'
                    : 'text-[#718579] hover:text-[#243D32]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Google OAuth Button UI */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#EDF5EE] border border-[#A8C9B2]/60 text-[#243D32] text-xs font-semibold transition-all flex items-center justify-center gap-3 cursor-pointer mb-5 group active:scale-[0.99] shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center mb-5">
              <div className="border-t border-[#A8C9B2]/30 w-full" />
              <span className="bg-white px-3 text-[11px] text-[#718579] uppercase font-mono tracking-wider">
                or with email
              </span>
            </div>

            {/* SIGN IN FORM */}
            {!isSignUp ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#243D32]">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#A8C9B2] absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="explorer@roamigos.app"
                      className="w-full bg-[#F5FAF5] border border-[#A8C9B2]/60 focus:border-[#285943] focus:ring-2 focus:ring-[#BDE5CF]/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#243D32] focus:outline-none transition-all placeholder:text-[#9BAA9F]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#243D32]">Password</label>
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-[11px] text-[#285943] hover:underline transition-colors cursor-pointer font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#A8C9B2] absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#F5FAF5] border border-[#A8C9B2]/60 focus:border-[#285943] focus:ring-2 focus:ring-[#BDE5CF]/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#243D32] focus:outline-none transition-all placeholder:text-[#9BAA9F]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#285943] hover:bg-[#1f4634] text-[#FFFDF4] font-bold text-sm shadow-md shadow-[#285943]/15 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Enter RoAmigos</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* REGISTRATION FORM (Full validation & profile collection) */
              <form onSubmit={handleSignUp} className="space-y-4">
                {/* Profile Picture Upload with Preview */}
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#EDF5EE] border border-[#A8C9B2]/40">
                  <div className="relative w-14 h-14 rounded-2xl bg-white border border-[#A8C9B2]/50 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-[#A8C9B2]" />
                    )}
                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarPreview(null);
                          setAvatarFile(null);
                        }}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                        title="Remove photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <label className="block text-xs font-semibold text-[#243D32]">
                      Profile Picture (Optional)
                    </label>
                    <p className="text-[11px] text-[#718579] truncate">JPEG, PNG, or WEBP under 5MB</p>
                    <label className="inline-flex items-center gap-1.5 mt-1 text-xs font-semibold text-[#285943] hover:underline cursor-pointer">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{avatarPreview ? 'Change Photo' : 'Upload Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Name & Username Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#243D32]">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#A8C9B2] absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Kaelen Vance"
                        className="w-full bg-[#F5FAF5] border border-[#A8C9B2]/60 focus:border-[#285943] focus:ring-2 focus:ring-[#BDE5CF]/50 rounded-xl py-2 pl-9 pr-3 text-xs text-[#243D32] focus:outline-none transition-all placeholder:text-[#9BAA9F]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#243D32]">
                        Username <span className="text-red-500">*</span>
                      </label>
                      {usernameStatus === 'checking' && (
                        <span className="text-[10px] text-[#718579]">checking...</span>
                      )}
                      {usernameStatus === 'available' && (
                        <span className="text-[10px] text-[#285943] font-semibold flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> available
                        </span>
                      )}
                      {usernameStatus === 'taken' && (
                        <span className="text-[10px] text-red-600 font-semibold">taken</span>
                      )}
                    </div>
                    <div className="relative">
                      <AtSign className="w-4 h-4 text-[#A8C9B2] absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        placeholder="handle"
                        className={`w-full bg-[#F5FAF5] border rounded-xl py-2 pl-9 pr-3 text-xs text-[#243D32] focus:outline-none transition-all placeholder:text-[#9BAA9F] ${
                          usernameStatus === 'available'
                            ? 'border-[#285943] focus:border-[#285943]'
                            : usernameStatus === 'taken'
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-[#A8C9B2]/60 focus:border-[#285943]'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#243D32]">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#A8C9B2] absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="explorer@roamigos.app"
                      className="w-full bg-[#F5FAF5] border border-[#A8C9B2]/60 focus:border-[#285943] focus:ring-2 focus:ring-[#BDE5CF]/50 rounded-xl py-2 pl-10 pr-4 text-xs text-[#243D32] focus:outline-none transition-all placeholder:text-[#9BAA9F]"
                    />
                  </div>
                </div>

                {/* Password & Confirm Password Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#243D32]">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#A8C9B2] absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 chars"
                        className="w-full bg-[#F5FAF5] border border-[#A8C9B2]/60 focus:border-[#285943] focus:ring-2 focus:ring-[#BDE5CF]/50 rounded-xl py-2 pl-9 pr-3 text-xs text-[#243D32] focus:outline-none transition-all placeholder:text-[#9BAA9F]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#243D32]">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#A8C9B2] absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full bg-[#F5FAF5] border border-[#A8C9B2]/60 focus:border-[#285943] focus:ring-2 focus:ring-[#BDE5CF]/50 rounded-xl py-2 pl-9 pr-3 text-xs text-[#243D32] focus:outline-none transition-all placeholder:text-[#9BAA9F]"
                      />
                    </div>
                  </div>
                </div>

                {/* Optional Bio */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#243D32]">
                    Explorer Bio <span className="text-[#718579] font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell fellow explorers about the places you seek..."
                    className="w-full bg-[#F5FAF5] border border-[#A8C9B2]/60 focus:border-[#285943] focus:ring-2 focus:ring-[#BDE5CF]/50 rounded-xl py-2 px-3 text-xs text-[#243D32] focus:outline-none resize-none transition-all placeholder:text-[#9BAA9F]"
                  />
                </div>

                {/* Optional Curiosity Interests */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#243D32]">
                    Travel Interests <span className="text-[#718579] font-normal">(Optional)</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {interestOptions.map((interest) => {
                      const isSelected = selectedInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#285943] text-[#FFFDF4] shadow-2xs font-semibold'
                              : 'bg-[#EDF5EE] text-[#718579] hover:text-[#243D32] hover:bg-[#DDF1E4] border border-[#A8C9B2]/40'
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#285943] hover:bg-[#1f4634] text-[#FFFDF4] font-bold text-sm shadow-md shadow-[#285943]/15 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Establish RoAmigos Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
