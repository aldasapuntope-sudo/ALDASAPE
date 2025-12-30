import { useEffect, useState } from "react";
import axios from "axios";
import "../css/chatbox.css";
import config from "../config";

export default function ChatBox() {
  const session_id =
    localStorage.getItem("chat_session") ||
    (() => {
      const id = Date.now().toString();
      localStorage.setItem("chat_session", id);
      return id;
    })();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔄 Cargar historial
  useEffect(() => {
    
    axios
      .get(`${config.apiUrl}api/chat/listar/${session_id}`)
      .then((res) => {
        setMessages(res.data);
      })
      .catch(() => {});
  }, []);

  const convertirLinks = (texto) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return texto.split(urlRegex).map((parte, index) => {
        if (parte.match(urlRegex)) {
        return (
            <a
            key={index}
            href={parte}
            target="_blank"
            rel="noopener noreferrer"
            className="chat-link"
            >
            {parte}
            </a>
        );
        }
        return parte;
    });
    };


  // 📤 Enviar mensaje
  const enviar = async () => {
    if (!text.trim() || loading) return;

    const mensajeUsuario = {
      mensaje: text,
      emisor: "user",
    };

    setMessages((prev) => [...prev, mensajeUsuario]);
    setText("");
    setLoading(true);

    try {
      const res = await axios.post(`${config.apiUrl}api/chat/enviar`, {
        session_id,
        mensaje: text,
      });

      setMessages((prev) => [
        ...prev,
        {
          mensaje: res.data.respuesta,
          emisor: "bot",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          mensaje: "Ocurrió un error, intenta nuevamente 😕",
          emisor: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbox">
      <div className="chat-header">🤖 Asistente Virtual</div>

      <div className="chat-body">

        {/* 🟢 BIENVENIDA */}
        {messages.length === 0 && !loading && (
            <div className="chat-welcome">
            <img
                src="/assets/images/logo-aldasape-color.png"
                alt="Aldasa"
                className="chat-logo"
            />
            <h5>👋 Bienvenido al chatbox de aldasa.pe</h5>
            <p>Escríbenos y uno de nuestros asistentes te ayudará.</p>
            </div>
        )}

        {/* 💬 MENSAJES */}
        {messages.map((m, i) => (
            <div key={i} className={`msg ${m.emisor}`}>
            {convertirLinks(m.mensaje)}
            </div>
        ))}

        {/* ⏳ ESCRIBIENDO */}
        {loading && (
            <div className="msg bot">Escribiendo...</div>
        )}

      </div>


      <div className="chat-footer">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tu mensaje..."
          onKeyDown={(e) => e.key === "Enter" && enviar()}
        />
        <button onClick={enviar}>Enviar</button>
      </div>
    </div>
  );
}
