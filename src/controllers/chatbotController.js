// src/controllers/chatbotController.js

const axios = require('axios');
const { guardarInteraccion, registrarUsuarioSiNoExiste, actualizarUltimaIntencion, obtenerUltimaIntencion,guardarMensajeCentral, verificarEstadoConversacion } = require('../utils/database'); // ✅ CORRECTO
const { enviarMensajeWhatsApp,enviarMenuAsesoriaUniversitaria, enviarMenuPrincipal, enviarOpcionesFinales, enviarMenuAsesoriaIngles, enviarMenuAsesoriaMatematica, enviarMenuAsesoriaOMatematica,enviarMenuAsesoria5 } = require('../utils/whatsappApi');
const { consultarChatGPT } = require('../utils/openai');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const CONSULTOR_WHATSAPP = '593998260550';

const validateWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token && mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook validado correctamente.');
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
};

// 👇 Esta función reemplaza directamente la llamada a consultarChatGPT
const obtenerRespuestaDelBot = async (mensajeUsuario, origenBot) => {
  try {
    // Puedes personalizar respuestas por bot si quieres
    const respuesta = await consultarChatGPT(mensajeUsuario);
    return respuesta;
  } catch (error) {
    console.error('❌ Error en obtenerRespuestaDelBot:', error);
    return "Lo siento, hubo un problema procesando tu solicitud. Por favor intenta nuevamente.";
  }
};


const procesarMensajeEntrante = async ({ telefono, mensajeUsuario, numeroAsociado, origenBot }) => {
  try {
    // 1. Verificar si el bot está activo
    const estado = await verificarEstadoConversacion(telefono, numeroAsociado);
    if (estado === 'manual') {
      console.log(`🛑 Bot ${origenBot} desactivado para ${telefono}`);
      return; // No responde el bot
    }

    // 2. Generar respuesta (GPT o lógica interna)
    const respuestaBot = await obtenerRespuestaDelBot(mensajeUsuario, origenBot); // tu lógica IA

    // 3. Enviar la respuesta al usuario (tu función actual de envío)
    await enviarRespuestaWhatsApp(telefono, respuestaBot);

    // 4. Guardar en Supabase centralizada
    await guardarMensajeCentral(telefono, numeroAsociado, mensajeUsuario, respuestaBot, origenBot);

  } catch (error) {
    console.error('❌ Error procesando mensaje:', error);
  }
};
// 🧠 Cache temporal de mensajes ya procesados
const mensajesProcesados = new Set();

