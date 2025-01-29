/**
 * Get's the mi-styles CSS files from https://www.miamiherald.com head
 */

import axios from 'axios';

async function getMiCss() {
  
  // UPDATE: this request is timing out (as of 10/17/23)
  // try {
  //   const { data } = await axios.get('https://www.miamiherald.com');
  //   const reg = /(\/wps\/build\/webpack\/css\/mi-styles.)[\w\d]+(.css)/g;
  //   const found = data.match(reg);
  //   const url = `https://www.miamiherald.com${found[0]}`;

  //   return url;
  // } catch (error) {
  //     console.error(error);
  // }

  // UPDATE: using an alternate method to get latest saratoga.css
  const url = "https://www.miamiherald.com/static/hi/sds/2.5/dist/saratoga.css";
  return url;
}

export { getMiCss };
