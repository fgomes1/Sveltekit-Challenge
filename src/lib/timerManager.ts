import { timer } from './stores';

let countdownInterval: number | undefined;

export function startTimer(initialSeconds: number): void {
    timer.set(initialSeconds);
    countdownInterval = setInterval(() => {
        timer.update(current => {
            if (current > 0) return current - 1;
            clearInterval(countdownInterval);
            return 0;
        });
    }, 1000);
}

export function stopTimer(): void {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = undefined;
    }
}