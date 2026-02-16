export interface HealthPayload {
  status: 'ok';
  timestamp: string;
  service: string;
  version: string;
}

export const buildHealthPayload = (): HealthPayload => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  service: 'opencarbox',
  version: process.env.npm_package_version ?? '0.0.0',
});
