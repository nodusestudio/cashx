
import React, { useState } from 'react';

const LOCAL_KEY = 'cashx_movimientos';

const Reportes = () => {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [movimientos] = useState(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    return stored ? JSON.parse(stored) : [];
  });


  // Leer movimientos de localStorage y filtrar por fecha

  // Movimientos filtrados por fecha (derivado)
  const movimientosFiltrados = React.useMemo(() => {
    let filtered = movimientos;
    if (desde) {
      const d = new Date(desde);
      filtered = filtered.filter(m => new Date(m.fecha) >= d);
    }
    if (hasta) {
      const h = new Date(hasta);
      filtered = filtered.filter(m => new Date(m.fecha) <= h);
    }
    return filtered.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [movimientos, desde, hasta]);

  // Resúmenes
  const totalIngresos = movimientos.filter(m => m.tipo === 'Ingreso').reduce((acc, m) => acc + (m.monto || 0), 0);
  const totalEgresos = movimientos.filter(m => m.tipo === 'Egreso').reduce((acc, m) => acc + (m.monto || 0), 0);
  const utilidadNeta = totalIngresos - totalEgresos;

  // Exportar/Imprimir
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-8 bg-[#111827] min-h-screen">
      <h2 className="text-white text-2xl font-bold mb-6">Reportes de Movimientos</h2>
      {/* Filtros de fecha */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="text-gray-300 mr-2">Desde</label>
          <input type="date" value={desde} onChange={e => setDesde(e.target.value)} className="bg-[#1F2937] text-white rounded p-2" />
        </div>
        <div>
          <label className="text-gray-300 mr-2">Hasta</label>
          <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} className="bg-[#1F2937] text-white rounded p-2" />
        </div>
        <button onClick={handlePrint} className="bg-[#206DDA] text-white rounded px-4 py-2 font-bold ml-auto">Imprimir Pantalla</button>
      </div>
      {/* Resumen dinámico */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1F2937] rounded-xl p-4 flex flex-col items-center">
          <span className="text-gray-400 text-xs mb-1">Total Ingresos</span>
          <span className="text-lg font-bold text-green-400">${totalIngresos.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
        </div>
        <div className="bg-[#1F2937] rounded-xl p-4 flex flex-col items-center">
          <span className="text-gray-400 text-xs mb-1">Total Egresos</span>
          <span className="text-lg font-bold text-red-400">${totalEgresos.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
        </div>
        <div className="bg-[#1F2937] rounded-xl p-4 flex flex-col items-center">
          <span className="text-gray-400 text-xs mb-1">Utilidad Neta</span>
          <span className="text-lg font-bold text-blue-400">${utilidadNeta.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
        </div>
      </div>
      {/* Tabla avanzada */}
      <div className="bg-[#1F2937] rounded-xl p-4 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-gray-400">
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Categoría</th>
              <th>Método</th>
              <th>Nota</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {movimientosFiltrados.length === 0 ? (
              <tr><td colSpan={6} className="text-white text-center">Sin movimientos en el periodo</td></tr>
            ) : movimientosFiltrados.map(m => (
              <tr key={m.id} className="text-white border-b border-gray-700 last:border-0">
                <td>{m.fecha ? new Date(m.fecha).toLocaleDateString() : ''}</td>
                <td>{m.tipo}</td>
                <td>{m.categoria}</td>
                <td>{m.metodo}</td>
                <td>{m.nota || ''}</td>
                <td className={m.tipo === 'Ingreso' ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                  {m.monto ? m.monto.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reportes;
