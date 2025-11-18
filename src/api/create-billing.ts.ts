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

export async function CreaterBilling(
    data: CreateBillingRequest
): Promise<CreateBillingResponse> {

    const token = localStorage.getItem("token");

    const response = await api.post<CreateBillingResponse>(
        "/billing",
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
    );

    return response.data;
}
