
//const axios = require('axios');

const WHATSAPP_NUMBER_ID = process.env.WHATSAPP_NUMBER_ID;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const CONSULTOR_WHATSAPP = '593998260550';

// Enviar mensaje simple de texto
const enviarMensajeWhatsApp = async (telefono, mensaje) => {
  try {
    const url = `https://graph.facebook.com/v18.0/${WHATSAPP_NUMBER_ID}/messages`;
    const headers = {
      Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    };

    const body = {
      messaging_product: 'whatsapp',
      to: telefono,
      type: 'text',
      text: { body: mensaje }
    };

    await axios.post(url, body, { headers });
  } catch (error) {
    console.error('❌ Error enviando mensaje a WhatsApp:', error.response?.data || error.message);
  }
};

// Menú principal interactivo
async function enviarMenuPrincipal(telefono) {
  const axios = require('axios');
  const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_NUMBER_ID}/messages`;
  const headers = {
    Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  };

  const body = {
    messaging_product: 'whatsapp',
    to: telefono,
    type: 'interactive',
    interactive: {
      type: 'list',
      header: { type: 'text', text: 'Bienvenido al Menú Principal' },
      body: { text: 'Selecciona una opción' },
      action: {
        button: 'Ver opciones',
        sections: [
          {
            title: 'Servicios GPTRobotic',
            rows: [
              {
                id: 'op_1',
                title: '🤖Diseño de Chat Bot',
                description: 'Automatiza tu negocio'
              },
              {
                id: 'op_2',
                title: '👽Diseño de Voice Bot',
                description: 'Contestamos para ti'
              },
               {
                id: 'op_3',
                title: '🎨Diseño de Páginas Web',
                description: 'Los mejores diseños en tiempo record'
              },
                {
                id: 'op_4',
                title: '🛍️Marketing Digital',
                description: 'No gastes mucho dinero en RRSS'
              },
                             {
                id: 'op_5',
                title: '🏦Entidades Financieras',
                description: 'Automatizamos tu atencion'
              }
            

            ]
          }
        ]
      }
    }
  };

  try {
    await axios.post(url, body, { headers });
    console.log('✅ Menú principal enviado');
  } catch (err) {
    console.error('❌ Error al enviar menú interactivo:', err.response?.data || err.message);
  }
}

// Menú específico para asesoría
async function enviarMenuAsesoriaUniversitaria(telefono) {
  const axios = require('axios');
  const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_NUMBER_ID}/messages`;
  const headers = {
    Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  };

  const body = {
    messaging_product: 'whatsapp',
    to: telefono,
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: 'Conoce Nuestros PLanes:' },
      action: {
        button: 'Ver planes',
        sections: [
          {
            title: 'Planes disponibles',
            rows: [
              { id: '1A', title: '📘 Business Starter', description: 'Informativas y Autorespuestas' },
              { id: '1B', title: '📗 Business Standard', description: 'Asistente + CRM' },
              { id: '1C', title: '📙 Business Plus', description: 'Asistente + CRM + Transaccional' },
              { id: '1D', title: '📕 Enterprise', description: 'Cuentas tu necesidad' }
            ]
          }
        ]
      }
    }
  };

  try {
    await axios.post(url, body, { headers });
    console.log('✅ Menú de asesoría enviado');
  } catch (err) {
    console.error('❌ Error al enviar menú asesoría:', err.response?.data || err.message);
  }
}


