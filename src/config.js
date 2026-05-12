// Configurações do aplicativo
export const config = {
  supabase: {
    url: 'https://zmhwbnxnceibmdmntbhh.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptaHdiYXhuY2VpYm1kbW50YmhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4NjQ4MDAsImV4cCI6MjA1MjQ0MDgwMH0.example_key'
  },
  huggingface: {
    apiKey: 'hf_placeholder_key' // Substitua pela sua chave real
  }
};

// Para desenvolvimento local, sobrescrever com variáveis de ambiente se disponíveis
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  if (import.meta.env?.VITE_SUPABASE_URL) {
    config.supabase.url = import.meta.env.VITE_SUPABASE_URL;
  }
  if (import.meta.env?.VITE_SUPABASE_ANON_KEY) {
    config.supabase.anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  }
  if (import.meta.env?.VITE_HUGGINGFACE_API_KEY) {
    config.huggingface.apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
  }
}