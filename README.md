# jsx-no-react

[![Build Status](https://github.com/bitboxer/jsx-no-react/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/bitboxer/jsx-no-react/actions/workflows/node.js.yml)

`jsx-no-react` makes it possible to use React's JSX syntax outside of React projects. Using `renderBefore` and `renderAfter` requires a modern browser supporting `Element.insertAdjacentElement()` - all other render modes function in legacy browsers.

## Installation

```sh
yarn add jsx-no-react
```

### Upgrading

2.0.0 introduces breaking changes with rendering modes - `renderAndReplace` is now called `render` to follow common practice with SPA frameworks rendering mechanisms. Additionally, the render locations below are more explicit on where they will place the JSX output. Finally, prepend and append now support top-level JSX fragments (before and after render locations require a top-level container element still).

New methods:
```js
renderBefore(<Hello name="world" />, targetElement);
renderPrepend(<Hello name="world" />, targetElement);
render(<Hello name="world" />, targetElement);
renderAppend(<Hello name="world" />, targetElement);
renderAfter(<Hello name="world" />, targetElement);
```

### Usage in Babel

You'll also need to hook the `jsxElem` function into the JSX transformation, for which you should probably use [babel](https://www.npmjs.com/package/@babel/preset-react), which you can install and setup fairly simply:

```sh
yarn add @babel/preset-react @babel/preset-env
```

and configure babel to correctly transform JSX with a `.babelrc` something like:

```json
{
  "presets": [
    "@babel/preset-env",
    [
      "@babel/preset-react",
      {
        "pragma": "jsxElem.createElement",
        "pragmaFrag": "jsxElem.Fragment"
      }
    ]
  ]
}

```

### Usage in esbuild

Details on how to inject jsxElem as builder can be found [in the esbuild documentation](https://esbuild.github.io/content-types/#using-jsx-without-react). Feel free to open a PR to add specific instructions here.

## Usage

### Basic

The `jsx-no-react` package just defines a function to replace the `React.createElement`, so as well as importing the relevant function into scope where you want to use JSX:

```javascript
import jsxElem, { render } from "jsx-no-react";

function App(props) {
  return <div>Hello {props.name}</div>;
}

render(<App name="world" />, document.body);
```

or

```javascript
import jsxElem, { render } from "jsx-no-react";

function App(name) {
  return <div>Hello {name}</div>;
}

render(App("world"), document.body);
```

### Components

#### Define

It's possible to define a component in different ways:

```javascript
function Hello(props) {
  return <h1>Hello {props.name}</h1>;
}

// anonymous Function
const Hello = function(props) {
  return <h1>Hello {props.name}</h1>;
};

// arrow function
const Hello = props => <h1>Hello {props.name}</h1>;

// simple element
const hello = <h1>Hello</h1>;
```

Always start component names with a capital letter.
`babel-plugin-transform-react-jsx` treats components starting with lowercase letters as DOM tags. For example `<div />` is an HTML tag, but `<Hello />` is a component and requires a user definition.

Please read [JSX In Depth](https://reactjs.org/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized)
for more details and try [babel example](https://babeljs.io/repl/#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=GYVwdgxgLglg9mABBOBbADggpmKAKASkQG8AoRASACcsoQqlEAeACSwBt25EB6APgDcpAL6lSoSLASIOWVDnxEylGnQaJmACw5degkUA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env&prettier=false&targets=&version=7.5.5&externalPlugins=babel-plugin-transform-react-jsx%406.24.1)

#### Rendering

When rendering a component JSX attributes will be passed as single object.

For example:

```javascript
import jsxElem, { render } from "jsx-no-react";

function Hello(props) {
  return <h1>Hello {props.name}</h1>;
}

render(<Hello name="world" />, document.body);
```

There are several ways to render an element:
- `renderBefore`: this function renders the JSX element before the target - top level JSX element must not be a fragment.
- `renderPrepend`: this function renders the JSX element within the target element, prepending existing content in the target element.
- `render`: replaces the contents of the target element with the JSX element.
- `renderAppend`: this function renders the JSX element within the target element, appending existing content in the target element.
- `renderAfter`: this function renders the JSX element after after the target element - top level JSX element must not be a fragment.

```javascript
import jsxElem, { render, renderAfterEnd, renderBeforeEnd, renderAndReplace } from "jsx-no-react";

function Hello(props) {
  return <h1>Hello {props.name}</h1>;
}

renderBefore(<Hello name="world" />, document.body);
renderPrepend(<Hello name="world" />, document.body);
render(<Hello name="world" />, document.body);
renderAppend(<Hello name="world" />, document.body);
renderAfter(<Hello name="world" />, document.body);
```

#### Composing Components

Components can be reused and combined together.

```javascript
import jsxElem, { render } from "jsx-no-react";

function Hello(props) {
  return <h1>Hello {props.name}</h1>;
}

const CustomSeparator = props => (
  <i>{[...Array(props.dots)].map(idx => ".")}</i>
);

function App() {
  return (
    <div>
      <Hello name="foo" />
      <CustomSeparator dots={50} />
      <Hello name="bar" />
    </div>
  );
}

render(<App />, document.body);
```

##### Fragments

Fragments are supported as child elements everywhere, but are also supported as top-level JSX elements when using `renderPrepend`, `render`, and `renderAppend`.

```javascript
function Hello() {
  return <>
    <h1>Hello</h1>
    <h1>world</h1>
  </>;
}

function App() {
  return <Hello />;
}

render(<App />, document.body);
```

#### Event

It's possible add events listeners to components as functions using camelCase notation (e.g. onClick)

For example:

```javascript
function Hello(props) {
  return <h1>Hello {props.name}</h1>;
}

function App() {
  const clickHandler = function(e) {
    alert("click function");
  };

  return (
    <div>
      <Hello onClick={() => alert("inline click function")} name="foo" />
      <Hello onClick={clickHandler} name="bar" />
    </div>
  );
}
```

#### Embedding expressions in JSX

##### map()

```javascript
function Hello(props) {
  const names = props.names;

  return (
    <div>
      {names.map(name => (
        <h1>Hello {name}</h1>
      ))}
    </div>
  );
}

function App() {
  return (
    <div>
      <Hello names={["foo", "bar"]} />
    </div>
  );
}
```

##### Inline If with Logical && Operator

```javascript
function Hello(props) {
  return <h1>Hello {props.name}</h1>;
}

function App() {
  return (
    <div>
      {document.location.hostname === "localhost" && (
        <h1>Welcome to localhost</h1>
      )}
      <Hello name="foo" />
      <Hello name="bar" />
    </div>
  );
}
```

#### Calling a Function

```javascript
function Hello(props) {
  return <h1>Hello {props.name}</h1>;
}

const CustomSeparator = props => (
  <i>{[...Array(props.dots)].map(idx => ".")}</i>
);

function App() {
  return (
    <div>
      <Hello name="foo" />
      <CustomSeparator dots={50} />
      <Hello name="bar" />
      {CustomSeparator({ dots: 10 })}
    </div>
  );
}
```

#### Style-Attribute

Object can be passed to the `style` attribute with keys in camelCase.

```javascript
import jsxElem, { render } from "jsx-no-react";

function Hello(props) {
  return <h1>Hello {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Hello style={{ backgroundColor: "red" }} name="foo" />
      <Hello style={{ backgroundColor: "blue", color: "white" }} name="bar" />
    </div>
  );
}

render(<App />, document.body);
```

## Acknowledgement

This package was originally developed by [Terry Kerr](https://github.com/dtkerr).
