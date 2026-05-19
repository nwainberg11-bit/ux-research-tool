// Registro de schemas y vistas de pasos.
// Auto-descubre cada step-N-*/schema.js y step-N-*/view.js.
// F0 dejó schemas stub; F2/F3 los completan y agregan view.js.

const schemaModules = import.meta.glob('./step-*/schema.js', { eager: true });
const viewModules = import.meta.glob('./step-*/view.js', { eager: true });

export const schemas = {};
for (const path in schemaModules) {
  const def = schemaModules[path].default;
  schemas[String(def.n)] = def;
}

export const views = {};
for (const path in viewModules) {
  const m = viewModules[path];
  const n = m.meta?.n;
  if (n != null) views[String(n)] = m;
}
