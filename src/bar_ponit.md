---
theme: dashboard
title: bar point
toc: false
---
# plot the bar with individual points
First, loading the data

```js
const csvfile = view(Inputs.file({label: "Select the CSV file", accept: ".csv", required: true}))
```
```js
const replay = view(Inputs.button("Replay"));
```
```js
// const data = FileAttachment('data.csv').csv({typed: true})
const data = csvfile.csv()
replay; // run this block when the button is clicked
const progress = (function* () {
  data = csvfile.csv()
})();
```
The data is accepted with

```js
display(data)
```


```js
import {Bar_points} from "./components/bar_points.js";
import {serialize} from "./components/savesvg.js";
```

<!-- ```js
FileAttachment("data.csv").csv({typed: true})
``` -->
Then the bar points was as blow
```js
const chart = Bar_points(data);
```
```js
const div = html`
<div class="grid grid-cols-1" style="height 220px">
<div class="card" 
  style="display: flex; 
    justify-content: center; 
    align-items: center; 
    width: 25%; 
    height: 210px; 
    border: 1px solid gray;">
${chart}
</div>`
display(div)
```
<!-- ```js
const nameInput = display(document.createElement("input"));
const name = Generators.input(nameInput);
``` -->


```js
const exportButton = html`<button>Export SVG</button>`
display(exportButton)
exportButton.onclick = () => {
  const svgElement = chart;
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);

  const blob = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "image.svg";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
```
