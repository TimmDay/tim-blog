<script lang="ts">
  import type { Card } from './flashcards';

  let { title, cards }: { title: string; cards: Card[] } = $props();

  let index = $state(0);
  let flipped = $state(false);
  const card = $derived(cards[index]);

  function go(step: number) {
    index = (index + step + cards.length) % cards.length;
    flipped = false;
  }
</script>

<section class="deck" aria-label={title}>
  <p class="count" aria-live="polite">Card {index + 1} of {cards.length}</p>
  <div class="card" aria-live="polite">
    <p class="side">{flipped ? 'Answer' : 'Question'}</p>
    <p class="text">{flipped ? card.back : card.front}</p>
  </div>
  <div class="controls">
    <button type="button" onclick={() => go(-1)}>Previous</button>
    <button type="button" class="primary" onclick={() => (flipped = !flipped)}>
      {flipped ? 'Show question' : 'Show answer'}
    </button>
    <button type="button" onclick={() => go(1)}>Next</button>
  </div>
</section>

<style>
  .deck {
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    padding: 1rem;
    background: var(--surface);
  }

  .count,
  .side {
    margin: 0;
    font-size: 0.875rem;
    color: var(--muted);
  }

  .card {
    min-height: 8rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .text {
    font-size: 1.25rem;
    margin: 0.5rem 0;
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  button {
    font: inherit;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    min-height: 44px;
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    background: var(--bg);
    color: var(--fg);
    cursor: pointer;
  }

  .primary {
    border-color: var(--accent);
    font-weight: 600;
  }
</style>
