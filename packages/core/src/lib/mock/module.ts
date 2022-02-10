import { Module } from "../core";

export function createMockModule<T>(): Module<T> {
  return {
    create: jest.fn(),
    destroy: jest.fn(),
  }
}