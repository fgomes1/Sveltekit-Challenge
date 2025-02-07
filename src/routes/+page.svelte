<script lang="ts">
    import { candidateData, challengeStarted, timer, showModal, challengeResult } from '$lib/stores';
    import { startTimer, stopTimer } from '$lib/timerManager';

    let name = '';
    let phone = '';
    let email = '';

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

    function handlePhoneInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        input.value = input.value.replace(/\D/g, '');
        phone = input.value;
    }

    // Reactive block to auto-show modal when timer reaches 0 and challenge hasn't been submitted.
    $: if ($challengeStarted && $timer === 0 && $challengeResult === null) {
        challengeResult.set('failure');
        showModal.set(true);
    }
</script>

<div class="hero bg-base-200 min-h-screen flex flex-col items-center justify-center p-4">
    <div class="text-center mb-4">
        <h1 class="text-2xl font-bold">Desafio Lesser</h1>
        {#if $challengeStarted}
            <p class="mt-4 items-center justify-center">Contagem: 
                <span class="countdown font-mono text-6xl" class:countdown-red={$timer <= 5} data-testid="countdown">
                    <span style="--value:{Math.floor($timer / 60)};"></span>:
                    <span style="--value:{$timer % 60};"></span>
                </span>
            </p>
        {/if}
    </div>
    <div class="card bg-base-100 w-full max-w-sm shadow-2xl">
        <form class="card-body" on:submit|preventDefault={handleStartChallenge}>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Nome</span>
            </label>
            <input type="text" placeholder="Nome" class="input input-bordered" bind:value={name} required />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Telefone</span>
            </label>
            <input type="text" placeholder="Telefone" class="input input-bordered" bind:value={phone} on:input={handlePhoneInput} required />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input type="email" placeholder="Email" class="input input-bordered" bind:value={email} required />
          </div>
          <div class="form-control mt-6">
            <button class="btn btn-primary w-full" type="submit">Iniciar Desafio</button>
          </div>
          {#if $challengeStarted}
            <div class="mt-4 w-full flex flex-col space-y-2">
                <button class="btn btn-accent w-full hover:bg-green-700 hover:shadow-lg transition duration-300" type="button" on:click={handleSubmitChallenge}>Enviar</button>
                <a href="/candidate" class="btn btn-secondary w-full hover:bg-gray-700 hover:shadow-lg transition duration-300">Candidato</a>
            </div>
          {/if}
        </form>
    </div>
</div>

{#if $showModal}
    <div class="modal modal-open" role="dialog" aria-modal="true" data-testid="modal" on:click={() => showModal.set(false)}>
        <div class="modal-box relative" on:click|stopPropagation>
            <button id="close-modal-button" class="btn btn-sm btn-circle absolute right-2 top-2 hover:bg-red-500 hover:shadow-xl transition duration-300" on:click={() => showModal.set(false)}>✕</button>
            {#if $challengeResult === 'success'}
                <p class="text-green-500 font-bold">Desafio finalizado com sucesso!</p>
            {:else if $challengeResult === 'failure'}
                <p class="text-red-500 font-bold">Desafio finalizado com falha!</p>
            {/if}
        </div>
    </div>
{/if}

<style>
    .countdown-red {
        color: red;
    }
</style>