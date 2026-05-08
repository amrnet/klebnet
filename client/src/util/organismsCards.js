import { kleb } from '../assets/organisms';
import { isProduction } from './env';

// KlebNET-GSP is a single-organism dashboard for Klebsiella pneumoniae.
// Multi-organism scaffolding is retained from the upstream AMRnet codebase
// to keep diffs small and to allow future rebases.
export const DEV_ONLY_ORGANISMS = [];

const allOrganismsCards = [
  {
    label: (
      <span>
        <i>Klebsiella pneumoniae</i>
      </span>
    ),
    stringLabel: 'Klebsiella pneumoniae',
    value: 'kpneumo',
    abbr: 'K. pneumoniae',
    img: kleb,
  },
];

export const organismsCards = isProduction()
  ? allOrganismsCards.filter(card => !DEV_ONLY_ORGANISMS.includes(card.value))
  : allOrganismsCards;

export const amrLikeOrganisms = [];

export const organismsWithLotsGenotypes = ['kpneumo'];
