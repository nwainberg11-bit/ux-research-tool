// Registro de schemas de pasos. Auto-descubre cada step-N-*/schema.js.
// F0: los schemas son stubs (fields: []). F2/F3 los completan sin tocar este archivo.

const modules = import.meta.glob('./step-*/schema.js', { eager: true });

export const schemas = {};
for (const path in modules) {
  const def = modules[path].default;
  schemas[String(def.n)] = def;
}
