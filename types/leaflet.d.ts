// Type declaration for the 'leaflet' module.
// This file is automatically superseded when @types/leaflet is installed.
declare module 'leaflet' {
  // We need the full Leaflet API, so use a permissive `any` declaration.
  // For full type safety, install @types/leaflet as a dev dependency.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const L: any;
  export = L;
}
