const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Minutos de inactividad permitidos
const MINUTOS_INACTIVOS = 10;

const cerrarConversacionesInactivas = async () => {
  try {
    const desde = new Date(Date.now() - MINUTOS_INACTIVOS * 60 * 1000).toISOString();

    // Buscar usuarios con conversaciones activas pero sin interacción reciente
    const { data: usuariosInactivos, error } = await supabase
      .from('usuarios')
      .select('telefono')
      .lte('ultima_interaccion', desde)
      .eq('estado_conversacion', 'activa');

    if (error) throw error;

    if (usuariosInactivos.length === 0) {
      console.log("✅ No hay usuarios inactivos que cerrar.");
      return;
    }

    const telefonos = usuariosInactivos.map(u => u.telefono);
    console.log("⚠️ Cerrando conversaciones de:", telefonos);

    // Actualizar estado a 'cerrada'
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({ estado_conversacion: 'cerrada' })
      .in('telefono', telefonos);

    if (updateError) throw updateError;

    console.log(`✅ Conversaciones cerradas automáticamente: ${telefonos.length}`);
  } catch (err) {
    console.error("❌ Error al cerrar conversaciones inactivas:", err.message);
  }
};

module.exports = { cerrarConversacionesInactivas };
