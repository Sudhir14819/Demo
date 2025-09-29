import { API_CONFIG, API_MESSAGES } from "@/config/api-config"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  message?: string
}

export class ApiClient {
  private baseURL: string
  private timeout: number
  private retryAttempts: number

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
    this.timeout = API_CONFIG.TIMEOUT
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS
  }

  private getAuthHeaders(): HeadersInit {
    const token = sessionStorage.getItem("auth_token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: data.error?.code || "API_ERROR",
            message: data.error?.message || API_MESSAGES.SERVER_ERROR,
            details: data.error?.details,
          },
        }
      }

      return {
        success: true,
        data: data.data,
        message: data.message || API_MESSAGES.SUCCESS,
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: "PARSE_ERROR",
          message: "Failed to parse response",
        },
      }
    }
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    }

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.timeout)

        const response = await fetch(url, {
          ...config,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        return await this.handleResponse<T>(response)
      } catch (error) {
        if (attempt === this.retryAttempts) {
          return {
            success: false,
            error: {
              code: "NETWORK_ERROR",
              message: "Network request failed",
            },
          }
        }

        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
      }
    }

    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: "Network request failed after retries",
      },
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: "DELETE" })
  }

  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, string>): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append("file", file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    const token = sessionStorage.getItem("auth_token")
    return this.makeRequest<T>(endpoint, {
      method: "POST",
      body: formData,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
    })
  }
}

export const apiClient = new ApiClient()
