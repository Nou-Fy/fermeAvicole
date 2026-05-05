export function formatDate(value: Date | string | null | undefined) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function formatCurrency(value: number, currency: "EUR" | "MGA" = "MGA") {
  return new Intl.NumberFormat("fr-MG", {
    style: "currency",
    currency: currency === "MGA" ? "MGA" : "EUR",
  }).format(value);
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur inattendue est survenue.";
}
