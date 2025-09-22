import locales from "./locales.json";

const queryParams = new URLSearchParams(window.location.search);

function crushObj(obj, prefix = "") {
  let result = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(result, crushObj(value, newKey));
    }

    result[newKey] = value;
  }

  for (const key in result) {
    if (typeof result[key] === "object") {
      delete result[key];
    }
  }

  return result;
}
const lang = queryParams.get("lang") || "en";
const locale = crushObj(locales[lang]);

export const t = (key) => locale[key] || key;

