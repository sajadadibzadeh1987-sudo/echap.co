// src/lib/sendOtp.ts
import axios, { AxiosError } from "axios";

const EDGE_API_URL = "https://edge.ippanel.com/v1/api/send";

function normalizePhoneForEdge(phone: string): string {
  const p = phone.trim();

  // 0912...  ->  +98912...
  if (p.startsWith("0")) return "+98" + p.slice(1);

  // 98912... -> +98912...
  if (p.startsWith("98") && !p.startsWith("+98")) return "+" + p;

  // اگر خودش با +98 شروع شده باشد
  if (p.startsWith("+98")) return p;

  // سایر حالت‌ها: همون رو برمی‌گردونیم
  return p;
}

export interface FarazEdgeResponse {
  data?: unknown;
  meta?: {
    status?: boolean;
    message?: string;
    message_code?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export async function sendOtp(
  phone: string,
  code: string
): Promise<FarazEdgeResponse> {
  const apiKey = process.env.FARAZ_API_KEY;
  const patternCode = process.env.FARAZ_PATTERN_CODE;
  const sender = process.env.FARAZ_SENDER_NUMBER;

  if (!apiKey || !patternCode || !sender) {
    console.error("FARAZ_SMS_ENV_ERROR", {
      hasApiKey: !!apiKey,
      hasPattern: !!patternCode,
      hasSender: !!sender,
    });
    throw new Error("Faraz SMS env vars are missing");
  }

  const recipient = normalizePhoneForEdge(phone);

  const payload = {
    sending_type: "pattern",
    from_number: sender,      // +983000505
    code: patternCode,        // کد پترن l50o56vgx2kd86i
    recipients: [recipient],  // ["+98912..."]
    params: {
      // اسم متغیر باید دقیقا مثل پترن باشه: code
      code,
    },
  };

  try {
    console.log("EDGE_SMS_REQUEST", payload);

    const response = await axios.post<FarazEdgeResponse>(
      EDGE_API_URL,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          // طبق داکیومنت Edge:
          Authorization: apiKey,
        },
      }
    );

    console.log("EDGE_SMS_RESPONSE", response.data);
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<FarazEdgeResponse>;
    const data = error.response?.data;
    console.error("EDGE_SMS_ERROR", data ?? error.message ?? error);
    throw new Error("SMS sending failed");
  }
}
