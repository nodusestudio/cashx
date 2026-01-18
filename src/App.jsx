

import React, { useState } from 'react';

// ErrorBoundary simple (opcional, no relacionado a firebase)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {}
  render() {
    if (this.state.hasError) {
      return <div style={{color:'#fff',background:'#111827',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>Ocurrió un error inesperado</div>;
    }
    return this.props.children;
  }
}
import Dashboard from './Dashboard';
import Configuracion from './Configuracion';
import Reportes from './Reportes';
import { ConfigProvider, ConfigContext } from './ConfigContext';

const sidebarItems = [
  { label: 'Dashboard' },
  { label: 'Reportes' },
  { label: 'Configuración' },
];

function App() {
  const [selected, setSelected] = useState('Dashboard');

  return (
    <ConfigProvider>
      <ConfigContext.Consumer>
        {({ saldoPendiente, loading }) => (
          loading ? (
            <div style={{color:'#fff',background:'#111827',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Cargando...</div>
          ) : (
            <div style={{display:'flex',height:'100vh',background:'#111827',color:'#fff',fontFamily:'Inter, sans-serif'}}>
              {/* Sidebar */}
              <aside style={{width:220,background:'#1F2937',display:'flex',flexDirection:'column',padding:'32px 0',gap:8}}>
                <div style={{fontWeight:700,fontSize:22,letterSpacing:1.5,marginBottom:32,marginLeft:24,color:'#206DDA'}}>CashX</div>
                {sidebarItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setSelected(item.label)}
                    style={{
                      background: selected === item.label ? '#206DDA' : 'transparent',
                      color: selected === item.label ? '#fff' : '#fff',
                      border: 'none',
                      textAlign: 'left',
                      padding: '12px 24px',
                      borderRadius: 8,
                      fontWeight: 500,
                      fontSize: 16,
                      margin: '2px 0',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      position: item.label === 'Configuración' ? 'relative' : undefined,
                    }}
                  >
                    {item.label}
                  </button>
                ))}
                function App() {
                  const [selected, setSelected] = useState('Dashboard');
                  return (
                    <ConfigProvider>
                      <ConfigContext.Consumer>
                        {({ saldoPendiente, loading }) => (
                          loading ? (
                            <div style={{color:'#fff',background:'#111827',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Cargando...</div>
                          ) : (
                            <div style={{display:'flex',height:'100vh',background:'#111827',color:'#fff',fontFamily:'Inter, sans-serif'}}>
                              {/* Sidebar */}
                              <aside style={{width:220,background:'#1F2937',display:'flex',flexDirection:'column',padding:'32px 0',gap:8}}>
                                <div style={{fontWeight:700,fontSize:22,letterSpacing:1.5,marginBottom:32,marginLeft:24,color:'#206DDA'}}>CashX</div>
                                {sidebarItems.map((item) => (
                                  <button
                                    key={item.label}
                                    onClick={() => setSelected(item.label)}
                                    style={{
export default App;
                                      color: selected === item.label ? '#fff' : '#fff',
                                      border: 'none',
                                      textAlign: 'left',
                                      padding: '12px 24px',
                                      borderRadius: 8,
                                      fontWeight: 500,
                                      fontSize: 16,
                                      margin: '2px 0',
                                      cursor: 'pointer',
                                      transition: 'background 0.2s',
                                      position: item.label === 'Configuración' ? 'relative' : undefined,
                                    }}
                                  >
                                    {item.label}
                                  </button>
                                ))}
                                {saldoPendiente && (
                                  <div style={{marginTop:24,marginLeft:24,background:'#206DDA',color:'#fff',borderRadius:8,padding:'6px 12px',fontWeight:600,fontSize:14}}>Pendiente Saldo Inicial</div>
                                )}
                              </aside>
                              {/* Main Content */}
                              <main style={{flex:1,overflowY:'auto',padding:'32px',background:'#111827'}}>
                                {selected === 'Dashboard' && <Dashboard />}
                                {selected === 'Reportes' && <Reportes />}
                                {selected === 'Configuración' && <Configuracion />}
                              </main>
                            </div>
                          )
                        )}
                      </ConfigContext.Consumer>
                    </ConfigProvider>
                  );
                }

