# Reference

Here we give move details about how the language is structured.

## Table of Contents

- [Block](#block)
  - [`block_identifier`](#block_identifier)
  - [`blocks`](#blocks)
  - [`props`](#props)
  - [`parent`](#parent)
  - [`render`](#render)
- [Interface](#interface)
  - [`interface_identifier`](#interface_identifier)
  - [`component`](#component)
  - [`context`](#context)
  - [`required`](#required)
  - [`allowed`](#allowed)
  - [`render`](#render)
  - [`extensible`](#extensible)
  - [`preview`](#preview)
  - [`allowConditions`](#allowConditions)
  - [`before`, `after` and `around`  (Outer Interfaces)](#before-after-and-around-outer-interfaces-)
- [Route](#route)
  - [`block_identifier`](#route-block_identifier)
  - [`path`](#path)
- [Plugin](#plugin)
  - [`selector`](#selector)
  - [`block_identifier`](#plugin-block_identifier)

## Block

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

### `block_identifier`

The block identifier is a string that uniquely identifies the declared block within the app.
It is composed by the identifier of the interface it extends, optionally followed by `#` and
a label that only contain letters, digits and underscores.

**Default blocks** are the ones whose identifiers don't contain the `#label` as suffix.

`block_identifier = extended_interface_identifier[#block_label]`

For instance, if a block with label `details` extends the interface `store.product`, then its 
identifier will be `store.product#details`. The default block for any interface always have 
the same name of the implemented interface.

#### Ambiguity

Since block and interface identifiers are unique only inside their app, there could be ambiguity
when referencing identifiers declared on dependencies. If that's the case and the ambiguous block/interface 
app was published by `vendor` with name `app_name`, then its name must be prefixed with `vendor.app_name:`
to remove any ambiguity.

**Warning**: the prefix does not alter the block/interface identifier, it is just a hint for the builder 
to determine the source of the extended interface.

### `blocks`

List of blocks that implements the `allowed` or `required` interfaces.
If the implemented interface is a `LayoutContainer` the order of the blocks will determine the rendering order.

### `props`

Configuration of the block. `props` should only contain layout configurations, must not contain content.

### `parent`

Declares which blocks will configure the outer interfaces (`before`, `after` & `around`)

### `render`

Enum that specifies the render strategy for the block. Allowed values are:

- `server`: component will be rendered on server-side. Blocks can only 
- `client`: component will be rendered on client-side but the component assets can be included in HTML template to increase rendering speed. Cannot be overridden by `server` value in any extending interface.
- `lazy`: the component will be rendered on client-side and the component assets must not be included in HTML template - runtime will fetch those assets when necessary. Cannot be overridden in any extending interface.

Defaults to `server`.

## Interface

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
    interface_identifier : {
        component: string | null
        context: string | null
        allowed: string[]
        required: string[]
        render: RenderStrategy
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

### `interface_identifier`

The interface identifier is a string that uniquely identifies the declared interface within the app.
It is composed by a name which only contain letters, digits and underscores. If the interface extends 
another one, its name must contain the identifier of the extended interface plus a dot (`.`) as prefix.

`interface_identifier = [extended_interface_name.]interface_name`

For instance, if a interface with label `details` extends `store.product`, then its identifier
will be `store.product.details`.

#### Ambiguity

Since block and interface identifiers are unique only inside their app, there could be ambiguity
when referencing identifiers declared on dependencies. If that's the case and the ambiguous block/interface 
app was published by `vendor` with name `app_name`, then its name must be prefixed with `vendor.app_name:`
to remove any ambiguity.

**Warning**: the prefix does not alter the block/interface identifier, it is just a hint for the builder 
to determine the source of the extended interface.

### `component`

Interfaces must always declare a component. As a syntax sugar if you omit the `component` 
property - or if you set it as `null` - in interface definition, the component will be `LayoutContainer`. 

If the interface is abstract, it must declare `'*'` as its component:.

### `context`

Component that should provide a [React Context](https://reactjs.org/docs/context.html) to the Block.
Mostly used by templates to get specific data for the route (e.g. product or category data).

### `required`

Array of interface names that specifies which interfaces are **required** to be included 
inside the `blocks` field of any implementing block.

### `allowed`

Array of interface names that specifies which interfaces are **allowed** to be included 
inside the `blocks` field of any implementing block.

### `render`

Enum that specifies the render strategy for the interface. Allowed values are:

- `server`: component will be rendered on server-side. Can be overridden by any value in any extending interface.
- `client`: component will be rendered on client-side but the component assets can be included in HTML template to increase rendering speed. Cannot be overridden by `server` value in any extending interface.
- `lazy`: the component will be rendered on client-side and the component assets must not be included in HTML template - runtime will fetch those assets when necessary. Cannot be overridden in any extending interface.

Defaults to `server`.

### `extensible`

Enum that specifies who can extend the interface. 
The allowed values are `"vtex"`, `"gocommerce"`, `"enterprise"` or `"public"`.

- `vtex` and `gocommerce` accounts can always extend all interfaces.
- `enterprise`-level accounts can extend all interfaces but the ones with `extensible` set to `"vtex"` or `"gocommerce"`.
- All other accounts can only extend interfaces with `extensible` set to `"public"`.

Value defaults to `"enterprise"`.

### `preview`

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

### `allowConditions`

If a template implements the interface, this boolean defines if the route can have conditions or not.
Defaults to `true`.

### `before`, `after` and `around`  (Outer Interfaces)

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

## Route

Routes are be declared in the `interfaces.json` configuration file. The file has the following structure:

```
{
    block_identifier : {
        path: string
        canonical?: string
    }
    ...
}
```

### Route `block_identifier`

An identifier of a declared block.

### `path`

String with the relative path to access the template.
A route will be accessed if its path matches the current URL.

To get values from the URL, one may insert parameters on the path.
Parameters can have different behaviors depending on their prefix:

- `:identifier` will capture the string between two `/`.
- `*identifier` will capture the biggest string possible that produces a valid match between the URL and the path.

#### `canonical`

Friendlier path to access same resources.

## Plugin

Plugins are mappings between a selector and a block.

Selectors are strings that specify positions in the interface tree, allowing the store builder to determine where to insert the plugin block.

Routes are be declared in the `plugins.json` configuration file. The file has the following structure:
```
{
    selector: block_identifier
    ...
}
```

### `selector`

A selector is a string that has a list of interface identifiers separated by spaces and `>`.

For instance, a plugin with `"int_1 > int_2 > int_3"` as selector will be insert its block anywhere in the interface tree 
where `int_3` is direct child of `int_2` and `int_2` is direct child of `int_1`.

### Plugin `block_identifier`

An identifier of a declared block.
