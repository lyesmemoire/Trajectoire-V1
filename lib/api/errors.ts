export class ApiError extends Error {
  public status: number;
  public code?: string;

  constructor(message: string, status: number = 500, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export class NetworkError extends Error {
  constructor(message: string = "Problème de connexion réseau. Veuillez vérifier votre accès internet.") {
    super(message);
    this.name = "NetworkError";
  }
}

export class TimeoutError extends Error {
  constructor(message: string = "La requête a mis trop de temps à répondre.") {
    super(message);
    this.name = "TimeoutError";
  }
}
