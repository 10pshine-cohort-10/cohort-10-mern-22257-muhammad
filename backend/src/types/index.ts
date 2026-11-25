export interface ErrorResponse {
  error: {
    message: string;
    status: number;
  };
}

export interface HealthResponse {
  status: 'ok';
  database: 'connected' | 'disconnected';
}
