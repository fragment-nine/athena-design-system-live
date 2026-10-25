import { reactDomClient as m } from './react-all.js';
const x = m.default ?? m;
export default x;
export const createRoot = x.createRoot;
export const hydrateRoot = x.hydrateRoot;
