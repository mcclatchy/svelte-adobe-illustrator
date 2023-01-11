/**
 * Get's the mi-styles CSS files from https://www.miamiherald.com head
 */

import axios from 'axios';

async function getMiCss() {
  try {
    const { data } = await axios.get('https://www.miamiherald.com');
    const reg = /(\/wps\/build\/webpack\/css\/mi-styles.)[\w\d]+(.css)/g;
    const found = data.match(reg);
    const url = `https://www.miamiherald.com${found[0]}`;

    return url;
  } catch (error) {
      console.error(error);
  }
}

export { getMiCss };
