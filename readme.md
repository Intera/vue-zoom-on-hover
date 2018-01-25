# vue-zoom-on-hover
responsive image with zoomed image on hover.

![example image](demo/image.jpg?raw=true)

[demo](http://htmlpreview.github.io/?https://github.com/Intera/vue-zoom-on-hover/blob/master/demo/main.html)

this component displays an image with the width of the parent element and on hover shows the full image or a scaled image in the image area.

# files
`zoom-on-hover.vue` is the single-file component. a non-single-file version can be extracted from `demo/main.html`

# usage
minimal example (with the div as example parent container)
```html
<div style="width:400px">
  <zoom-on-hover img-normal="image.jpg"></zoom-on-hover>
</div>
```

all options
```html
<zoom-on-hover img-normal="image.jpg" img-zoom="bigger-image.jpg" :scale="1.5" :disabled="true"></zoom-on-hover>
```

# features
* enabled/disabled property
* custom scale for zoomed image
* optionally a separate zoom image

# caveats
if the parent container is bigger than the source image, the normal image stretches to the size of the parent container but the zoom image will have the normal image scaled width (will be smaller for example)
