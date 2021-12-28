import { writable } from "svelte/store";

type GameStatus = 'isPlaying' | 'hasWon' | 'hasLost';

const gameStatus = writable<GameStatus>("isPlaying")

export { gameStatus };