const handleWebhook = async (req, res) => {
  try {
    console.log("➡️ Mensaje recibido del Webhook:", JSON.stringify(req.body, null, 2));

    const body = req.body;
    if (!body.object) return res.sendStatus(400);

    const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    const telefonoUsuario = message?.from || 'desconocido';

  await registrarUsuarioSiNoExiste(telefonoUsuario, 'gptrobotic');

const datosUsuario = await obtenerUltimaIntencion(telefonoUsuario);
const estado = datosUsuario?.estado_conversacion || 'activa';

    const userMessage = message?.text?.body?.trim() || "";
    let respuestaBot = "";

    // Registrar usuario si no existe
    await registrarUsuarioSiNoExiste(telefonoUsuario);
if (estado === 'cerrada') {
  await enviarMensajeWhatsApp(telefonoUsuario, "👋 ¡Hola de nuevo! Estoy aquí si deseas continuar. Solo escribe tu consulta y retomamos la conversación cuando gustes.");
  await actualizarUltimaIntencion(telefonoUsuario, null, 'gptrobotic', 'activa');
  return res.sendStatus(200);
}
const { controlarEstadoConversacion } = require('./controlarEstadoConversacion');
const cerrada = await controlarEstadoConversacion(telefonoUsuario, 'gptrobotic');
if (cerrada) return res.sendStatus(200);

    // Procesar interacciones tipo lista
    if (message?.type === 'interactive' && message?.interactive?.type === 'list_reply') {
      const seleccionId = message.interactive.list_reply.id;
      const seleccionTitulo = message.interactive.list_reply.title;

      if (seleccionId === 'op_1') {
        respuestaBot = `🤖Colocamos un ChatBot para cualquier negocio con un CRM 100% administrable, 100% SAS, en 7 días pon tu negocio a producir .`;
      await guardarMensajeCentral(
    telefonoUsuario,
    'gptrobotic', // número asociado al bot
    seleccionTitulo || seleccionId, // lo que el usuario tocó
    respuestaBot,
    'gptrobotic'
  );
await actualizarUltimaIntencion(telefonoUsuario, 'saludo', 'gptrobotic'); // también importante

        await enviarMensajeWhatsApp(telefonoUsuario, respuestaBot);
        setTimeout(() => enviarMenuAsesoriaUniversitaria(telefonoUsuario), 500);
        return res.sendStatus(200);
      }

      if (['1A', '1B', '1C', '1D'].includes(seleccionId)) {
        await manejarSubopcionAsesoria(telefonoUsuario, seleccionId);
        return res.sendStatus(200);
      }

      if (seleccionId === 'op_2') {
        respuestaBot = `👽Creamos un asistente de voz personalizado segun tu giro de negocio`;
  await guardarMensajeCentral(
    telefonoUsuario,
    'gptrobotic', // número asociado al bot
    seleccionTitulo || seleccionId, // lo que el usuario tocó
    respuestaBot,
    'gptrobotic'
  );
await actualizarUltimaIntencion(telefonoUsuario, 'saludo', 'gptrobotic'); // también importante

        await enviarMensajeWhatsApp(telefonoUsuario, respuestaBot);
        setTimeout(() => enviarMenuAsesoriaIngles(telefonoUsuario), 500);
        return res.sendStatus(200);
      }

      if (['Asistente de voz'].includes(seleccionId)) {
        await manejarSubopcionIngles(telefonoUsuario, seleccionId);
        return res.sendStatus(200);
      }

      if (seleccionId === 'op_3') {
        respuestaBot = `🎨 Diseño Web Profesional, Ágil y Enfocado en Conversión`;
 await guardarMensajeCentral(
    telefonoUsuario,
    'gptrobotic', // número asociado al bot
    seleccionTitulo || seleccionId, // lo que el usuario tocó
    respuestaBot,
    'gptrobotic'
  );
await actualizarUltimaIntencion(telefonoUsuario, 'saludo', 'gptrobotic'); // también importante

        await enviarMensajeWhatsApp(telefonoUsuario, respuestaBot);
        setTimeout(() => enviarMenuAsesoriaMatematica(telefonoUsuario), 500);
        return res.sendStatus(200);
      }

      if (['Informativas','Transaccionales'].includes(seleccionId)) {
        await manejarSubopcionMatematica(telefonoUsuario, seleccionId);
        return res.sendStatus(200);
      }

      if (seleccionId === 'op_4') {
        respuestaBot = `🛍️ Marketing Digital Estratégico y Automatizado para Crecer sin Pausa`;
 await guardarMensajeCentral(
    telefonoUsuario,
    'gptrobotic', // número asociado al bot
    seleccionTitulo || seleccionId, // lo que el usuario tocó
    respuestaBot,
    'gptrobotic'
  );
await actualizarUltimaIntencion(telefonoUsuario, 'saludo', 'gptrobotic'); // también importante

        await enviarMensajeWhatsApp(telefonoUsuario, respuestaBot);
        setTimeout(() => enviarMenuAsesoriaOMatematica(telefonoUsuario), 500);
        return res.sendStatus(200);
      }

      if (['Plan'].includes(seleccionId)) {
        await manejarSubopcionOMatematica(telefonoUsuario, seleccionId);
        return res.sendStatus(200);
      }

      if (seleccionId === 'ir_asesor') {
        const link = `https://wa.me/${CONSULTOR_WHATSAPP}`;
        await enviarMensajeWhatsApp(telefonoUsuario, `Aquí tienes el contacto de un asesor humano: ${link}`);
        return res.sendStatus(200);
      }

      if (seleccionId === 'ir_menu') {
        await enviarMenuPrincipal(telefonoUsuario);
        return res.sendStatus(200);
      }

       if (seleccionId === 'op_5') {
        respuestaBot = `🏦 Automatización Inteligente para Entidades Financieras`;
 await guardarMensajeCentral(
    telefonoUsuario,
    'gptrobotic', // número asociado al bot
    seleccionTitulo || seleccionId, // lo que el usuario tocó
    respuestaBot,
    'gptrobotic'
  );
await actualizarUltimaIntencion(telefonoUsuario, 'saludo', 'gptrobotic'); // también importante

        await enviarMensajeWhatsApp(telefonoUsuario, respuestaBot);
        setTimeout(() => enviarMenuAsesoria5(telefonoUsuario), 500);
        return res.sendStatus(200);
      }

      if (['Plan Total'].includes(seleccionId)) {
        await manejarSubopcion5(telefonoUsuario, seleccionId);
        return res.sendStatus(200);
      }

      if (seleccionId === 'ir_asesor') {
        const link = `https://wa.me/${CONSULTOR_WHATSAPP}`;
        await enviarMensajeWhatsApp(telefonoUsuario, `Aquí tienes el contacto de un asesor humano: ${link}`);
        return res.sendStatus(200);
      }

      if (seleccionId === 'ir_menu') {
        await enviarMenuPrincipal(telefonoUsuario);
        return res.sendStatus(200);
      }
    }


    // Mensajes de texto comunes
   if (userMessage) {
  const saludos = ['HOLA', 'BUENOS DÍAS', 'BUENAS TARDES', 'BUENAS NOCHES'];
  const mensajeNormalizado = userMessage.trim().toUpperCase();

  // Mostrar aviso de privacidad solo si es saludo
  if (saludos.some(s => userMessage.toUpperCase().includes(s))) {
  if (req.skipSaludo) return res.sendStatus(200); // 👈 Evita repetir saludo si ya fue enviado hace poco

  respuestaBot = `¡Hola! 👋 Soy GPTRobotic Tu Asistente Virtual.\n\n🚀✨ ¿Deseas conocer nuestros productos o prefieres hablar con un Consultor Comercial?`;
await guardarMensajeCentral(telefonoUsuario, 'gptrobotic', seleccionTitulo || seleccionId, respuestaBot, 'gptrobotic');

 await actualizarUltimaIntencion(telefonoUsuario, 'saludo', 'gptrobotic');
  await enviarMensajeWhatsApp(telefonoUsuario, respuestaBot);
  setTimeout(() => enviarOpcionesFinales(telefonoUsuario), 500);
  return res.sendStatus(200);
}


      const mensajesFinales = ['GRACIAS', 'OK', 'DALE', 'ESTÁ BIEN', 'LISTO'];
      
if (mensajesFinales.includes(userMessage.toUpperCase())) {
  respuestaBot = "😊 ¡Gracias por tu mensaje! Si necesitas más ayuda, estaré aquí para cuando lo desees.";
  await guardarMensajeCentral(
    telefonoUsuario,
    'gptrobotic', // número asociado al bot
    seleccionTitulo || seleccionId, // lo que el usuario tocó
    respuestaBot,
    'gptrobotic'
  );

 await enviarMensajeWhatsApp(telefonoUsuario, respuestaBot);
  return res.sendStatus(200);
}

      // Consultar a GPT
 await guardarMensajeCentral(
    telefonoUsuario,
    'gptrobotic', // número asociado al bot
    seleccionTitulo || seleccionId, // lo que el usuario tocó
    respuestaBot,
    'gptrobotic'
  );
setTimeout(() => enviarOpcionesFinales(telefonoUsuario), 500);
return res.sendStatus(200);

    }

    return res.sendStatus(200); // Si no hubo ningún mensaje válido
  } catch (error) {
    console.error('❌ Error general en handleWebhook:', error.message, error.stack);
    return res.sendStatus(500);
  }
};

