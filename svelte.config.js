const sveltePreprocess = require('svelte-preprocess');
const preprocessOptions = {
    preserve: ['module'],
    postcss: {
        plugins: [require('postcss-nesting')()]
    }
};

module.exports = {
    preprocess: sveltePreprocess(preprocessOptions),
    onwarn: (warning, handler) => {
        const { code, frame } = warning;
        if (code === "css-unused-selector")
          return;

        handler(warning);
      }
}