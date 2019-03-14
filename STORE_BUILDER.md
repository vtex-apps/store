# Store Builder

VTEX IO created a powerful way to configure the behavior [React](https://reactjs.org/) components yielding the basic building *blocks* for a web app.
IO **store builder** is a opinionated way to use IO capabilities to quickly build store components that can be reused
across VTEX stores and interact seamlessly with it's APIs and existing components.

**Blocks** are instances of configured React components that follow a defined contract - or VTEX IO *interface*.
Blocks can be shared between apps and can contain other blocks. They can be used to create simple widgets 
like buttons and forms, ready to use features like a review system or whole web pages.

To create web pages, a block must be acessible via a **route**. Routes associate blocks with paths that 
can be used to match URLS. Blocks that are bound to routes create **templates** in VTEX IO Content Management System (CMS).

Apps can also insert it's blocks on specific page components as soon as the app is installed, via **plugins**.
Plugins provide an easy way to add specific functionality in a plug and play fashion to any store - 
e.g. Visa Checkout button on the shopping cart, 360º image on the product galery.

To ensure that blocks would be reusable across stores, any VTEX IO store contain a set of *interfaces* 
which blocks must implement. **Interfaces** are contracts that define the block component and which interfaces 
it may contain, among other constraints.

The store builder validates and exports blocks, routes, interfaces and plugins defined in the app.
This allows the admin CMS and the store to use them. The configuration files which declare those
components must be in the `store/` folder on the root of the app.

## Store Interface Structure
[TODO]
Explain Store interface structure, how it make stores "compatible" and it's components reusable.

## Recipes
[TODO]

How to extend VTEX Store interfaces?

How to create a block / interface / route / plugin?

Examples, examples, examples...


## Reference

### Blocks
Blocks must always implement one interface by providing props to it and declaring its outer blocks.

Blocks are be declared in the `blocks.json` configuration file. The file has the following structure:

```
{
    block_identifier: {
        blocks?: string[]
        props?: Record<string, any>
        parent?: Record<string, string>
    }
    ...
}
```

#### `block_identifier`

A block identifier should be the identifier of the interfaces it implements optionaly followed by a `#` and a label.
If the block identifier doesn't contain the `#label` it will be the default block.
Block identifiers must be unique inside an app.

#### `blocks`

List of blocks that implements the `allowed` or `required` interfaces.
If the implemented interface is a `LayoutContainer` the order of the blocks will determine the rendering order.

#### `props`

Configuration of the block. `props` should only contain layout configurations, must not contain content.

#### `parent`
Declares which blocks will configure the outer interfces (`before`, `after` & `around`)


### Interfaces

Interfaces can extend behavior from a single existing interface, through a inheritance-like process.

**Abstract interfaces** are the the contracts that are not tied to any component. 
They are the ones in which the `component` value takes the special value `'*'`.
Blocks cannot implement an abstract interface.

Every non-abstract interface must have a **default block** - a block with same name as the interface and no #label. 
If the builder cannot find a default block, it will try to generate it.

If the interface does not reference any abstract interfaces in its outer interfaces, the builder will be able to generate a default block.
If the builder cannot find a default block or generate it, it will throw an error.


Routes bind paths to blocks, creating templates. Templates are top level blocks that can be used as web pages for the store.


Interfaces are be declared in the `interfaces.json` configuration file. The file has the following structure:

```
{
    interface_name : {
        component: string | null
        context: string | null
        allowed: string[]
        required: string[]
        ssr: boolean
        allowConditions?: boolean
        extensible?: ExtensibilityLevel
        preview?: Preview
        after?: string[]
        around?: string[]
        before?: string[]
    },
    ...
}
```

#### `interface_name`
The interface name (`interface_name`) is a string that uniquely identifies the declared interface within the app.

If the interface app was published by `vendor` with name `app_name`, then the interface indentifier is `vendor.app_name:interface_name`.
When there is no ambiguity, the interface may be only by its name. 

If the interface is not extending any existing interface, then its name must only contain letters, digits and underscores.

If the interface extends another interface, then its name should be the extended interface identifier 
followed by a dot (`.`) followed by name that only contain letters, digits and underscores.


#### `component`

Interfaces must always declare a component. As a syntax sugar if you omit the `component` 
property - or if you set it as `null` - in interface definition, the component will be `LayoutContainer`. 

If the interface is abstract, it must declare `'*'` as its component:.

#### `context`

Component that should provide a [React Context](https://reactjs.org/docs/context.html) to the Block.
Mostly used by templates to get specific data for the route (e.g. product or category data).

#### `required`

Array of interface names that specifies which interfaces are **required** to be included 
inside the `blocks` field of any implementing block.

#### `allowed`

Array of interface names that specifies which interfaces are **allowed** to be included 
inside the `blocks` field of any implementing block.

#### `ssr`

Boolean that determines if any implementing block should be rendered on the server side or not.
Defaults to `true`.

#### `extensible`

Enum that specifies who can extend the interface. 
The allowed values are `"vtex"`, `"gocommerce"`, `"enterprise"` or `"public"`.

- `vtex` and `gocommerce` accounts can always extend all interfaces.
- `enterprise`-level accounts can extend all interfaces but the ones with `extensible` set to `"vtex"` or `"gocommerce"`.
- All other accounts can only extend interfaces with `extensible` set to `"public"`.

Value defaults to `"enterprise"`.

#### `preview`

Interfaces with `preview` property set have reserved screen space before completely loaded.
This avoids elements popping and changing places while the screen is not completely rendered.

The `Preview` object should follow the interface:

```
interface Preview {
  type: "block" | "circle" | "text"
  width?: number
  height?: number
}
```

`height` and `width` properties represents the dimensions in pixels and 
`type` enum determines the preview component that will be used.

#### `allowConditions`
If a template implements the interface, this boolean defines if the route can have conditions or not.
Defaults to `true`.

#### `before`, `after` and `around`  (Outer Interfaces)
List of interfaces that should come `before`, `after` and `around` the defined interface.

**Warning**: this is a advanced feature and should not be regularly used.
It is mainly useful for stating that `before` and `after` every page there should be a header and a footer.
It is also used to wrap components `around` a page to ensure that a user is logged in, for instance.

If the interface declares `k` elements around it, `n` before and `m` after, they will assume the order:
```
<Around_1>
    ...
    <Around_k>
        <Before_1/>
        ...
        <Before_n/>
        <InterfaceBlock/>
        <After_1/>
        ...
        <After_m/>
    </Around_k>
    ...
</Around_1>
```

### Route
Routes are be declared in the `interfaces.json` configuration file. The file has the following structure:

routes.json
```
{
    block_identifier : {
        path: string
        canonical?: string
    }
    ...
}
```

#### `block_identifier`
An identifier of a declared block.

#### `path`
String with the relative path to access the template.
A route will be accessed if it's path matches the current URL.

To get values from the URL, one may insert parameters on the path.
Parameters can have different behaviors dependeing on their prefix:

- `:identifier` will capture the string between two `/`.
- `*identifier` will capture the biggest string possible that produces a valid match between the URL and the path.

#### `canonical`

Friendlier path to access same resources.
Perguntar Gimenes como funciona melhor.

### Plugins
Plugins are mappings between a selector and a block.

Selectors are strings that specify positions in the interface tree, allowing the store builder to determine where to insert the plugin block.

Routes are be declared in the `plugins.json` configuration file. The file has the following structure:
```
{
    selector: block_identifier
    ...
}
```

#### `selector`
A selector is a string that has a list of interface identifiers separated by spaces and `>`.

For instance, a plugin with `"int_1 > int_2 > int_3"` as selector will be insert it's block anywhere in the interface tree 
where `int_3` is direct child of `int_2` and `int_2` is direct child of `int_1`.

#### `block_identifier`
An identifier of a declared block.