import React, { MouseEvent } from "react";
import { Route, Router } from '@crux/router';

export type Link<T> = ({ to, text }: {
  to: Route<keyof T>;
  text: string;
}) => JSX.Element;

export function createLink<T>(router: Router<T>) {
  return function Link({ to, text }: { to: Route<keyof T>, text: string }) {
    return <a href={to.toString()} onClick={e => navigate(e as MouseEvent)}>{text}</a>;

    function navigate(e: MouseEvent) {
      e.preventDefault();

      const { name, params }  = to;

      router.navigate(name, params);
    }
  }
}