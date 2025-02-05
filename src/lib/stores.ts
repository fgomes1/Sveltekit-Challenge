import { writable } from 'svelte/store';

export interface CandidateData {
    name: string;
    phone: string;
    email: string;
}

export const candidateData = writable<CandidateData | null>(null);
export const challengeStarted = writable<boolean>(false);
export const timer = writable<number>(15);
export const showModal = writable<boolean>(false);
export const challengeResult = writable<'success' | 'failure' | null>(null);