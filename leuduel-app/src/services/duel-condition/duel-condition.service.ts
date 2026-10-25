import { Injectable } from '@angular/core';

interface Condition {
  description: string;
  positive: boolean;
  cardRequired?: boolean;
}

interface ConditionCards {
  name: string;
  conditions: number[];
  target: 'self' | 'both';
  cardRequired?: boolean;
}

// Conditions that apply for the rest of the duel
const CONDITIONS: Record<number, Condition> = {
  1: { description: 'You cannot activate monster effects in the hand.', positive: false },
  2: {
    description: 'Draw 2 cards instead of 1 for your normal draw during your Draw Phase.',
    positive: true,
  },
  3: { description: 'You can conduct 2 Normal Summons/Sets per turn, not just 1.', positive: true },
  4: {
    description: 'You can Normal Summon Level 5 or higher monsters without Tributing.',
    positive: true,
  },
  5: { description: 'You do not pay LP to activate Spell/Trap Cards.', positive: true },
  6: {
    description:
      'Monsters you control can make up to 2 attacks on monsters during each Battle Phase.',
    positive: true,
  },
  7: {
    description:
      "If your monster battles an opponent's monster, any battle damage it inflicts to your opponent is doubled.",
    positive: true,
  },
  8: {
    description: 'You cannot activate the effects of LIGHT monsters for the rest of this Duel.',
    positive: false,
  },
  9: {
    description: 'You cannot activate the effects of DARK monsters for the rest of this Duel.',
    positive: false,
  },
  10: {
    description: 'You cannot activate the effects of FIRE monsters for the rest of this Duel.',
    positive: false,
  },
  11: {
    description: 'You cannot activate the effects of WATER monsters for the rest of this Duel.',
    positive: false,
  },
  12: {
    description: 'You cannot activate the effects of EARTH monsters for the rest of this Duel.',
    positive: false,
  },
  13: {
    description: 'You cannot activate the effects of WIND monsters for the rest of this Duel.',
    positive: false,
  },
  14: {
    description: 'You cannot activate Spell Cards with that name for the rest of this Duel.',
    positive: false,
    cardRequired: true,
  },
  15: {
    description: 'You cannot activate Spell/Trap Cards or effects, except "Sekka\'s Light".',
    positive: false,
  },
  16: {
    description:
      'You cannot activate cards, or the effects of cards, with the same original name as that declared card.',
    positive: false,
    cardRequired: true,
  },
  17: {
    description:
      'Neither player can activate cards with that name, or their effects, for the rest of this Duel, except that target.',
    positive: false,
    cardRequired: true,
  },
  18: {
    description:
      'Neither player can activate cards, or the effects of cards, with that name for the rest of this Duel.',
    positive: false,
    cardRequired: true,
  },
  19: {
    description: 'You can only use this effect once per Duel.',
    positive: false,
    cardRequired: true,
  },
};

// Cards that grant conditions
const CONDITION_CARDS: Record<number, ConditionCards> = {
  1: {
    name: 'Once per duel',
    conditions: [19],
    target: 'self',
    cardRequired: true,
  },
  2: {
    name: 'Time-Tearing Morganite',
    conditions: [1, 2, 3],
    target: 'self',
  },
  3: {
    name: 'Guilt-Gripping Morganite',
    conditions: [1, 4, 5],
    target: 'self',
  },
  4: {
    name: 'Succumbing-Song Morganite',
    conditions: [1, 6, 7],
    target: 'self',
  },
  5: {
    name: 'Dominus Impulse',
    conditions: [8, 12, 13],
    target: 'self',
  },
  6: {
    name: 'Dominus Purge',
    conditions: [9, 10, 11],
    target: 'self',
  },
  7: {
    name: 'Dominus Spiral',
    conditions: [8, 9],
    target: 'self',
  },
  8: {
    name: 'Dominus Spark',
    conditions: [10, 11, 12, 13],
    target: 'self',
  },
  9: {
    name: 'Cursed Seal of the Forbidden Spell',
    conditions: [14],
    target: 'self',
    cardRequired: true,
  },
  10: {
    name: "Sekka's Light",
    conditions: [15],
    target: 'self',
  },
  11: {
    name: 'Sales Ban',
    conditions: [16],
    target: 'self',
    cardRequired: true,
  },
  12: {
    name: 'Mistaken Accusation',
    conditions: [17],
    target: 'both',
    cardRequired: true,
  },
  13: {
    name: 'Armageddon Designator',
    conditions: [18],
    target: 'both',
    cardRequired: true,
  },
};

@Injectable({
  providedIn: 'root',
})
export class DuelConditionService {
  getCondition(id: number) {
    return CONDITIONS[id];
  }

  getConditions(_ids: number[]) {
    const ids = [...new Set(_ids)];
    return ids.map((id) => CONDITIONS[id]);
  }

  getConditionsByCard(ccId: number) {
    const card = CONDITION_CARDS[ccId];
    const ids = card.conditions;
    return this.getConditions(ids);
  }

  getConditionCard(ccId: number) {
    return CONDITION_CARDS[ccId];
  }

  getAllConditionCards(): { id: number; card: ConditionCards }[] {
    return Object.keys(CONDITION_CARDS).map((key) => ({
      id: Number(key),
      card: CONDITION_CARDS[Number(key)],
    }));
  }
}
