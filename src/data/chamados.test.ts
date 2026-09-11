import { describe, expect, it } from "vitest";
import { ehPrioridade, ehStatus } from "./chamados.js";

describe("ehPrioridade", () => {
  it("aceita uma prioridade válida", () => {
    expect(ehPrioridade("Alta")).toBe(true);
  });

  it("rejeita uma prioridade inválida", () => {
    expect(ehPrioridade("Crítica")).toBe(false);
  });
});


describe("ehStatus", () => {
  it("aceita um status válido", () => {
    expect(ehStatus("Aberto")).toBe(true);
  });

  it("rejeita um status inválido", () => {
    expect(ehStatus("Cancelado")).toBe(false);
  });
});