// Menú específico para Ingles
async function enviarMenuAsesoriaIngles(telefono) {
  const axios = require('axios');
  const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_NUMBER_ID}/messages`;
  const headers = {
    Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  };

  const body = {
    messaging_product: 'whatsapp',
    to: telefono,
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: 'Selecciona un nivel:' },
      action: {
        button: 'Ver planes',
        sections: [
          {
            title: 'Selecciona',
            rows: [
              { id: 'VoiceBot', title: '📘 VoiceBot', description: 'Automatiza llamadas telefónicas' }
            
            ]
          }
        ]
      }
    }
  };

  try {
    await axios.post(url, body, { headers });
    console.log('✅ Menú de asesoría enviado');
  } catch (err) {
    console.error('❌ Error al enviar menú asesoría:', err.response?.data || err.message);
  }
}
// Opciones al final de cada respuesta
const axios = require('axios');

const enviarOpcionesFinales = async (telefono) => {
  const url = `https://graph.facebook.com/v18.0/${WHATSAPP_NUMBER_ID}/messages`;
  const headers = {
    Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  };

  const body = {
    messaging_product: "whatsapp",
    to: telefono,
    type: "interactive",
    interactive: {
      type: "list",
      header: {
        type: "text",
        text: "¿Deseas continuar?"
      },
      body: {
        text: "Selecciona una opción:"
      },
      footer: {
        text: "GPTRObotic"
      },
      action: {
        button: "Ver opciones",
        sections: [
          {
            title: "Opciones",
            rows: [
              {
                id: "ir_asesor",
                title: "👨‍🏫 Hablar con asesor",
                description: "Conéctate con un Consultor Comercial"
              },
              {
                id: "ir_menu",
                title: "📋 Ir al menú",
                description: "Menú Principal"
              }
            ]
          }
        ]
      }
    }
  };

  try {
    await axios.post(url, body, { headers });
    console.log("✅ Opciones finales enviadas");
  } catch (error) {
    console.error("❌ Error al enviar opciones finales:", error.response?.data || error.message);
  }
};

async function enviarMenuAsesoriaMatematica(telefono) {
  const axios = require('axios');
  const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_NUMBER_ID}/messages`;
  const headers = {
    Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  };

  const body = {
    messaging_product: 'whatsapp',
    to: telefono,
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: 'Selecciona un plan:' },
      action: {
        button: 'Ver planes',
        sections: [
          {
            title: 'Planes disponibles',
            rows: [
              { id: 'Informativas', title: '🎯 Informativas', description: 'Actualizaciones dinámicas' },
              { id: 'Transaccionales', title: '🎛️ Transaccionales', description: 'Conectamos a tu core' }
              
            ]
          }
        ]
      }
    }
  };

  try {
    await axios.post(url, body, { headers });
    console.log('✅ Menú de asesoría enviado');
  } catch (err) {
    console.error('❌ Error al enviar menú asesoría:', err.response?.data || err.message);
  }
}


async function enviarMenuAsesoriaOMatematica(telefono) {
  const axios = require('axios');
  const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_NUMBER_ID}/messages`;
  const headers = {
    Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  };

  const body = {
    messaging_product: 'whatsapp',
    to: telefono,
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: 'Selecciona un Plan:' },
      action: {
        button: 'Ver planes',
        sections: [
          {
            title: 'Estoy pendiente',
            rows: [
              { id: 'Plan', title: '🖥️ Plan', description: 'Lo hacemos por ti' }
            ]
          }
        ]
      }
    }
  };

  try {
    await axios.post(url, body, { headers });
    console.log('✅ Menú de asesoría enviado');
  } catch (err) {
    console.error('❌ Error al enviar menú asesoría:', err.response?.data || err.message);
  }
}


async function enviarMenuAsesoria5(telefono) {
  const axios = require('axios');
  const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_NUMBER_ID}/messages`;
  const headers = {
    Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  };

  const body = {
    messaging_product: 'whatsapp',
    to: telefono,
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: 'Selecciona' },
      action: {
        button: 'Ver planes',
        sections: [
          {
            title: 'Podemos esto y más',
            rows: [
              { id: 'Plan Total', title: '📦 Plan Total', description: 'Adaptado a tu medida' }
            ]
          }
        ]
      }
    }
  };

  try {
    await axios.post(url, body, { headers });
    console.log('✅ Menú de asesoría enviado');
  } catch (err) {
    console.error('❌ Error al enviar menú asesoría:', err.response?.data || err.message);
  }
}

module.exports = {
  enviarMensajeWhatsApp,
  enviarMenuPrincipal,
  enviarMenuAsesoriaUniversitaria,
  enviarOpcionesFinales, // ✅ asegúrate de que esto exista aquí
  enviarMenuAsesoriaIngles,
  enviarMenuAsesoriaMatematica,
  enviarMenuAsesoriaOMatematica,
  enviarMenuAsesoria5
};
