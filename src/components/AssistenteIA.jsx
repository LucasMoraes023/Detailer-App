import { useState } from "react";
import { config } from "../config.js";

export default function AssistenteIA() {
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [loading, setLoading] = useState(false);
  const [historico, setHistorico] = useState([]);

  async function perguntarIA() {
    if (!pergunta.trim()) {
      setResposta("Por favor, digite uma pergunta!");
      return;
    }

    const apiKey = config.huggingface.apiKey;

    if (!apiKey) {
      setResposta("API Key do Hugging Face não configurada. Configure VITE_HUGGINGFACE_API_KEY no .env.local");
      return;
    }

    setLoading(true);
    setResposta("");

    try {
      const req = await fetch(
        "https://api-inference.huggingface.co/models/google/flan-t5-base",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            inputs: pergunta,
            parameters: {
              max_length: 100,
              temperature: 0.7
            }
          })
        }
      );

      if (!req.ok) {
        throw new Error(`Erro na API: ${req.status}`);
      }

      const data = await req.json();

      const respostaTexto = data[0]?.generated_text || "Não foi possível gerar uma resposta.";

      setResposta(respostaTexto);

      // Adicionar ao histórico
      setHistorico(prev => [...prev.slice(-4), {
        pergunta: pergunta,
        resposta: respostaTexto,
        timestamp: new Date().toLocaleTimeString()
      }]);

      setPergunta("");

    } catch (error) {
      console.error("Erro:", error);
      setResposta(`Erro ao consultar IA: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  const limparHistorico = () => {
    setHistorico([]);
    setResposta("");
  };

  const styles = {
    container: {
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '10px',
      padding: '20px',
      margin: '10px 0',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    title: {
      color: '#ff6b35',
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '15px',
      textAlign: 'center'
    },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: 'none',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      fontSize: '14px',
      marginBottom: '10px',
      outline: 'none'
    },
    button: {
      background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
      color: 'white',
      border: 'none',
      padding: '12px 20px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
      margin: '5px',
      boxShadow: '0 2px 10px rgba(255, 107, 53, 0.3)'
    },
    buttonSecondary: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.3)'
    },
    resposta: {
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      padding: '15px',
      marginTop: '15px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      minHeight: '60px'
    },
    historico: {
      marginTop: '20px',
      maxHeight: '200px',
      overflowY: 'auto'
    },
    historicoItem: {
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '6px',
      padding: '10px',
      margin: '5px 0',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    },
    loading: {
      opacity: 0.7,
      pointerEvents: 'none'
    }
  };

  return (
    <div style={styles.container}>
      <h4 style={styles.title}>🤖 Assistente IA</h4>

      <textarea
        style={styles.input}
        value={pergunta}
        onChange={(e) => setPergunta(e.target.value)}
        placeholder="Pergunte sobre cuidados automotivos, dicas de manutenção, etc..."
        rows="3"
      />

      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <button
          style={{...styles.button, ...(loading ? styles.loading : {})}}
          onClick={perguntarIA}
          disabled={loading}
        >
          {loading ? '🔄 Pensando...' : '💬 Perguntar'}
        </button>

        {historico.length > 0 && (
          <button
            style={{...styles.button, ...styles.buttonSecondary}}
            onClick={limparHistorico}
          >
            🗑️ Limpar
          </button>
        )}
      </div>

      {resposta && (
        <div style={styles.resposta}>
          <strong style={{color: '#ff6b35'}}>Resposta:</strong><br />
          {resposta}
        </div>
      )}

      {historico.length > 0 && (
        <div style={styles.historico}>
          <h5 style={{color: '#ff6b35', marginBottom: '10px'}}>📚 Histórico</h5>
          {historico.map((item, index) => (
            <div key={index} style={styles.historicoItem}>
              <small style={{color: '#cccccc'}}>{item.timestamp}</small><br />
              <strong>P: </strong>{item.pergunta}<br />
              <strong>R: </strong>{item.resposta.substring(0, 100)}...
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
