import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const plans = [
    {
      name: "BASIC",
      description: "Plan basique pour petites fermes",
      price: 29.99,
      maxAnimals: 500,
      maxUsers: 1,
      features: [
        "Gestion des animaux",
        "Suivi sante basique",
        "Rapports simples",
      ],
    },
    {
      name: "PRO",
      description: "Plan pro pour fermes moyennes",
      price: 79.99,
      maxAnimals: 2000,
      maxUsers: 5,
      features: [
        "Gestion complete des animaux",
        "Suivi sante avance",
        "Gestion alimentation",
        "Rapports detailles",
        "Gestion des enclos",
      ],
    },
    {
      name: "ENTERPRISE",
      description: "Plan entreprise pour grandes fermes",
      price: 199.99,
      maxAnimals: -1,
      maxUsers: 20,
      features: [
        "Tout inclus dans PRO",
        "Multi-sites",
        "Integrations API",
        "Support prioritaire",
        "Analytics avancees",
      ],
    },
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { name: plan.name },
      update: {
        description: plan.description,
        price: plan.price,
        maxAnimals: plan.maxAnimals,
        maxUsers: plan.maxUsers,
        features: plan.features,
        isActive: true,
      },
      create: {
        ...plan,
        isActive: true,
      },
    });
  }

  const vaccins = [
    {
      nom: "Newcastle",
      description: "Vaccin preventif contre la maladie de Newcastle",
      age_mois: 1,
      rappel_mois: 6,
    },
    {
      nom: "Gumboro",
      description: "Protection contre la bursite infectieuse",
      age_mois: 1,
      rappel_mois: 4,
    },
    {
      nom: "Bronchite infectieuse",
      description: "Vaccination respiratoire de reference",
      age_mois: 2,
      rappel_mois: 6,
    },
  ];

  for (const vaccin of vaccins) {
    await prisma.configVaccinConstante.upsert({
      where: { nom: vaccin.nom },
      update: vaccin,
      create: vaccin,
    });
  }

  const medicaments = [
    {
      nom: "Vitamines croissance",
      description: "Complement de croissance post-eclosion",
      dosage: "5 ml / 10 L",
      duree_jours: 5,
    },
    {
      nom: "Antibiotique respiratoire",
      description: "Traitement d'appoint sur trouble respiratoire",
      dosage: "1 comprime / jour",
      duree_jours: 7,
    },
    {
      nom: "Antiparasitaire",
      description: "Traitement des parasites internes",
      dosage: "2 ml / jour",
      duree_jours: 3,
    },
  ];

  for (const medicament of medicaments) {
    await prisma.configMedicamentConstante.upsert({
      where: { nom: medicament.nom },
      update: medicament,
      create: medicament,
    });
  }

  const races = [
    {
      nom: "Pondeuse rousse",
      description: "Race productive et robuste",
      type: "Pondeuse",
    },
    {
      nom: "Brahma",
      description: "Race rustique a croissance lente",
      type: "Mixte",
    },
    {
      nom: "Leghorn",
      description: "Tres bonne pondeuse de reference",
      type: "Pondeuse",
    },
  ];

  for (const race of races) {
    await prisma.configRaceConstante.upsert({
      where: { nom: race.nom },
      update: race,
      create: race,
    });
  }

  const enclosTypes = [
    {
      nom: "Poussiniere",
      description: "Zone de demarrage des poussins",
      capaciteMax: 150,
    },
    {
      nom: "Pondeuse",
      description: "Enclos dedie a la ponte",
      capaciteMax: 200,
    },
    {
      nom: "Reproducteur",
      description: "Enclos reserve au cheptel de reproduction",
      capaciteMax: 80,
    },
  ];

  for (const type of enclosTypes) {
    await prisma.configTypeEnclosConstante.upsert({
      where: { nom: type.nom },
      update: type,
      create: type,
    });
  }

  const categories = [
    { nom: "S", poids_min: 40, poids_max: 49, prix: 0.18 },
    { nom: "M", poids_min: 50, poids_max: 59, prix: 0.22 },
    { nom: "L", poids_min: 60, poids_max: 69, prix: 0.27 },
    { nom: "XL", poids_min: 70, poids_max: 90, prix: 0.31 },
  ];

  for (const category of categories) {
    await prisma.configCategorieOeufConstante.upsert({
      where: { nom: category.nom },
      update: category,
      create: category,
    });
  }

  const currentDuration = await prisma.configCouvaisonDuration.findFirst();

  if (!currentDuration) {
    await prisma.configCouvaisonDuration.create({
      data: { durationDays: 21 },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
