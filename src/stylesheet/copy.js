const fonts = {
  sanSerif: {
    fontFamily: 'sans-serif',
  },
  serif: {
    fontFamily: 'serif',
  },
  mono: {
    fontFamily: 'monospace',
  },
};

export const tags = {
  h1: {
    fontSize: '1.5em',
    ...fonts.sanSerif,
  },
  h2: {
    fontSize: '1.4em',
    ...fonts.sanSerif,
  },
  h3: {
    fontSize: '1.3em',
    ...fonts.sanSerif,
  },
  h4: {
    fontSize: '1.2em',
    ...fonts.sanSerif,
  },
  h5: {
    fontSize: '1.1em',
    ...fonts.sanSerif,
  },
  p: {
    fontSize: 'large',
    ...fonts.serif,
  },
};

/**
 * Common typeface utilty classes
 * @typedef {Object} copy
 */
export default { ...fonts, ...tags };
