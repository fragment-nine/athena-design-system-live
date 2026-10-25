import { reactJsxRuntime as r } from './react-all.js';
export const Fragment = r.Fragment;
export const jsxDEV = (type, props, key, isStaticChildren) => (isStaticChildren ? r.jsxs : r.jsx)(type, props, key);
export default { Fragment, jsxDEV };
