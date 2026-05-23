import { useState, useRef } from "react";
import CareCard from "./components/CareCard";
import { analyzeImage } from "./api/analyze";
import type { CareResult } from "./types/CareResult";
import { heicTo, isHeic } from "heic-to";

export default function App() {
  // State = data that belongs to component. Component re-renders when data changes.
  const [result, setResult] = useState<CareResult | null>(null); // Claude API response
  const [loading, setLoading] = useState(false); // API loading
  const [error, setError] = useState<string | null>(null); // error msg
  const [preview, setPreview] = useState<string | null>(null); // image preview URL
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    // setPreview(URL.createObjectURL(file));
    setLoading(true); // "Analyzing..."
    setError(null);
    setResult(null);

    try {
      let previewBlob: Blob = file;
      const heicFile = await isHeic(file);

      if (heicFile) {
        previewBlob = await heicTo({
            blob: file,
            type: "image/jpeg",
            quality: 0.8,
        });
      }

      setPreview(URL.createObjectURL(previewBlob));
      const data = await analyzeImage(file); // send og file to backend
      setResult(data);
    } catch {
      setError("Failed to analyze image. Try a clearer photo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "FAF7F2" }}>
        <nav style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 32px",
            borderBottom: "0.5px solid #E8E2D9",
            background: "#FAF7F2",
        }}>
            <div style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "20px",
                color: "#2C2420",
                letterSpacing: "-0.3px",
            }}>
                Rinse And Repeat<span style={{ color: "#8B6F5E", fontStyle: "italic "}}></span>
            </div>
            <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                <a href="#" style={{ fontSize: "13px", color: "#7A6E65", textDecoration: "none" }}>
                    How it works
                </a>
                <a href="#" style={{ fontSize: "13px", color: "#7A6E65", textDecoration: "none" }}>
                    My garments
                </a>
            </div>
        </nav>

        <div style={{ maxWidth: "560px", margin: "0 auto", padding: "64px 24px 80px" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#F0EAE2",
                    color: "#8B6F5E",
                    fontSize: "12px",
                    padding: "4px 12px",
                    borderRadius: "100px",
                    marginBottom: "24px",
                }}>
                    <span style={{ width: "6px", height: "6px", background: "#C4956A", borderRadius: "50%", display: "inline-block" }} />
                </div>

                <h1 style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "40px",
                    lineHeight: 1.15,
                    color: "#2C2420",
                    marginBottom: "16px",
                    letterSpacing: "-0.5px",
                }}>
                    Never ruin a piece of<br />
                    <em style={{ color: "#8B6F5E" }}>clothing again</em>
                </h1>

                <p style={{
                    fontSize: "16px",
                    color: "#7A6E65",
                    lineHeight: 1.6,
                    fontWeight: 300,
                    maxWidth: "380px",
                    margin: "0 auto",
                }}>
                    Photograph any clothing label and get instant care instructions.
                </p>
            </div>

            <input 
                ref={fileRef}
                type="file"
                accept="image/jpeg, image/png, image/webp, image/heic, image/heif"
                capture="environment"
                style={{ display: "none" }}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                }}
            />

            <div
                onClick={() => fileRef.current?.click()}
                style={{
                    background: "FFFFFF",
                    border: "1.5px dashe #D4C9BC",
                    borderRadius: "20px",
                    padding: "48px 32px",
                    textAlign: "center",
                    cursor: loading ? "not-allowed" : "pointer",
                    marginBottom: "12px",
                    transition: "border-color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#8B6F5E")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#D4C9BC")}
            >
                {preview ? (
                    <img
                        src={preview}
                        alt="preview"
                        style={{
                            maxWidth: "200px",
                            maxHeight: "200px",
                            borderRadius: "12px",
                            objectFit: "cover",
                        }}
                    />
                ) : (
                    <>
                        <div style={{
                            width: "52px",
                            height: "52px",
                            background: "#F0EAE2",
                            borderRadius: "14px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 16px",
                            fontSize: "24px",
                        }}>
                            📷
                        </div>
                        <p style={{ fontSize: "15px", fontWeight: 500, color: "#2C2420", marginBottom: "6px" }}>
                            {loading ? "Analyzing..." : "Drop your photo here"}
                        </p>
                        <p style={{ fontSize: "13px", color: "#A89E94" }}>
                            or tap to take a photo of the care label
                        </p>
                    </>
                )}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
            {["JPEG", "PNG", "WebP", "HEIC"].map(fmt => (
                <span key={fmt} style={{
                    fontSize: "11px",
                    background: "#F0EAE2",
                    color: "8B6F5E",
                    padding: "3px 10px",
                    borderRadius: "100px",
                }}>
                    {fmt}
                </span>
            ))}
        </div>

        <button
            onClick={() => fileRef.current?.click()}
            disabled={loading}
            style={{
                width: "100%",
                background: loading ? "#A89E94" : "#2C2420",
                color: "#FAF7F2",
                border: "none",
                padding: "14px",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "background 0.2s",
            }}
        >
            {loading ? "Analyzing your label..." : "📁 Upload from camera roll"}
        </button>

        {error && (
            <p style={{
                color: "#993C1D",
                fontSize: "14px",
                textAlign: "center",
                marginTop: "16px",
                background: "#FAECE7",
                padding: "12px 16px",
                borderRadius: "10px",
            }}>
                {error}
            </p>
        )}

        {result && <CareCard result={result} />}

        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            marginTop: "48px",
            paddingTop: "32px",
            borderTop: "0.5px solid #E8E2D9",
            textAlign: "center",
        }}>
            {[
                { icon: "🏷️", title: "Any label format", desc: "Symbols, text, foreign languages" },
                { icon: "📱", title: "iPhone photos", desc: "HEIC format supported natively" },
                { icon: "⚡️", title: "Under 3 seconds", desc: "Powered by Claude AI" },
            ].map(f => (
                <div key={f.title}>
                    <div style={{ fontSize: "20px", marginBottom: "8px" }}>{f.icon}</div>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "#2C2420", marginBottom: "4px" }}>{f.title}</p>
                    <p style={{ fontSize: "12px", color: "#A89E94", lineHeight: 1.5 }}>{f.desc}</p>
                </div>
            ))}
        </div>

        <p style={{ fontSize: "12px", color: "#A89E94", textAlign: "center", marginTop: "24px" }}>
            Your photos are never stored. Analysis happens in real time.
        </p>
        </div>
    </div>
  );
}