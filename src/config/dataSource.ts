/** When true, public catalog/settings never call Supabase. Keep false while the paid plan is active. */
export const USE_LOCAL_MOCK = false

export const LOCAL_MODE_WRITE_ERROR =
  'Modo local activo: Supabase está desconectado. Los datos se sirven desde src/data/staticData.ts.'
