<script lang="ts">
    import { candidateData, challengeStarted } from '$lib/stores';
    import { goto } from '$app/navigation';

    $: data = $candidateData;
</script>

<div class="p-4 relative">
    <!-- Back to Challenge button in the top right corner -->
    <button class="btn btn-primary absolute top-4 right-4" on:click={() => goto('/')}>
        Voltar ao Desafio
    </button>
    <h1 class="text-2xl font-bold mb-4 text-center">Página do Candidato</h1>
    {#if $challengeStarted && data}
        <div class="flex justify-center">
            <div class="card card-side bg-base-100 shadow-xl">
                <figure>
                    <img src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp" alt="Candidate" />
                </figure>
                <div class="card-body">
                    <h2 class="card-title">Informações do Candidato</h2>
                    <p>Nome: {data.name}</p>
                    <p>Telefone: {data.phone}</p>
                    <p>Email: {data.email}</p>
                </div>
            </div>
        </div>
    {:else}
        <p class="text-center">O desafio ainda não começou.</p>
    {/if}
</div>