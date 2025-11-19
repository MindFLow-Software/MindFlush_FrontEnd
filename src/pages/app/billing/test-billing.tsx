import { createBilling } from "@/api/create-billing.ts";
import { useState } from "react";

export function TestBilling() {
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    async function handleTest() {
        setLoading(true);
        setResponse(null);

        try {
            const res = await createBilling({
                patientEmail: "teste@example.com",
                patientTaxId: "12345678901",
                patientName: "Paciente Teste",
                amountInCents: 15000, // R$ 150
                consultationDetails: "Sessão de 50 minutos",
                frequency: "ONE_TIME",
                methods: ["PIX"],
                returnUrl: "http://localhost:5173/sucesso",
                completionUrl: "http://localhost:5173/finalizado",
            });

            setResponse(res);
        } catch (error: any) {
            console.error("Erro no teste:", error);

            alert(
                error?.response?.data?.message ??
                "Erro ao criar cobrança"
            );
        }

        setLoading(false);
    }

    return (
        <div style={{ padding: 24 }}>
            <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>
                Teste de Cobrança (AbacatePay)
            </h1>

            <button
                onClick={handleTest}
                disabled={loading}
                style={{
                    padding: "10px 20px",
                    background: "#4f46e5",
                    color: "white",
                    borderRadius: "8px",
                }}
            >
                {loading ? "Enviando..." : "Criar Cobrança"}
            </button>

            {response && (
                <pre
                    style={{
                        marginTop: "20px",
                        padding: "12px",
                        background: "#111",
                        color: "#0f0",
                        borderRadius: "8px",
                    }}
                >
                    {JSON.stringify(response, null, 2)}
                </pre>
            )}
        </div>
    );
}
