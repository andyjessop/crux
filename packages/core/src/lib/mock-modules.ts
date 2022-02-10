import { Module } from "..";

export function createMockModule<T>(): Module<T> {
  return {
    create: jest.fn(),
    destroy: jest.fn(),
  }
}