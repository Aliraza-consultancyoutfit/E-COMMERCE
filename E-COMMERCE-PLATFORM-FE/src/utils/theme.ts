import { COOKIES_KEYS } from "@/constants/strings";
import { Settings } from "@/interface";
import Cookies from "js-cookie";

const updateSettings = (settings: Settings): void => {
  try {
    Cookies.set(COOKIES_KEYS.SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error(err);
  }
};

export default updateSettings;
