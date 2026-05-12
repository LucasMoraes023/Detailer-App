import { useRef, useState } from "react";

export default function Camera() {
  const fileInput = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const openCamera = () => {
    fileInput.current.click();
  };

  const clearPhoto = () => {
    setSelectedFile(null);
    setPreview(null);
    fileInput.current.value = '';
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
    preview: {
      maxWidth: '100%',
      maxHeight: '200px',
      borderRadius: '8px',
      margin: '10px 0',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
    },
    fileInfo: {
      color: '#cccccc',
      fontSize: '12px',
      marginTop: '10px',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.container}>
      <h4 style={styles.title}>📸 Fotos do Carro</h4>

      {!preview ? (
        <div>
          <button style={styles.button} onClick={openCamera}>
            📷 Tirar Foto
          </button>
          <p style={{color: '#cccccc', fontSize: '14px', textAlign: 'center', margin: '10px 0'}}>
            Capture imagens do veículo para documentação
          </p>
        </div>
      ) : (
        <div>
          <img src={preview} alt="Preview" style={styles.preview} />
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
            <button style={{...styles.button, ...styles.buttonSecondary}} onClick={clearPhoto}>
              ❌ Remover
            </button>
            <button style={styles.button} onClick={openCamera}>
              🔄 Nova Foto
            </button>
          </div>
          {selectedFile && (
            <p style={styles.fileInfo}>
              📁 {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>
      )}

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        style={{display: 'none'}}
      />
    </div>
  );
}
