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
        startTimer(15);
    }

    function handleSubmitChallenge(): void {
        stopTimer();
        let remaining = 0;
        timer.subscribe(value => remaining = value)();
        challengeResult.set(remaining > 0 ? 'success' : 'failure');
        showModal.set(true);
    }

    // Reactive block to auto-show modal when timer reaches 0 and challenge hasn't been submitted.
    $: if ($challengeStarted && $timer === 0 && $challengeResult === null) {
        challengeResult.set('failure');
        showModal.set(true);
    }
</script>

<div class="p-4 relative">
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
    <button class="btn btn-primary mt-4 hover:bg-blue-700 hover:shadow-lg transition duration-300" on:click={handleStartChallenge}>Start Challenge</button>

    {#if $challengeStarted}
        <div class="mt-4">
            <p>Countdown: {formatTime($timer)}</p>
            <button class="btn btn-accent mt-2 hover:bg-green-700 hover:shadow-lg transition duration-300" on:click={handleSubmitChallenge}>Enviar</button>
            <a href="/candidate" class="btn btn-secondary mt-2 ml-2 hover:bg-gray-700 hover:shadow-lg transition duration-300">Candidate</a>
        </div>
    {/if}

    {#if $showModal}
        <div class="modal modal-open" role="dialog" aria-modal="true" on:click|self={() => showModal.set(false)} on:keydown|self={(e) => e.key === 'Escape' && showModal.set(false)}>
            <div class="modal-box relative">
                <button id="close-modal-button" class="btn btn-sm btn-circle absolute right-2 top-2 hover:bg-red-500 hover:shadow-xl transition duration-300" on:click={() => showModal.set(false)}>✕</button>
                {#if $challengeResult === 'success'}
                    <p class="text-green-500 font-bold">Desafio finalizado com sucesso!</p>
                {:else if $challengeResult === 'failure'}
                    <p class="text-red-500 font-bold">Desafio finalizado com falha!</p>
                {/if}
            </div>
        </div>
    {/if}
</div>