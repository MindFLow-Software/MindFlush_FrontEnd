import { api } from "@/lib/axios";

export interface CreateBillingRequest {
  patientEmail: string;
  patientTaxId: string;
  patientName: string;
  amountInCents: number;
  consultationDetails: string;
  frequency: 'ONE_TIME' | 'MULTIPLE_PAYMENTS';
  methods: ('PIX' | 'CARD')[];
  returnUrl: string;
  completionUrl: string;
}

export interface CreateBillingResponse {
  message: string;
  billingUrl: string;
  billingId: string;
  amount: number;
}

export async function createBilling(
  data: CreateBillingRequest
): Promise<CreateBillingResponse> {
  const token = localStorage.getItem("token");

  const response = await api.post<CreateBillingResponse>(
    "/billing", // <-- Rota correta no backend
    data,
    {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
    }
  );

  return response.data;
}
