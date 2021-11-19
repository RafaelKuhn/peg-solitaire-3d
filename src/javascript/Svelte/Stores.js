import { writable } from 'svelte/store';

const pageTitle = writable({ text: '...' });
const selectedPiece = writable({ x: 3, y: 3 });

export {
  pageTitle,
  selectedPiece
}