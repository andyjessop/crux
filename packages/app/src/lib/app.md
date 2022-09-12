On each action:
- call next, to update with new state
- get array of modules to unregister: [module1, module2]
- get array of modules to register: [module3, module4]
- get services for all

[
  module1: [service1, service2],
  module2: [service1, service3], 
]

Create dependency hierarchy on parallel threads

[
  module1,
  module3,
]

[
  module2
]

[
  module4
]

& get Record of required instantiated services