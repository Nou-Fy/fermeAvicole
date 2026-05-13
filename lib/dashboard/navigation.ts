export type DashboardNavItem = {
  key: string;
  label: string;
  href: string;
  description?: string;
  children?: Array<{
    label: string;
    href: string;
    description?: string;
  }>;
};

export const dashboardNavigation: DashboardNavItem[] = [
  {
    key: "overview",
    label: "Vue d'ensemble",
    href: "/dashboard/overview",
    description: "Resume global de l'activite",
  },
  {
    key: "elevage",
    label: "Elevage",
    href: "/dashboard/elevage",
    description: "Animaux et enclos",
    children: [
      {
        label: "Animaux",
        href: "/dashboard/elevage/animaux",
        description: "Creation, mise a jour et suivi du cheptel",
      },
      {
        label: "Enclos",
        href: "/dashboard/elevage/enclos",
        description: "Creation, affectation et climat des enclos",
      },
    ],
  },
  {
    key: "sante",
    label: "Sante",
    href: "/dashboard/sante/vaccins",
    description: "Vaccins, traitements et rappels",
    children: [
      {
        label: "Vaccins",
        href: "/dashboard/sante/vaccins",
        description: "Enregistrer les vaccinations",
      },
      {
        label: "Medicaments",
        href: "/dashboard/sante/medicaments",
        description: "Suivre les traitements",
      },
      {
        label: "Historique",
        href: "/dashboard/sante/historique",
        description: "Consulter l'historique sante",
      },
      {
        label: "Notifications",
        href: "/dashboard/sante/notifications",
        description: "Traiter les rappels",
      },
    ],
  },
  {
    key: "production",
    label: "Production",
    href: "/dashboard/production/oeufs",
    description: "Oeufs, couvaison et alimentation",
    children: [
      {
        label: "Oeufs",
        href: "/dashboard/production/oeufs",
        description: "Production et ventes d'oeufs",
      },
      {
        label: "Couvaison",
        href: "/dashboard/production/couvaison",
        description: "Gestion des lots en incubation",
      },
      {
        label: "Alimentation",
        href: "/dashboard/production/alimentation",
        description: "Formules et distributions",
      },
    ],
  },
  {
    key: "ventes",
    label: "Ventes",
    href: "/dashboard/ventes/clients",
    description: "Clients et commandes",
    children: [
      {
        label: "Clients",
        href: "/dashboard/ventes/clients",
        description: "Base commerciale",
      },
      {
        label: "Commandes",
        href: "/dashboard/ventes/commandes",
        description: "Creation et suivi des commandes",
      },
    ],
  },
  {
    key: "finances",
    label: "Finances",
    href: "/dashboard/finances/transactions",
    description: "Transactions, rapports et paiements",
    children: [
      {
        label: "Transactions",
        href: "/dashboard/finances/transactions",
        description: "Revenus, depenses et rapport",
      },
      {
        label: "Paiements",
        href: "/dashboard/finances/paiements",
        description: "Paiements d'abonnement",
      },
    ],
  },
  {
    key: "config",
    label: "Configuration",
    href: "/dashboard/config/couvaison",
    description: "Parametrage metier",
    children: [
      {
        label: "Couvaison",
        href: "/dashboard/config/couvaison",
        description: "Duree par defaut",
      },
      {
        label: "Abonnement",
        href: "/dashboard/config/abonnement",
        description: "Changer de plan",
      },
      {
        label: "Catalogues",
        href: "/dashboard/config/catalogues",
        description: "Constantes metier et plans",
      },
    ],
  },
];

export function isRouteActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getActiveDashboardSection(pathname: string) {
  return (
    dashboardNavigation.find(
      (item) =>
        item.children?.some((child) => isRouteActive(pathname, child.href)) ||
        isRouteActive(pathname, item.href),
    ) ?? dashboardNavigation[0]
  );
}

export function getDashboardSectionByKey(key: string) {
  return dashboardNavigation.find((item) => item.key === key) ?? null;
}
