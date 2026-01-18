import React, { createContext, useEffect, useState } from 'react';
import { db } from './firebase';
import { doc, getDoc, collection } from 'firebase/firestore';

const VALORES_DEFECTO = {
  categorias: ['Ventas', 'Proveedores', 'Servicios'],
  metodos: ['Efectivo', 'Nequi', 'Bancolombia'],
  saldoInicial: 0,
  saldoPendiente: true,
};

export const ConfigContext = createContext({ ...VALORES_DEFECTO, loading: true, error: false });

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({ ...VALORES_DEFECTO });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const ref = doc(collection(db, 'configuracion'), 'principal');
        const snap = await getDoc(ref);
        let saldoPendiente = false;
        let saldoInicial = 0;
        if (snap.exists()) {
          const data = snap.data();
          saldoInicial = data.saldoInicial || 0;
          const today = new Date();
          today.setHours(0,0,0,0);
          if (!data.saldoFecha || new Date(data.saldoFecha).toDateString() !== today.toDateString()) {
            saldoPendiente = true;
          }
          setConfig({
            categorias: data.categorias && data.categorias.length ? data.categorias : VALORES_DEFECTO.categorias,
            metodos: data.metodos && data.metodos.length ? data.metodos : VALORES_DEFECTO.metodos,
            saldoInicial,
            saldoPendiente,
          });
        } else {
          setConfig({ ...VALORES_DEFECTO });
        }
        setLoading(false);
      } catch (e) {
        setError(true);
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  if (error) {
    return <div style={{color:'#fff',background:'#111827',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>Error al conectar con la base de datos</div>;
  }

  return (
    <ConfigContext.Provider value={{ ...config, loading }}>
      {children}
    </ConfigContext.Provider>
  );
};
