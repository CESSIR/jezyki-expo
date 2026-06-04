/**
 * @fileoverview Type declarations for CSS module imports.
 *
 * WHY? TypeScript doesn't natively understand CSS module imports.
 * Without this declaration, `import styles from './foo.module.css'` would cause
 * a TS2307 "Cannot find module" error. This tells TypeScript that any `.css`
 * import resolves to a record of class names → string values.
 */

/** CSS Modules (*.module.css) */
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

/** Plain CSS imports (side-effect only) */
declare module '*.css' {
  const content: string;
  export default content;
}
