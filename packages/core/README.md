# core

The `core` is a very small package that manages the layout and region-specific modules in a `crux` app. It is designed in order that the layout is decoupled from the rest of the application.

The purpose of `core` is to call the `layout` function with a new `state`, and then create and destroy modules accordingly.
