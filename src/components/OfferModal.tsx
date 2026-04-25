import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const OfferModal: React.FC<OfferModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Electrónica',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('products')
        .insert([
          {
            name: formData.name,
            price: parseFloat(formData.price),
            category: formData.category,
            description: formData.description,
            image_url: '' // Placeholder
          }
        ]);

      if (error) throw error;

      alert('¡Producto publicado con éxito!');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert('Error al publicar: ' + err.message);
    } finally {
      setLoading(false);
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
        maxWidth: '500px',
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

        <h2 className="pg-section-title" style={{ marginBottom: '30px' }}>Ofrecer Producto</h2>

        <form onSubmit={handleSubmit} className="pg-contact-form" style={{ background: 'transparent', padding: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>NOMBRE DEL PRODUCTO</label>
            <input
              className="pg-cf-input"
              style={{ background: '#f5f5f5', color: '#1a1a1a', border: '1px solid #eee' }}
              placeholder="Ej. iPhone 15 Pro"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>PRECIO (COP)</label>
            <input
              type="number"
              className="pg-cf-input"
              style={{ background: '#f5f5f5', color: '#1a1a1a', border: '1px solid #eee' }}
              placeholder="Ej. 4500000"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>CATEGORÍA</label>
            <select
              className="pg-cf-input"
              style={{ background: '#f5f5f5', color: '#1a1a1a', border: '1px solid #eee' }}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option>Electrónica</option>
              <option>Hogar</option>
              <option>Moda</option>
              <option>Accesorios</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>DESCRIPCIÓN</label>
            <textarea
              className="pg-cf-textarea"
              style={{ background: '#f5f5f5', color: '#1a1a1a', border: '1px solid #eee' }}
              placeholder="Describe tu producto..."
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="pg-cf-btn"
            disabled={loading}
            style={{ marginTop: '20px' }}
          >
            {loading ? 'Publicando...' : 'Publicar Ahora'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OfferModal;
