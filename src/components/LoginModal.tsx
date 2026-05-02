import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    
    if (error) {
      alert('Error al iniciar sesión: ' + error.message);
    } else {
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(5px)'
    }}>
      <div className="animate-fade" style={{
        background: '#fff',
        padding: '40px',
        borderRadius: '24px',
        width: '90%',
        maxWidth: '400px',
        position: 'relative'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer'
        }}>×</button>

        <h2 className="pg-section-title" style={{ marginBottom: '30px', fontSize: '24px' }}>Acceso Admin</h2>

        <form onSubmit={handleLogin} className="pg-contact-form" style={{ background: 'transparent', padding: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>CORREO</label>
            <input
              type="email"
              className="pg-cf-input"
              style={{ background: '#f5f5f5', color: '#1a1a1a', border: '1px solid #eee' }}
              placeholder="ejemplo@correo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>CONTRASEÑA</label>
            <input
              type="password"
              className="pg-cf-input"
              style={{ background: '#f5f5f5', color: '#1a1a1a', border: '1px solid #eee' }}
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="pg-cf-btn"
            disabled={loading}
            style={{ marginTop: '20px' }}
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
