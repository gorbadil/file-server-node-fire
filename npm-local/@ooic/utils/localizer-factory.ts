/**
 * Factory function to create a Localizer function.
 * @param options - Options object containing keys for locales array and locale short code.
 * @returns Localizer function.
 */
const LocalizerFactory = ({ localesArrayKey = "locales", localeShortCodeKey = "locale" }): Function => {
  /**
   * Function to localize text based on target language.
   * @param raw - Raw data to be localized.
   * @param target - Target language code for localization.
   * @returns Localized data.
   */
  const Localizer: Function = (raw: any, target: string): any => {
    if (Array.isArray(raw)) {
      return raw.map((data) => Localizer(data, target));
    }

    if (typeof raw === "object" && !Array.isArray(raw)) {
      const localizationObject = target
        ? raw[localesArrayKey]?.find((item) => item[localeShortCodeKey] === target) || {}
        : raw[localesArrayKey]?.[0] || {};
      const newSource: any = {};

      for (const [key, value] of Object.entries(raw)) {
        if (key !== localesArrayKey) {
          if (key === "id") {
            newSource[key] = value;
          } else if (["string", "number"].includes(typeof value) || value === null) {
            newSource[key] = localizationObject[key] || value;
          } else {
            newSource[key] = Localizer(value, target);
          }
        }
      }

      return newSource;
    }

    return raw; // Return as is for non-object, non-array values
  };

  return Localizer;
};

export default LocalizerFactory;
