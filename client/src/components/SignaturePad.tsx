import { useCallback, useEffect, useRef, useState } from 'react';
import { STORAGE_KEYS } from '../data';

interface SignaturePadProps {
  onSignatureChange: (dataUrl: string | null) => void;
}

export default function SignaturePad({ onSignatureChange }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const loadSaved = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.signature);
    if (saved) {
      setPreview(saved);
      setHasSaved(true);
      onSignatureChange(saved);
    }
  }, [onSignatureChange]);

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1e2a25';
  }, [preview]);

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const t = e.touches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    drawing.current = true;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function endDraw() {
    drawing.current = false;
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function saveSignature() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blank = document.createElement('canvas');
    blank.width = canvas.width;
    blank.height = canvas.height;
    if (canvas.toDataURL() === blank.toDataURL()) {
      alert('Please draw your signature before saving.');
      return;
    }
    const dataUrl = canvas.toDataURL('image/png');
    localStorage.setItem(STORAGE_KEYS.signature, dataUrl);
    setPreview(dataUrl);
    setHasSaved(true);
    onSignatureChange(dataUrl);
  }

  function replaceSignature() {
    setPreview(null);
    setHasSaved(false);
    onSignatureChange(null);
  }

  function clearStored() {
    localStorage.removeItem(STORAGE_KEYS.signature);
    setPreview(null);
    setHasSaved(false);
    onSignatureChange(null);
    clearCanvas();
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG or JPG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      localStorage.setItem(STORAGE_KEYS.signature, dataUrl);
      setPreview(dataUrl);
      setHasSaved(true);
      onSignatureChange(dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  return (
    <section className="panel signature-panel">
      <div className="panel-head">
        <h2>Your signature</h2>
        <p>
          Draw or upload once — saved in this browser until you clear site data.
        </p>
      </div>

      {hasSaved && preview ? (
        <div className="signature-saved">
          <img src={preview} alt="Saved signature" className="signature-preview" />
          <div className="btn-row">
            <button type="button" className="btn btn-ghost" onClick={replaceSignature}>
              Draw new
            </button>
            <label className="btn btn-ghost file-label">
              Upload image
              <input type="file" accept="image/*" onChange={handleUpload} hidden />
            </label>
            <button type="button" className="btn btn-danger-ghost" onClick={clearStored}>
              Clear saved
            </button>
          </div>
        </div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            className="signature-canvas"
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
          <div className="btn-row">
            <button type="button" className="btn btn-ghost" onClick={clearCanvas}>
              Clear pad
            </button>
            <label className="btn btn-ghost file-label">
              Upload image
              <input type="file" accept="image/*" onChange={handleUpload} hidden />
            </label>
            <button type="button" className="btn btn-primary" onClick={saveSignature}>
              Save signature
            </button>
          </div>
        </>
      )}
    </section>
  );
}
