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
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 1rem;
    background: var(--color-bg);
    font-family: var(--font-sans);
  }

  .count,
  .side {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-muted);
  }

  .card {
    min-height: 8rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .text {
    font-size: var(--text-lg);
    margin: 0.5rem 0;
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  button {
    font: inherit;
    font-size: var(--text-base);
    padding: 0.5rem 1rem;
    min-height: 44px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    color: var(--color-heading);
    cursor: pointer;
  }

  .primary {
    border-color: var(--color-accent);
    font-weight: 600;
  }
</style>
