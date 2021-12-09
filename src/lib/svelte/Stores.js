import { writable } from 'svelte/store';

const pageTitle = writable({ text: '...' });

export {
  pageTitle,
}