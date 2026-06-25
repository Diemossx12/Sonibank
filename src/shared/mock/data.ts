export const MOCK_USER = {
  id: '001',
  firstName: 'Moussa',
  lastName: 'Mahamadou',
  accountNumber: '00001234567890',
  iban: 'NE28 0001 0000 1234 5678 90',
  agencyName: 'Agence Plateau — Niamey',
  phone: '+227 90 12 34 56',
  email: 'moussa.mahamadou@example.ne',
  cardNumber: '**** **** **** 4892',
  cardExpiry: '09/28',
  cardStatus: 'active' as 'active' | 'blocked',
};

export const MOCK_ACCOUNTS = [
  {
    id: 'acc1',
    type: 'Compte Courant',
    number: '****5678',
    balance: 1248500,
    availableBalance: 1198500,
    currency: 'FCFA',
  },
  {
    id: 'acc2',
    type: 'Compte Épargne',
    number: '****9012',
    balance: 875000,
    availableBalance: 875000,
    currency: 'FCFA',
  },
];

export const MOCK_TRANSACTIONS = [
  { id: 't1',  date: '2025-06-18', label: 'Virement reçu — Employeur SONITEL', amount: 450000,  type: 'credit' as const, category: 'virement' },
  { id: 't2',  date: '2025-06-17', label: 'Retrait DAB — Agence Plateau',      amount: -50000,  type: 'debit'  as const, category: 'retrait'  },
  { id: 't3',  date: '2025-06-15', label: 'Virement — Amadou Seydou',          amount: -75000,  type: 'debit'  as const, category: 'virement' },
  { id: 't4',  date: '2025-06-14', label: 'Achat — Supermarché Score Niamey',  amount: -32500,  type: 'debit'  as const, category: 'achat'    },
  { id: 't5',  date: '2025-06-12', label: 'Virement reçu — Loyer Immeuble A',  amount: 120000,  type: 'credit' as const, category: 'virement' },
  { id: 't6',  date: '2025-06-10', label: 'Frais bancaires Juin 2025',         amount: -3500,   type: 'debit'  as const, category: 'frais'    },
  { id: 't7',  date: '2025-06-08', label: 'Retrait DAB — Agence Université',   amount: -25000,  type: 'debit'  as const, category: 'retrait'  },
  { id: 't8',  date: '2025-06-05', label: 'Virement — Fatima Zakari',          amount: -15000,  type: 'debit'  as const, category: 'virement' },
  { id: 't9',  date: '2025-06-03', label: 'Virement reçu — Remboursement Ali', amount: 30000,   type: 'credit' as const, category: 'virement' },
  { id: 't10', date: '2025-06-01', label: 'Achat carburant — Station Total',   amount: -18000,  type: 'debit'  as const, category: 'achat'    },
  { id: 't11', date: '2025-05-30', label: 'Salaire Mai 2025',                  amount: 450000,  type: 'credit' as const, category: 'virement' },
  { id: 't12', date: '2025-05-28', label: 'Achat — Pharmacie Centrale',        amount: -8500,   type: 'debit'  as const, category: 'achat'    },
];

export const MOCK_BENEFICIARIES = [
  { id: 'b1', name: 'Amadou Seydou',  accountNumber: '00009876543210', bank: 'SONIBANK' },
  { id: 'b2', name: 'Fatima Zakari',  accountNumber: '00001122334455', bank: 'SONIBANK' },
  { id: 'b3', name: 'Ibrahim Moussa', accountNumber: '00005544332211', bank: 'BIA Niger' },
  { id: 'b4', name: 'Aissata Diallo', accountNumber: '00007788990011', bank: 'Ecobank'  },
  { id: 'b5', name: 'Oumarou Garba',  accountNumber: '00003344556677', bank: 'SONIBANK' },
];

export const MOCK_BRANCHES = [
  { id: 'br1', name: 'Agence Plateau',    address: 'Avenue de la Mairie, Niamey',     lat: 13.5137, lng: 2.1098, phone: '+227 20 73 20 00', hours: 'Lun–Ven 8h–17h · Sam 8h–13h', hasATM: true,  atmAvailable: true  },
  { id: 'br2', name: 'Agence Université', address: "Route de l'Université, Niamey",   lat: 13.5200, lng: 2.0900, phone: '+227 20 73 20 01', hours: 'Lun–Ven 8h–17h',               hasATM: true,  atmAvailable: true  },
  { id: 'br3', name: 'Agence Wadata',     address: 'Quartier Wadata, Niamey',         lat: 13.5050, lng: 2.1200, phone: '+227 20 73 20 02', hours: 'Lun–Ven 8h–17h · Sam 8h–13h', hasATM: true,  atmAvailable: false },
  { id: 'br4', name: 'Agence Zinder',     address: 'Centre-ville, Zinder',            lat: 13.8067, lng: 8.9881, phone: '+227 20 51 10 00', hours: 'Lun–Ven 8h–17h',               hasATM: true,  atmAvailable: true  },
  { id: 'br5', name: 'Agence Maradi',     address: 'Rue du Commerce, Maradi',         lat: 13.5007, lng: 7.1019, phone: '+227 20 41 05 00', hours: 'Lun–Ven 8h–17h',               hasATM: false, atmAvailable: false },
  { id: 'br6', name: 'Agence Tahoua',     address: 'Avenue Principale, Tahoua',       lat: 14.8892, lng: 5.2678, phone: '+227 20 61 02 00', hours: 'Lun–Ven 8h–17h',               hasATM: true,  atmAvailable: true  },
];
