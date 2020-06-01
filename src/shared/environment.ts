export const ASSETS_URL =
  process.env.NODE_ENV === "test"
    ? ""
    : String(process.env.IMPORT_META_URL).replace(/\/modules.*/, "");
