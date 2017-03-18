## aframe-&lt;a-entity shape=&quot;&quot;&gt;-component

[![Version](http://img.shields.io/npm/v/aframe-&lt;a-entity shape=&quot;&quot;&gt;-component.svg?style=flat-square)](https://npmjs.org/package/aframe-&lt;a-entity shape=&quot;&quot;&gt;-component)
[![License](http://img.shields.io/npm/l/aframe-&lt;a-entity shape=&quot;&quot;&gt;-component.svg?style=flat-square)](https://npmjs.org/package/aframe-&lt;a-entity shape=&quot;&quot;&gt;-component)

extrudes shapes from svg paths

For [A-Frame](https://aframe.io).

### API

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
|          |             |               |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.4.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-&lt;a-entity shape=&quot;&quot;&gt;-component/dist/aframe-&lt;a-entity shape=&quot;&quot;&gt;-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity &lt;a-entity shape=&quot;&quot;&gt;="foo: bar"></a-entity>
  </a-scene>
</body>
```

<!-- If component is accepted to the Registry, uncomment this. -->
<!--
Or with [angle](https://npmjs.com/package/angle/), you can install the proper
version of the component straight into your HTML file, respective to your
version of A-Frame:

```sh
angle install aframe-&lt;a-entity shape=&quot;&quot;&gt;-component
```
-->

#### npm

Install via npm:

```bash
npm install aframe-&lt;a-entity shape=&quot;&quot;&gt;-component
```

Then require and use.

```js
require('aframe');
require('aframe-&lt;a-entity shape=&quot;&quot;&gt;-component');
```