module.exports = { validateWebhook, handleWebhook };

async function manejarSubopcionAsesoria(telefono, opcionId) {
  const subopciones = {
    '1A': `📘 *Business Starter*
Un plan diseñado para contestar por ti, si eres un local de ventas, y necesitas colocar tu stock aqui,
lo podemos realizar, un servicio 24x7 que siempre atendera para ti, Incluye:
✅ ChatBot 24x7
✅ Tu marca y nombre
💵 Valor: 49,99 USD x Mes + (50 USD POR SETUP, única vez)`,

    '1B': `📗 *Business Standard*
Ideal para, clínicas, consultorios, centros médicos, patios de autos, Tiendas y Locales grandes que deseen no solo 
optimizar su ventas sino capturar a sus clientes, agendar modificar o eliminar citas, toma de información del cliente
autogestión, Inlcuye:
✅ ChatBot 24x7
✅ CRM
✅ Nombre y marca personalizada
💵 Valor: 79,99 USD x Mes + (50 USD POR SETUP, única vez)`,

    '1C': `📙 *Business Plus*
Aprovechemos todo el potencial de la IA, Vendemos por ti, agendamos por ti, gestionamos para ti, cobramos y llevamos tu agenda,
un servicio totalmente inteligente Incluye:
✅ ChatBot 24x7
✅ CRM
✅ Nombre y marca personalizada
💵 Valor: 99,99 USD x Mes + (50 USD POR SETUP, única vez)`,

    '1D': `📕 *Enterprise*
Cúentanos que deseas realizar y lo elaboramos para ti:
✅ Precio a definir segun el alcance`
  };

  const respuesta = subopciones[opcionId];
  if (respuesta) {
  await guardarMensajeCentral(
    telefonoUsuario,
    'gptrobotic', // número asociado al bot
    seleccionTitulo || seleccionId, // lo que el usuario tocó
    respuestaBot,
    'gptrobotic'
  );
  await enviarMensajeWhatsApp(telefono, respuesta);
    setTimeout(async () => {
      await enviarOpcionesFinales(telefono);
    }, 500);
  }
}


