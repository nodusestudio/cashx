
import React, { useState, useContext } from 'react';
import { ConfigContext } from './ConfigContext';

const initialState = {
  tipo: 'Ingreso',
  monto: '',
  categoria: '',
  metodo: '',
  nota: '',
};


const FormularioMovimiento = ({ onClose, onAddMovimiento }) => {
  const { categorias, metodos } = useContext(ConfigContext);
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.tipo || !form.monto || !form.categoria || !form.metodo) return;
    setLoading(true);
    const nuevoMovimiento = {
      ...form,
      id: Date.now(),
      monto: Number(form.monto),
      fecha: new Date(),
    };
    // Guardar en localStorage
    const LOCAL_KEY = 'cashx_movimientos';
    let data = [];
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) {
      data = JSON.parse(stored);
    }
    data.unshift(nuevoMovimiento);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
    if (onAddMovimiento) onAddMovimiento(nuevoMovimiento);
    setForm(initialState);
    setMsg('Movimiento Registrado');
    setTimeout(() => setMsg(''), 2000);
    setLoading(false);
    if (onClose) onClose();
  };

  if (loading) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <form onSubmit={handleSubmit} className="bg-[#1F2937] rounded-xl p-8 w-full max-w-md shadow-xl flex flex-col gap-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-white">Nuevo Movimiento</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Tipo</label>
          <select name="tipo" value={form.tipo} onChange={handleChange} className="w-full rounded p-2 bg-[#111827] text-white">
            <option value="Ingreso">Ingreso</option>
            <option value="Egreso">Egreso</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Monto</label>
          <input name="monto" type="number" min="0" value={form.monto} onChange={handleChange} className="w-full rounded p-2 bg-[#111827] text-white" required />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Categoría</label>
          <select name="categoria" value={form.categoria} onChange={handleChange} className="w-full rounded p-2 bg-[#111827] text-white" required>
            <option value="">Selecciona...</option>
            {categorias && categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Método de Pago</label>
          <select name="metodo" value={form.metodo} onChange={handleChange} className="w-full rounded p-2 bg-[#111827] text-white" required>
            <option value="">Selecciona...</option>
            {metodos && metodos.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Nota</label>
          <input name="nota" type="text" maxLength={60} value={form.nota} onChange={handleChange} className="w-full rounded p-2 bg-[#111827] text-white" />
        </div>
        <button type="submit" disabled={loading} className="bg-[#206DDA] hover:bg-blue-700 text-white font-bold py-2 rounded-xl mt-2 transition disabled:opacity-60">
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
        {msg && <div className="text-green-400 text-center mt-2">{msg}</div>}
      </form>
    </div>
  );
};

export default FormularioMovimiento;
