const U = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const PHOTOS = {
  // Hero — salle d'un bistrot parisien, ambiance soir
  salle: U('photo-1414235077428-338989a2e8c0', 1400),
  // Formule midi — assiette d'un plat de bistrot
  formule: U('photo-1546069901-ba9599a7e63c', 1200),
  // Le lieu — intérieur banquettes / lumière chaude
  lieu: U('photo-1517248135467-4c7edcad34c4', 1600),
  // Réservation — table dressée
  table: U('photo-1592861956120-e524fc739696', 900),
} as const;
