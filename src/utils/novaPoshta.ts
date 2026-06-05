// Nova Poshta mock data — no API calls, fully offline

export interface NovaPoshta {
  ref: string;
  description: string;
  cityRef: string;
  number: string;
}

export interface NovaPoshtaCity {
  ref: string;
  description: string;
  descriptionRu?: string;
  areaDescription: string;
}

export const MOCK_CITIES = [
  {
    id: 'kyiv', name: 'Київ',
    branches: [
      'Відділення №1: вул. Хрещатик, 22',
      'Відділення №3: пр. Перемоги, 15',
      'Поштомат №12: ТРЦ Арена Сіті',
    ],
  },
  {
    id: 'lviv', name: 'Львів',
    branches: [
      'Відділення №2: вул. Городоцька, 189',
      'Відділення №5: вул. Стрийська, 45',
      'Поштомат №7: ТРЦ Форум Львів',
    ],
  },
  {
    id: 'kharkiv', name: 'Харків',
    branches: [
      'Відділення №1: пр. Науки, 14',
      'Відділення №4: вул. Клочківська, 192',
    ],
  },
  {
    id: 'odesa', name: 'Одеса',
    branches: [
      'Відділення №2: вул. Рішельєвська, 33',
      'Відділення №6: пр. Шевченка, 4',
    ],
  },
  {
    id: 'dnipro', name: 'Дніпро',
    branches: [
      'Відділення №3: вул. Робоча, 2а',
      'Відділення №8: пр. Гагаріна, 72',
    ],
  },
];

// Legacy compat exports
export const mockCities: NovaPoshtaCity[] = MOCK_CITIES.map(c => ({
  ref: `city-${c.id}`,
  description: c.name,
  areaDescription: '',
}));

export const mockBranches: NovaPoshta[] = [
  { ref: 'branch-1', description: 'Відділення №1: вул. Хрещатик, 22', cityRef: 'city-kyiv', number: '1' },
  { ref: 'branch-2', description: 'Відділення №3: пр. Перемоги, 15', cityRef: 'city-kyiv', number: '3' },
  { ref: 'branch-3', description: 'Поштомат №12: ТРЦ Арена Сіті', cityRef: 'city-kyiv', number: '12' },
];

export function searchCities(query: string): NovaPoshtaCity[] {
  if (!query || query.length < 2) return mockCities;
  return mockCities.filter(c => c.description.toLowerCase().includes(query.toLowerCase()));
}

export function getBranches(cityRef: string): NovaPoshta[] {
  const city = MOCK_CITIES.find(c => `city-${c.id}` === cityRef);
  if (!city) return mockBranches;
  return city.branches.map((b, i) => ({
    ref: `${cityRef}-branch-${i}`,
    description: b,
    cityRef,
    number: String(i + 1),
  }));
}
