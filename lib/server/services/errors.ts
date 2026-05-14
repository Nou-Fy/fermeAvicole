export class ApplicationError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }
}

export class EnclosureNotFoundError extends ApplicationError {
  constructor(id: string) {
    super("ENCLOSURE_NOT_FOUND", `Enclosure ${id} not found`, 404);
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor(message: string = "Unauthorized access") {
    super("UNAUTHORIZED", message, 403);
  }
}

export class ForbiddenError extends ApplicationError {
  constructor(message: string = "Access forbidden") {
    super("FORBIDDEN", message, 403);
  }
}

export class EnclosureNotEmptyError extends ApplicationError {
  constructor(animalCount: number) {
    super(
      "ENCLOSURE_NOT_EMPTY",
      `Cannot delete enclosure with ${animalCount} active animals`,
      409,
    );
  }
}