async function manejarSubopcionIngles(telefono, opcionId) {
  const subopciones = {
    'Asistente de Voz': `📘 Automatiza llamadas telefónicas con un asistente de voz impulsado por IA. Atiende consultas, 
    verifica identidad, transfiere llamadas o recopila información, sin intervención humana,
    Nuestro VoiceBot es un agente de atención telefónica que conversa en lenguaje natural, responde consultas, 
    guía procesos y se adapta a tu negocio. Utiliza inteligencia artificial, texto a voz realista (TTS) y reconocimiento de voz (ASR):
     💵 planes desde: 49,99 USD X Mes (por Agente)`
    
    
  };

  const respuesta = subopciones[opcionId];
  if (respuesta) {
 await guardarMensajeCentral(
    telefonoUsuario,
    'gptrobotic', // número asociado al bot
    seleccionTitulo || seleccionId, // lo que el usuario tocó
    respuestaBot,
    'gptrobotic'
  );
   await enviarMensajeWhatsApp(telefono, respuesta);
    setTimeout(async () => {
      await enviarOpcionesFinales(telefono);
    }, 500);
  }
}

async function manejarSubopcionMatematica(telefono, opcionId) {
  const subopciones = {
    'Informativas': `Creamos páginas web modernas, responsivas y optimizadas para 
    que tu negocio tenga presencia digital con propósito:
    🎯 Diseño orientado a objetivos (ventas, captación, reservas, etc.)
    📱 Adaptación móvil total (responsive)
    ⚡ Carga rápida y optimización SEO
    🛒 Integraciones con pasarelas de pago, chatbots, CRMs o reservas
    🔐 Sitios seguros con HTTPS y protección de datos
    🛠️ Panel de administración fácil de usar
    🧠 Asistencia en copywriting y estructura de contenido
    💵 Valor desde: 49,99 USD X Mes, 100% SAS`,
    
    'Transaccionales': `Páginas Transaccionales Inteligentes y Seguras, 
    Una página transaccional es mucho más que una web informativa. 
    Es una plataforma en línea que permite a tus clientes realizar acciones concretas, 
    como pagar, agendar, registrar, consultar, comprar o gestionar servicios. Es el núcleo digital de tu operación:
    💳 Pagos en línea con tarjeta, transferencias o pasarelas locales
    📅 Agendamiento automático de citas o reservas
    📦 Consulta de pedidos o servicios
    🧾 Facturación electrónica o descarga de documentos
    🔐 Login y acceso seguro con validación de identidad
    🤖 Integración con chatbots, notificaciones o CRMs
    📊 Paneles administrativos personalizados
    💵 Valor desde: 89,99 USD X Mes, 100% SAS`

   
  };

  const respuesta = subopciones[opcionId];
  if (respuesta) {
   await guardarMensajeCentral(
    telefonoUsuario,
    'gptrobotic', // número asociado al bot
    seleccionTitulo || seleccionId, // lo que el usuario tocó
    respuestaBot,
    'gptrobotic'
  );
  await enviarMensajeWhatsApp(telefono, respuesta);
    setTimeout(async () => {
      await enviarOpcionesFinales(telefono);
    }, 500);
  }
}

