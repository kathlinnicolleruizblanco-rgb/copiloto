import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabaseClient';
import OfferModal from './components/OfferModal';
import LoginModal from './components/LoginModal';

// Tipos
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
  is_new?: boolean;
}

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert('Error al eliminar: ' + error.message);
    else fetchProducts();
  };

  // Datos mock para visualización inicial rápida
  const mockProducts: Product[] = [
    { id: '1', name: 'Producto Premium A', price: 89900, category: 'Electrónica', image_url: '', is_new: true },
    { id: '2', name: 'Reloj de Lujo', price: 150000, category: 'Accesorios', image_url: '' },
    { id: '3', name: 'Silla Minimalista', price: 210000, category: 'Hogar', image_url: '' },
    { id: '4', name: 'Audífonos Pro', price: 75000, category: 'Electrónica', image_url: '' },
  ];

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(mockProducts);
      }
    } catch (err) {
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pg">
      {/* Navbar */}
      <nav className="pg-nav">
        <div className="pg-nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="pg-dot"></div>
          <div className="pg-dot2"></div>
        </div>
        <div className="pg-nav-links">
          <a 
            href="#!" 
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
            className="active"
          >
            Inicio
          </a>
          <a 
            href="#!" 
            onClick={(e) => { e.preventDefault(); scrollToSection('productos'); }}
          >
            Productos
          </a>
          <a 
            href="#!" 
            onClick={(e) => { e.preventDefault(); scrollToSection('ofrecer'); }}
          >
            Vender
          </a>
          <a 
            href="#!" 
            onClick={(e) => { e.preventDefault(); scrollToSection('contacto'); }}
          >
            Contacto
          </a>
          {session ? (
            <a 
              href="#!" 
              onClick={(e) => { e.preventDefault(); handleLogout(); }}
              style={{ color: '#C8A96E', fontWeight: 'bold' }}
            >
              Salir (Admin)
            </a>
          ) : (
            <a 
              href="#!" 
              onClick={(e) => { e.preventDefault(); setIsLoginModalOpen(true); }}
              style={{ color: '#aaa', fontSize: '12px' }}
            >
              Admin
            </a>
          )}
        </div>
        <div className="pg-search">
          <span style={{ color: '#666' }}>⌕</span>
          <input type="text" placeholder="Buscar productos..." />
        </div>
      </nav>

      {/* Hero */}
      <header className="pg-hero animate-fade">
        <div className="pg-hero-content">
          <div className="pg-hero-tag">Colección 2025</div>
          <h1 className="pg-hero-title">Elegancia en cada <span>Detalle</span></h1>
          <p className="pg-hero-sub">Descubre una selección exclusiva de productos diseñados para elevar tu estilo de vida. Calidad garantizada.</p>
          <button className="pg-hero-btn" onClick={() => scrollToSection('productos')}>Ver Catálogo</button>
        </div>
        <div className="pg-hero-img">
           <svg width="100" height="100" viewBox="0 0 60 60" fill="none" style={{ opacity: 0.1 }}>
             <rect x="5" y="5" width="50" height="50" rx="6" stroke="white" strokeWidth="2"/>
           </svg>
        </div>
      </header>

      {/* Productos Destacados */}
      <main className="pg-section" id="productos">
        <div className="pg-section-header">
          <h2 className="pg-section-title">Productos Destacados</h2>
          <span style={{ color: '#C8A96E', cursor: 'pointer', fontSize: '14px' }}>Ver todos →</span>
        </div>

        <div className="pg-products">
          {loading ? (
            <p>Cargando productos...</p>
          ) : (
            products.map((product) => (
              <div key={product.id} className="pg-card animate-fade">
                <div className="pg-card-img">
                  <div style={{ width: '60%', height: '60%', background: '#E2DDD4', borderRadius: '12px' }}></div>
                  {product.is_new && <div className="pg-card-badge">Nuevo</div>}
                </div>
                <div className="pg-card-body">
                  <div className="pg-card-cat">{product.category}</div>
                  <h3 className="pg-card-name">{product.name}</h3>
                  <div className="pg-card-price">${product.price.toLocaleString()}</div>
                  {session && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteProduct(product.id); }}
                      style={{
                        marginTop: '15px', background: '#e74c3c', color: 'white', 
                        border: 'none', padding: '8px', borderRadius: '8px', 
                        cursor: 'pointer', width: '100%', fontSize: '12px', fontWeight: 'bold'
                      }}
                    >
                      Eliminar Producto (Admin)
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Sección Ofrecer Producto (Preview) */}
      <section className="pg-section" id="ofrecer" style={{ background: '#1a1a1a', color: '#fff' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="pg-section-title" style={{ color: '#fff', marginBottom: '20px' }}>¿Tienes algo que ofrecer?</h2>
          <p style={{ color: '#aaa', marginBottom: '40px' }}>Únete a nuestra comunidad de vendedores y llega a miles de compradores.</p>
          <button 
            className="pg-hero-btn" 
            style={{ background: '#fff', color: '#1a1a1a' }}
            onClick={() => setIsModalOpen(true)}
          >
            Empezar a Vender
          </button>
        </div>
      </section>

      {/* Modal */}
      <OfferModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchProducts}
      />
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />

      {/* Footer / Contacto */}
      <footer className="pg-footer" id="contacto">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
          <div>
            <div className="pg-nav-logo" style={{ marginBottom: '20px' }}>
              <div className="pg-dot" style={{ width: '20px', height: '20px' }}></div>
              <div className="pg-dot2" style={{ width: '15px', height: '15px' }}></div>
              <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>Mi Tienda</span>
            </div>
            <p style={{ color: '#666', fontSize: '14px' }}>La mejor plataforma para comprar y vender productos de calidad.</p>
          </div>
          <div>
            <h4 style={{ marginBottom: '20px' }}>Enlaces</h4>
            <ul style={{ listStyle: 'none', color: '#666', fontSize: '14px' }}>
              <li style={{ marginBottom: '10px' }}>Sobre Nosotros</li>
              <li style={{ marginBottom: '10px' }}>Términos y Condiciones</li>
              <li style={{ marginBottom: '10px' }}>Privacidad</li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: '20px' }}>Contacto</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>hola@mitienda.com</p>
            <p style={{ color: '#666', fontSize: '14px' }}>+57 300 000 0000</p>
          </div>
        </div>
        <div style={{ marginTop: '60px', borderTop: '1px solid #222', paddingTop: '20px', textAlign: 'center', color: '#444', fontSize: '12px' }}>
          © 2025 Mi Tienda. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

export default App;
