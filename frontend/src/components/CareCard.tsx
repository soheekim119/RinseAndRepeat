import type { CareResult } from "../types/CareResult";

interface Props {
    result: CareResult;
}

function formatBool(value: boolean | null, yesText: string, noText: string): { text: string; safe: boolean | null } {
    if (value === null) return { text: "Unknown", safe: null };
    return { text: value ? yesText : noText, safe: value };
}

export default function CareCard({ result }: Props) {
    const dryer = formatBool(result.dryer_safe, "Yes", "No");
    const iron = formatBool(result.iron_safe, "Yes", "No");
    const bleach = formatBool(result.bleach_safe, "Yes", "No");
    const dryClean = formatBool(result.dry_clean_only, "Yes", "No");

    const valueColor = (safe : boolean | null) => {
        if (safe === null) return "#A89E94";
        return safe ? "#3B6D11" : "#854F0B";
    };

    const fields = [
        { label: "Wash temperature", value: result.wash_temperature ?? "Unknown", safe: null },
        { label: "Dryer safe", value: dryer.text, safe: dryer.safe },
        { label: "Iron safe", value: iron.text, safe: iron.safe },
        { label: "Bleach safe", value: bleach.text, safe: bleach.safe },
        { label: "Dry clean only", value: dryClean.text, safe: dryClean.safe === null ? null : !dryClean.safe },
    ];

    return (
        <div style={{
            background: "#FFFFFF",
            borderRadius: "20px",
            border: "0.5px solid #E8E2D9",
            padding: "28px",
            marginTop: "24px",
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
                paddingBottom: "16px",
                borderBottom: "0.5px solid #F0EAE2",
            }}>
                <div style={{
                    width: "40px",
                    height: "40px",
                    background: "#F0EAE2",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                }}>
                    👕
                </div>
            <div>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#2C2420" }}>Care instructions</p>
                <p style={{ fontSize: "12px", fontWeight: 500, color: "#A89E94" }}>Analyzed just now</p>
            </div>
        </div>

        <p style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "15px",
            color: "#5A4E46",
            lineHeight: 1.6,
            fontStyle: "italic",
            marginBottom: "20px",
        }}>
            "{result.raw_summary}"
        </p>

        <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
        }}>
            {fields.map(f => (
                <div key={f.label} style={{
                    background: "#FAF7F2",
                    borderRadius: "12px",
                    padding: "14px 16px",
                }}>
                    <p style={{
                        fontSize: "11px",
                        color: "#A89E94",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: "4px",
                    }}>
                        {f.label}
                    </p>
                    <p style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: valueColor(f.safe),
                    }}>
                        {f.value}
                    </p>
                </div>
            ))}
            {result.material && (
                <div style={{
                    background: "#FAF7F2",
                    borderRadius: "12px",
                    padding: "14px 16px",
                    gridColumn: "1 / -1",
                }}>
                    <p style={{ fontSize: "11px", color: "#A89E94", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                        Material
                    </p>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: "#2C2420" }}>
                        {result.material}
                    </p>
                </div>
            )}

            {result.special_instructions && (
                <div style={{
                    background: "#F0EAE2",
                    borderRadius: "12px",
                    padding: "14px 16px",
                    gridColumn: "1 / -1",
                }}>
                    <p style={{ fontSize: "11px", color: "#A89E94", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                        Special instructions
                    </p>
                    <p style={{ fontSize: "14px", color: "#5A4E46" }}>
                        {result.special_instructions}
                    </p>
                </div>
            )}
        </div>

        {result.confidence && (
            <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "12px",
                background: result.confidence === "high" ? "#EAF3DE" : result.confidence === "medium" ? "#FAEEDA" : "#FAECE7",
                color: result.confidence === "high" ? "#3B6D11" : result.confidence === "medium" ? "854F0B" : "993C1D",
                padding: "4px 10px",
                borderRadius: "100px",
                marginTop: "16px",
            }}>
                {result.confidence === "high" ? "✓" : result.confidence === "medium" ? "~" : "!"} {result.confidence} confidence
            </div>
        )}
     </div>
    );
}