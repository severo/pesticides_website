import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/_javascript/main.js',
  onwarn: function(warning, warn) {
    if (warning.code === 'CIRCULAR_DEPENDENCY') {
      return;
    }
    warn(warning);
  },
  output: {
    file: 'docs/lib/main.mustache.js',
    format: 'iife',
    name: 'pesticides_website',
  },
  plugins: [
    resolve(),
    babel(),
    minify({
      comments: false,
    }),
  ],
};
