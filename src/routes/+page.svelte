<script lang="ts">
    import { candidateData, challengeStarted, timer, showModal, challengeResult } from '$lib/stores';
    import { startTimer, stopTimer } from '$lib/timerManager';

    let name = '';
    let phone = '';
    let email = '';

    const formatTime = (seconds: number): string => {
        const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
        const ss = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${mm}:${ss}`;
    };

    function handleStartChallenge(): void {
        challengeStarted.set(true);
        candidateData.set({ name, phone, email });
        challengeResult.set(null);
        // Start global timer (will persist even when navigating)
        startTimer(15);
    }

    function handleSubmitChallenge(): void {
        stopTimer();
        let remaining = 0;
        timer.subscribe(value => remaining = value)(); // immediate extraction
        challengeResult.set(remaining > 0 ? 'success' : 'failure');
        showModal.set(true);
    }
</script>

<div class="p-4 relative">
    <!-- Candidate Page Navigation Button -->
    <a href="/candidate" class="btn btn-secondary absolute top-4 right-4">Candidate</a>

    <h1 class="text-2xl font-bold mb-4">Challenge Page</h1>
    <div class="form-control">
        <label class="input-group">
            <span>Name</span>
            <input type="text" bind:value={name} class="input input-bordered" />
        </label>
    </div>
    <div class="form-control mt-2">
        <label class="input-group">
            <span>Phone</span>
            <input type="text" bind:value={phone} class="input input-bordered" />
        </label>
    </div>
    <div class="form-control mt-2">
        <label class="input-group">
            <span>Email</span>
            <input type="email" bind:value={email} class="input input-bordered" />
        </label>
    </div>
    <button class="btn btn-primary mt-4" on:click={handleStartChallenge}>Start Challenge</button>

    {#if $challengeStarted}
        <div class="mt-4">
            <p>Countdown: {formatTime($timer)}</p>
            <button class="btn btn-accent mt-2" on:click={handleSubmitChallenge}>Enviar</button>
        </div>
    {/if}
</div>

<!-- DaisyUI Modal -->
{#if $showModal}
    <div class="modal modal-open" on:click|self={() => showModal.set(false)}>
        <div class="modal-box relative">
            <button class="btn btn-sm btn-circle absolute right-2 top-2" on:click={() => showModal.set(false)}>✕</button>
            {#if $challengeResult === 'success'}
                <p>Desafio finalizado com sucesso!</p>
            {:else if $challengeResult === 'failure'}
                <p>Desafio finalizado com falha!</p>
            {/if}
        </div>
    </div>
{/if}