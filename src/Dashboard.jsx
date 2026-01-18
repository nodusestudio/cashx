


import React, { useState, useEffect } from 'react';
import FormularioMovimiento from './FormularioMovimiento';


const METODOS_BANCOS = ['Nequi', 'Bancolombia', 'Bold', 'Aliados'];
const LOCAL_KEY = 'cashx_movimientos';
const CONFIG_KEY = 'cashx_config';

const getToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};


const Dashboard = () => {
  const [movimientos, setMovimientos] = useState(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [confirmCierre, setConfirmCierre] = useState(false);
  const [showResumen, setShowResumen] = useState(false);
  const [resumen, setResumen] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saldoInicial, setSaldoInicial] = useState(() => {
    const config = localStorage.getItem(CONFIG_KEY);
    if (config) {
      const parsed = JSON.parse(config);
      return parsed.saldoInicial || 0;
    }
    return 0;
  });
  // No usar setShowSaldoModal, calcularlo dinámicamente

  // Cargar movimientos y saldoInicial de localStorage al iniciar

  // Mostrar modal si no hay saldo inicial
  const showSaldoModal = saldoInicial === 0;

  // Guardar movimientos en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(movimientos));
  }, [movimientos]);



  // Cálculos de tarjetas
  const disponibleEfectivo = saldoInicial + movimientos
    .filter(m => m.metodo === 'Efectivo')
    .reduce((acc, m) => acc + (m.tipo === 'Ingreso' ? m.monto : -m.monto), 0);

  const saldoBancos = movimientos
    .filter(m => METODOS_BANCOS.includes(m.metodo))
    .reduce((acc, m) => acc + (m.tipo === 'Ingreso' ? m.monto : -m.monto), 0);

  const hoy = getToday();
  const gastosDia = movimientos
    .filter(m => m.tipo === 'Egreso' && m.fecha && new Date(m.fecha).toDateString() === hoy.toDateString())
    .reduce((acc, m) => acc + m.monto, 0);

  const utilidadNeta = saldoInicial + movimientos
    .reduce((acc, m) => acc + (m.tipo === 'Ingreso' ? m.monto : -m.monto), 0);


  const handleCierreTurno = () => {
    if (!window.confirm('¿Seguro que deseas cerrar el turno?')) return;
    setResumen({
      fecha: new Date().toLocaleDateString(),
      disponibleEfectivo,
      saldoBancos,
      gastosDia,
      utilidadNeta,
    });
    setShowResumen(true);
  };

  const handleConfirmCierre = () => {
    setConfirmCierre(true);
    // Simula guardar el cierre (solo visual)
    if (window.confirm('¿Deseas limpiar el Dashboard para el siguiente turno?')) {
      setMovimientos([]);
      alert('Dashboard listo para el siguiente turno.');
    } else {
      alert('Cierre de turno registrado y saldos mantenidos.');
    }
    setShowResumen(false);
    setResumen(null);
    setConfirmCierre(false);
  };



  return (
    <div className="w-full relative">
      {/* Botón flotante/cabecera */}
      <div className="flex justify-end mb-2">
        <button
          className="bg-[#206DDA] hover:bg-blue-700 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center text-3xl shadow-lg focus:outline-none"
          title="Registrar Movimiento"
          onClick={() => setShowModal(true)}
        >
          +
        </button>
      </div>
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1F2937] rounded-xl p-5 flex flex-col">
          <span className="text-gray-400 text-xs mb-1">Disponible Efectivo</span>
          <span className="text-2xl font-bold text-white">${disponibleEfectivo.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
        </div>
        <div className="bg-[#1F2937] rounded-xl p-5 flex flex-col">
          <span className="text-gray-400 text-xs mb-1">Saldo Bancos</span>
          <span className="text-2xl font-bold text-white">${saldoBancos.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
        </div>
        <div className="bg-[#1F2937] rounded-xl p-5 flex flex-col">
          <span className="text-gray-400 text-xs mb-1">Gastos del Día</span>
          <span className="text-2xl font-bold text-white">${gastosDia.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
        </div>
        <div className="bg-[#1F2937] rounded-xl p-5 flex flex-col">
          <span className="text-gray-400 text-xs mb-1">Utilidad Neta</span>
          <span className="text-2xl font-bold text-white">${utilidadNeta.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
        </div>
      </div>
      {/* Tabla de movimientos recientes */}
      <div className="bg-[#1F2937] rounded-xl p-4 mb-6">
        <div className="font-semibold text-white mb-2">Movimientos recientes</div>
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-gray-400">
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Método</th>
              <th>Monto</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map(m => (
              <tr key={m.id} className="text-white border-b border-gray-700 last:border-0">
                <td>{m.fecha ? new Date(m.fecha).toLocaleDateString() : ''}</td>
                <td>{m.tipo}</td>
                <td>{m.metodo}</td>
                <td>{m.monto.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
                <td>{m.detalle || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Botón de cierre de turno */}
      <button
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition disabled:opacity-60"
        onClick={handleCierreTurno}
        disabled={confirmCierre}
      >
        Cerrar Turno
      </button>
      {/* Modal resumen de cierre */}
      {showResumen && resumen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-[#1F2937] rounded-xl p-8 w-full max-w-md shadow-xl flex flex-col gap-4 text-white">
            <h3 className="text-xl font-bold mb-2">Resumen de Cierre de Turno</h3>
            <div className="mb-2">Fecha: <span className="font-bold">{resumen.fecha}</span></div>
            <div className="mb-2">Total Efectivo: <span className="font-bold text-green-400">{resumen.disponibleEfectivo.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</span></div>
            <div className="mb-2">Total Bancos: <span className="font-bold text-blue-400">{resumen.saldoBancos.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</span></div>
            <div className="mb-2">Total Gastos: <span className="font-bold text-red-400">{resumen.gastosDia.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</span></div>
            <div className="mb-2">Utilidad del Turno: <span className="font-bold text-yellow-400">{resumen.utilidadNeta.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</span></div>
            <button
              className="bg-[#4CAF50] hover:bg-green-700 text-white font-bold py-2 rounded-xl mt-2"
              onClick={() => {
                const msg = `Reporte CashX - FODEXA: Hoy ${resumen.fecha} se cierra con ${resumen.disponibleEfectivo.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })} en efectivo y ${resumen.saldoBancos.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })} en bancos. Utilidad: ${resumen.utilidadNeta.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}`;
                window.open(`https://wa.me/573144689509?text=${encodeURIComponent(msg)}`);
              }}
            >
              Enviar Reporte a Johan
            </button>
            <div className="flex gap-2 mt-4">
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl"
                onClick={handleConfirmCierre}
                disabled={confirmCierre}
              >
                Confirmar y Guardar Cierre
              </button>
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-xl"
                onClick={() => { setShowResumen(false); setResumen(null); }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de formulario */}
      {showModal && (
        <FormularioMovimiento 
          onClose={() => setShowModal(false)} 
          onAddMovimiento={mov => {
            setMovimientos(prev => [mov, ...prev]);
            setShowModal(false);
          }}
        />
      )}

      {/* Modal para pedir saldo inicial si no existe */}
      {showSaldoModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <form
            onSubmit={e => {
              e.preventDefault();
              const val = Number(e.target.saldo.value);
              if (!isNaN(val)) {
                setSaldoInicial(val);
                // Guardar en config
                const config = localStorage.getItem(CONFIG_KEY);
                let parsed = config ? JSON.parse(config) : {};
                parsed.saldoInicial = val;
                localStorage.setItem(CONFIG_KEY, JSON.stringify(parsed));
                // showSaldoModal ahora es derivado, no se usa setShowSaldoModal
              }
            }}
            className="bg-[#1F2937] rounded-xl p-8 w-full max-w-md shadow-xl flex flex-col gap-4"
          >
            <h3 className="text-lg font-bold text-white">Saldo Inicial de Caja</h3>
            <input name="saldo" type="number" min="0" className="w-full rounded p-2 bg-[#111827] text-white" placeholder="Saldo inicial" required />
            <button type="submit" className="bg-[#206DDA] hover:bg-blue-700 text-white font-bold py-2 rounded-xl mt-2">Guardar</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
