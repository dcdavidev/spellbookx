import { config } from 'cz-config-spellbookx';
import { definePrompt } from 'czg';

export default definePrompt({
  ...config,
  useEmoji: true,
});
