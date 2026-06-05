// Nova Poshta API integration utilities

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

const NP_API_URL = 'https://api.novaposhta.ua/v2.0/json/';

async function npRequest(model: string, method: string, props: Record<string, unknown> = {}) {
  const apiKey = import.meta.env.VITE_NOVA_POSHTA_API_KEY || '';
  const body = {
    apiKey,
    modelName: model,
    calledMethod: method,
    methodProperties: props,
  };

  const response = await fetch(NP_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return data.data || [];
}

export async function searchCities(query: string): Promise<NovaPoshtaCity[]> {
  if (!query || query.length < 2) return [];
  try {
    const data = await npRequest('Address', 'searchSettlements', {
      CityName: query,
      Limit: 10,
    });
    if (data[0]?.Addresses) {
      return data[0].Addresses.map((a: { Ref: string; Present: string; SettlementRef?: string }) => ({
        ref: a.Ref,
        description: a.Present,
        areaDescription: '',
      }));
    }
    return [];
  } catch {
    return mockCities.filter(c => c.description.toLowerCase().includes(query.toLowerCase()));
  }
}

export async function getBranches(cityRef: string): Promise<NovaPoshta[]> {
  if (!cityRef) return [];
  try {
    const data = await npRequest('AddressGeneral', 'getWarehouses', {
      CityRef: cityRef,
      Limit: 50,
    });
    return data.map((w: { Ref: string; Description: string; CityRef: string; Number: string }) => ({
      ref: w.Ref,
      description: w.Description,
      cityRef: w.CityRef,
      number: w.Number,
    }));
  } catch {
    return mockBranches;
  }
}

// Mock data for development
export const mockCities: NovaPoshtaCity[] = [
  { ref: 'city-kyiv', description: 'Київ', areaDescription: 'Київська' },
  { ref: 'city-lviv', description: 'Львів', areaDescription: 'Львівська' },
  { ref: 'city-kharkiv', description: 'Харків', areaDescription: 'Харківська' },
  { ref: 'city-odesa', description: 'Одеса', areaDescription: 'Одеська' },
  { ref: 'city-dnipro', description: 'Дніпро', areaDescription: 'Дніпропетровська' },
  { ref: 'city-zaporizhzhia', description: 'Запоріжжя', areaDescription: 'Запорізька' },
];

export const mockBranches: NovaPoshta[] = [
  { ref: 'branch-1', description: 'Відділення №1 (до 30 кг): вул. Шевченка, 1', cityRef: 'city-kyiv', number: '1' },
  { ref: 'branch-2', description: 'Відділення №2 (до 30 кг): вул. Хрещатик, 22', cityRef: 'city-kyiv', number: '2' },
  { ref: 'branch-3', description: 'Відділення №3 (до 30 кг): пр. Перемоги, 15', cityRef: 'city-kyiv', number: '3' },
  { ref: 'branch-4', description: 'Відділення №4 (до 30 кг): вул. Сагайдачного, 8', cityRef: 'city-kyiv', number: '4' },
];
