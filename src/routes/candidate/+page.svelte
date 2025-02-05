<script lang="ts">
    import { candidateData, challengeStarted } from '$lib/stores';
    import { goto } from '$app/navigation';

    $: data = $candidateData;
</script>

<div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Candidate Page</h1>
    {#if $challengeStarted && data}
        <p>Name: {data.name}</p>
        <p>Phone: {data.phone}</p>
        <p>Email: {data.email}</p>
    {:else}
        <p>The challenge has not been started yet.</p>
    {/if}
    <button class="btn btn-primary mt-4" on:click={() => goto('/')}>Back to Challenge</button>
</div>