const { guardarInteraccion, registrarUsuarioSiNoExiste, actualizarUltimaIntencion, obtenerUltimaIntencion } = require('../utils/database');

const { enviarMensajeWhatsApp } = require('../utils/whatsappApi');

const controlarEstadoConversacion = async (telefono, origenBot = 'gptrobotic') => {
  try {
    const datos = await obtenerUltimaIntencion(telefono);
    const estado = datos?.estado_conversacion || 'activa';

    if (estado === 'cerrada') {
      await enviarMensajeWhatsApp(telefono, 
        "👋 *Hola de nuevo!* Detectamos que tu conversación anterior fue finalizada.\n\n📲 Puedes escribirnos en cualquier momento y retomaremos justo donde quedamos. Estamos aquí para ayudarte 🤖✨");

      // Reactivar la conversación para permitir flujo nuevo
      await actualizarUltimaIntencion(telefono, null, origenBot, 'activa');
      return true; // indica que la conversación estaba cerrada
    }

    return false; // conversación activa, puede continuar
  } catch (err) {
    console.error("❌ Error en controlarEstadoConversacion:", err.message);
    return false;
  }
};

module.exports = { controlarEstadoConversacion };
