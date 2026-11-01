import React, { useState } from 'react';
import type { User } from '../types';
import { apiService } from '../services/api';
import { X, LogIn, UserPlus, Shield, User as UserIcon, Lock, Mail, AtSign, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  noticeMsg?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess, noticeMsg }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login Form States
  const [identifier, setIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'admin' | 'user'>('user');

  // CAPTCHA State
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [isCaptchaVerifying, setIsCaptchaVerifying] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

  // Status & Error
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCaptchaClick = () => {
    if (isCaptchaVerified || isCaptchaVerifying) return;
    setIsCaptchaVerifying(true);
    setCaptchaError(false);

    // Simulate 0.6s CAPTCHA security verification check
    setTimeout(() => {
      setIsCaptchaVerifying(false);
      setIsCaptchaVerified(true);
    }, 600);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isCaptchaVerified) {
      setCaptchaError(true);
      return;
    }

    setLoading(true);

    try {
      const user = await apiService.loginUser(identifier, loginPassword);
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isCaptchaVerified) {
      setCaptchaError(true);
      return;
    }

    setLoading(true);

    try {
      const user = await apiService.registerUser(regName, regUsername, regEmail, regPassword, regRole);
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const resetMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setErrorMsg('');
    setCaptchaError(false);
    setIsCaptchaVerified(false);
    setIsCaptchaVerifying(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <div className="tab-switcher">
            <button
              className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => resetMode('login')}
            >
              <LogIn size={16} /> Sign In
            </button>
            <button
              className={`tab-btn ${mode === 'register' ? 'active' : ''}`}
              onClick={() => resetMode('register')}
            >
              <UserPlus size={16} /> Create Account
            </button>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {noticeMsg && <div className="auth-notice-banner"><Lock size={15} /> {noticeMsg}</div>}
        {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}

        {mode === 'login' ? (
          /* Sign In Form */
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="form-group">
              <label><Mail size={14} /> Email or Username</label>
              <input
                type="text"
                required
                placeholder="admin@gallery.com or username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label><Lock size={14} /> Password</label>
              <input
                type="password"
                required
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>

            {/* CAPTCHA verification widget */}
            <div className={`captcha-container ${captchaError ? 'captcha-error' : ''}`}>
              <div className="captcha-box" onClick={handleCaptchaClick}>
                <div className="captcha-checkbox-wrapper">
                  {isCaptchaVerifying ? (
                    <Loader2 size={24} className="captcha-spinner" />
                  ) : isCaptchaVerified ? (
                    <CheckCircle2 size={26} className="captcha-checkmark" />
                  ) : (
                    <div className="captcha-checkbox" />
                  )}
                </div>
                <span className="captcha-label">
                  {isCaptchaVerified ? "Verified: I'm not a robot" : "I'm not a robot"}
                </span>
              </div>

              <div className="captcha-brand">
                <ShieldCheck size={28} className="captcha-brand-logo" />
                <span className="captcha-brand-text">reCAPTCHA</span>
                <span className="captcha-terms">Privacy - Terms</span>
              </div>
            </div>
            {captchaError && (
              <span className="captcha-error-text">Please check "I'm not a robot" CAPTCHA to continue.</span>
            )}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            <div className="auth-switch-prompt">
              Don't have an account yet?{' '}
              <button type="button" className="auth-switch-link" onClick={() => resetMode('register')}>
                Register / Create Account
              </button>
            </div>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <div className="form-group">
              <label><UserIcon size={14} /> Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah Connor"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label><AtSign size={14} /> Username</label>
                <input
                  type="text"
                  required
                  placeholder="sarah_c"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label><Mail size={14} /> Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="sarah@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label><Lock size={14} /> Password</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label><Shield size={14} /> Account Role</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as 'admin' | 'user')}
                >
                  <option value="user">Standard User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            {/* CAPTCHA verification widget */}
            <div className={`captcha-container ${captchaError ? 'captcha-error' : ''}`}>
              <div className="captcha-box" onClick={handleCaptchaClick}>
                <div className="captcha-checkbox-wrapper">
                  {isCaptchaVerifying ? (
                    <Loader2 size={24} className="captcha-spinner" />
                  ) : isCaptchaVerified ? (
                    <CheckCircle2 size={26} className="captcha-checkmark" />
                  ) : (
                    <div className="captcha-checkbox" />
                  )}
                </div>
                <span className="captcha-label">
                  {isCaptchaVerified ? "Verified: I'm not a robot" : "I'm not a robot"}
                </span>
              </div>

              <div className="captcha-brand">
                <ShieldCheck size={28} className="captcha-brand-logo" />
                <span className="captcha-brand-text">reCAPTCHA</span>
                <span className="captcha-terms">Privacy - Terms</span>
              </div>
            </div>
            {captchaError && (
              <span className="captcha-error-text">Please check "I'm not a robot" CAPTCHA to continue.</span>
            )}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Register Account'}
            </button>

            <div className="auth-switch-prompt">
              Already have an account?{' '}
              <button type="button" className="auth-switch-link" onClick={() => resetMode('login')}>
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