async function manejarSubopcionOMatematica(telefono, opcionId) {
  const subopciones = {
    'Plan': `En GPTRobotic diseñamos campañas inteligentes que combinan creatividad, 
    tecnología y datos. No solo publicamos contenido: automatizamos, segmentamos, 
    analizamos y convertimos. Nuestro enfoque está en resultados, no en likes, Incluye:
    📢 Campañas en redes sociales (Meta, Instagram, TikTok, LinkedIn)
    🛒 Publicidad en Google Ads y YouTube
    ✍️ Contenido original para atraer y posicionar
    🎯 Segmentación de públicos y remarketing
    📈 Análisis mensual de resultados
    🧠 Automatización con bots o email marketing
    🌐 Optimización SEO para buscadores
    🔁 Landing pages y funnels de conversión
    🔎 Monitoreo de palabras clave y competencia
    💵 Valor desde: 99,99 USD X Mes`
  };

  const respuesta = subopciones[opcionId];
  if (respuesta) {
  await guardarMensajeCentral(
    telefonoUsuario,
    'gptrobotic', // número asociado al bot
    seleccionTitulo || seleccionId, // lo que el usuario tocó
    respuestaBot,
    'gptrobotic'
  );
   await enviarMensajeWhatsApp(telefono, respuesta);
    setTimeout(async () => {
      await enviarOpcionesFinales(telefono);
    }, 500);
  }
}

async function manejarSubopcion5(telefono, opcionId) {
  const subopciones = {
    'Plan Total': `En GPTRobotic desarrollamos soluciones tecnológicas 
    diseñadas para optimizar procesos operativos, reducir tiempos de atención
     y mejorar la experiencia del cliente financiero. Automatizamos lo repetitivo 
     para que tu equipo se enfoque en lo estratégico., Incluye:
    🤖 Chatbots para atención de clientes 24/7 en WhatsApp y web
    ☎️ VoiceBots para llamadas automáticas y consultas vía teléfono
    🧾 Respuestas automáticas de saldos, estados de cuenta y transacciones
    📄 Generación y envío automático de certificados, reportes o formularios
    🧠 IA para soporte transaccional, consulta de requisitos o simuladores
    🔐 Flujos seguros de validación de identidad (OTP, documento, email)
    💵 Valor a convenir`
  };

  const respuesta = subopciones[opcionId];
  if (respuesta) {
  await guardarMensajeCentral(
    telefonoUsuario,
    'gptrobotic', // número asociado al bot
    seleccionTitulo || seleccionId, // lo que el usuario tocó
    respuestaBot,
    'gptrobotic'
  );
   await enviarMensajeWhatsApp(telefono, respuesta);
    setTimeout(async () => {
      await enviarOpcionesFinales(telefono);
    }, 500);
  }
}

