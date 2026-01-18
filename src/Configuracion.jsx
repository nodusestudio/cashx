
import React, { useState } from 'react';

const LOCAL_KEY = 'cashx_config';
const defaultConfig = {
  categorias: ['Servicios', 'Nómina', 'Materia Prima'],
  metodos: ['Efectivo', 'Nequi', 'Bancolombia', 'Bold', 'Aliados'],
  saldoInicial: 0,
};

const Configuracion = () => {
  const [config, setConfig] = useState(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    return stored ? JSON.parse(stored) : defaultConfig;
  });
  const [loading, setLoading] = useState(false);
  const [catInput, setCatInput] = useState('');
  const [metInput, setMetInput] = useState('');
  const [saldoInput, setSaldoInput] = useState('');
  const [msg, setMsg] = useState('');



  // Eliminado useEffect innecesario para loading


  const saveConfig = (newConfig) => {
    setLoading(true);
    setConfig(newConfig);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(newConfig));
    setLoading(false);
    setMsg('Configuración guardada');
    setTimeout(() => setMsg(''), 2000);
  };

  // Categorías
  const handleAddCategoria = () => {
    if (!catInput.trim()) return;
    const newConfig = { ...config, categorias: [...config.categorias, catInput.trim()] };
    saveConfig(newConfig);
    setCatInput('');
  };
  const handleRemoveCategoria = (cat) => {
    const newConfig = { ...config, categorias: config.categorias.filter(c => c !== cat) };
    saveConfig(newConfig);
  };

  // Métodos de pago
  const handleAddMetodo = () => {
    if (!metInput.trim()) return;
    const newConfig = { ...config, metodos: [...config.metodos, metInput.trim()] };
    saveConfig(newConfig);
    setMetInput('');
  };
  const handleRemoveMetodo = (met) => {
    const newConfig = { ...config, metodos: config.metodos.filter(m => m !== met) };
    saveConfig(newConfig);
  };

  // Saldo inicial
  const handleSaldoChange = (e) => {
    setSaldoInput(e.target.value);
  };
  const handleSaveSaldo = () => {
    const saldo = Number(saldoInput);
    if (isNaN(saldo)) return;
    const newConfig = { ...config, saldoInicial: saldo };
    saveConfig(newConfig);
  };

  if (loading) return <div className="text-white">Cargando...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-[#111827] min-h-screen">
      {/* Categorías */}
      <div className="bg-[#1F2937] rounded-xl p-6 flex flex-col">
        <h2 className="text-white text-xl font-bold mb-4">Categorías de Gasto</h2>
        <div className="flex gap-2 mb-4">
          <input value={catInput} onChange={e => setCatInput(e.target.value)} className="bg-[#111827] text-white rounded p-2 flex-1" placeholder="Nueva categoría" />
          <button onClick={handleAddCategoria} className="bg-[#206DDA] text-white rounded px-4 py-2 font-bold">Agregar</button>
        </div>
        <ul className="space-y-2">
          {config.categorias.map(cat => (
            <li key={cat} className="flex justify-between items-center bg-[#111827] rounded p-2 text-white">
              <span>{cat}</span>
              <button onClick={() => handleRemoveCategoria(cat)} className="text-red-400 hover:text-red-600 font-bold">Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
      {/* Métodos de Pago */}
      <div className="bg-[#1F2937] rounded-xl p-6 flex flex-col">
        <h2 className="text-white text-xl font-bold mb-4">Métodos de Pago</h2>
        <div className="flex gap-2 mb-4">
          <input value={metInput} onChange={e => setMetInput(e.target.value)} className="bg-[#111827] text-white rounded p-2 flex-1" placeholder="Nuevo método" />
          <button onClick={handleAddMetodo} className="bg-[#206DDA] text-white rounded px-4 py-2 font-bold">Agregar</button>
        </div>
        <ul className="space-y-2">
          {config.metodos.map(met => (
            <li key={met} className="flex justify-between items-center bg-[#111827] rounded p-2 text-white">
              <span>{met}</span>
              <button onClick={() => handleRemoveMetodo(met)} className="text-red-400 hover:text-red-600 font-bold">Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
      {/* Saldo Inicial */}
      <div className="bg-[#1F2937] rounded-xl p-6 flex flex-col col-span-1 md:col-span-2 mt-8">
        <h2 className="text-white text-xl font-bold mb-4">Saldo de Apertura</h2>
        <div className="flex gap-2 items-center">
          <input type="number" value={saldoInput} onChange={handleSaldoChange} className="bg-[#111827] text-white rounded p-2 w-40" placeholder="Saldo inicial" />
          <button onClick={handleSaveSaldo} className="bg-[#206DDA] text-white rounded px-4 py-2 font-bold">Guardar</button>
          <span className="text-white ml-4">Actual: <span className="font-bold">${config.saldoInicial.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span></span>
        </div>
      </div>
      {msg && <div className="text-green-400 text-center col-span-2 mt-4">{msg}</div>}
    </div>
  );
};

export default Configuracion;
