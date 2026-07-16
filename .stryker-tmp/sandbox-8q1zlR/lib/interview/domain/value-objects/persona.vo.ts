// @ts-nocheck
export type PersonaType = "direct" | "supportive" | "challenging" | "analytical";

export interface PersonaProps {
  id: string;
  type: PersonaType;
  instructions: string;
}

export class Persona {
  public readonly id: string;
  public readonly type: PersonaType;
  public readonly instructions: string;

  private constructor(props: PersonaProps) {
    this.id = props.id;
    this.type = props.type;
    this.instructions = props.instructions;
  }

  public static create(props: PersonaProps): Persona {
    if (!props.id || !props.instructions) {
      throw new Error("Persona must have an ID and instructions.");
    }
    return new Persona(props);
  }
}
