# vue-zoom-on-hover
responsive image with zoomed image on hover.

![example image](demo/example.png?raw=true)

[demo](http://htmlpreview.github.io/?https://github.com/Intera/vue-zoom-on-hover/blob/master/demo/main.html) (ctrl+click to open in new tab)

this [vue.js](https://vuejs.org/) component displays an image with the width of the parent element and on hover shows the full image or a scaled image in the image area

# files
`zoomOnHover.js` registers the vue component and defines zoomOnHover, a variable for the component configuration object. `zoomOnHover.css` contains the needed styles

# usage
minimal example (with an example div as parent container)
```html
<div style="width:400px">
  <zoom-on-hover img-normal="image.jpg"></zoom-on-hover>
</div>
```

all options
```html
<zoom-on-hover img-normal="image.jpg" img-zoom="bigger-image.jpg" :scale="1.5" :disabled="true"
  @loaded="onload" @resized="onresize"></zoom-on-hover>
```

# features
* enabled/disabled property
* custom scale for zoomed image
* optionally a separate zoom image
* event when all images loaded
* event when images resized (responsive css, etc)

# caveats
if the parent container is bigger than the source image, the normal image stretches to the size of the parent container but the zoom image will have the original width (will be smaller for example)
