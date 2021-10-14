# 2.0.0

 Breaking changes introduced with rendering modes - `renderAndReplace` is now called `render` to follow common practice with SPA frameworks rendering mechanisms. Additionally, the render locations below are more explicit on where they will place the JSX output. Finally, prepend and append now support top-level JSX fragments (before and after render locations require a top-level container element still).

New methods:
```js
renderBefore(<Hello name="world" />, targetElement);
renderPrepend(<Hello name="world" />, targetElement);
render(<Hello name="world" />, targetElement);
renderAppend(<Hello name="world" />, targetElement);
renderAfter(<Hello name="world" />, targetElement);
```

# 1.1.1

Sadly the previous release had old code in it, this release fixes it.

# 1.1.0

*  Add beforeEnd and afterEnd render options thanks to [theodugautier](https://github.com/theodugautier)

# 1.0.0

* Added Fragment support thanks to [f107](https://github.com/f107)

This release needs extra care in the babel configuration to make Fragments work.
You need to replace `babel-plugin-transform-react-jsx` with `@babel/preset-react`.
Please check the [README](https://github.com/bitboxer/jsx-no-react/blob/main/README.md)
for details.

# 0.5.0

* Added Object.entries Polyfill
* Changed distribution to include iife and es6 versions

# 0.4.0

* Added support for the `svg` tag
