// this component displays an image with the width of the parent element and on hover shows
// the full image or a scaled image in the image area.
// features: activate/deactivate method, active/inactive on load, scale parameter, separate zoom image,
// event when all images loaded, event when images resized (responsive css, etc)

function pageOffset(el) {
  // -> {x: number, y: number}
  // get the left and top offset of a dom block element
  var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return {
    y: rect.top + scrollTop,
    x: rect.left + scrollLeft
  }
}

var zoomOnHover = {
  props: ["imgNormal", "imgZoom", "scale", "disabled"],
  template: `<div class="zoom-on-hover" v-bind:class="{zoomed}" @touchstart="touchzoom"
    @mousemove="move" @mouseenter="zoom" @mouseleave="unzoom">
    <img class="normal" ref="normal" :src="imgNormal"/>
    <img class="zoom" ref="zoom" :src="imgZoom || imgNormal"/></div>`,
  data: function() {
    return {
      scaleFactor: 1,
      resizeCheckInterval: null,
      zoomed: false
    }
  },
  methods: {
    touchzoom: function(event) {
      if (this.disabled) return
      this.move(event)
      this.zoomed = !this.zoomed
    },
    zoom: function() {
      if (!this.disabled) this.zoomed = true
    },
    unzoom: function() {
      if (!this.disabled) this.zoomed = false
    },
    move: function(event) {
      if (this.disabled || !this.zoomed) return
      var offset = pageOffset(this.$el)
      var zoom = this.$refs.zoom
      var normal = this.$refs.normal
      var relativeX = event.clientX - offset.x + window.pageXOffset
      var relativeY = event.clientY - offset.y + window.pageYOffset
      var normalFactorX = relativeX / normal.offsetWidth
      var normalFactorY = relativeY / normal.offsetHeight
      var x = normalFactorX * (zoom.offsetWidth * this.scaleFactor - normal.offsetWidth)
      var y = normalFactorY * (zoom.offsetHeight * this.scaleFactor - normal.offsetHeight)
      zoom.style.left = -x + "px"
      zoom.style.top = -y + "px"
    },
    initEventLoaded: function() {
      // emit the "loaded" event if all images have been loaded
      var promises = [this.$refs.zoom, this.$refs.normal].map(function(image) {
        return new Promise(function(resolve, reject) {
          image.addEventListener("load", resolve)
          image.addEventListener("error", reject)
        })
      })
      var component = this
      Promise.all(promises).then(function() {
        component.$emit("loaded")
      })
    },
    initEventResized: function() {
      var normal = this.$refs.normal
      var previousWidth = normal.offsetWidth
      var previousHeight = normal.offsetHeight
      var component = this
      this.resizeCheckInterval = setInterval(function() {
        if ((previousWidth != normal.offsetWidth) || (previousHeight != normal.offsetHeight)) {
          previousWidth = normal.offsetWidth
          previousHeight = normal.offsetHeight
          component.$emit("resized", {
            width: normal.width,
            height: normal.height,
            fullWidth: normal.naturalWidth,
            fullHeight: normal.naturalHeight
          })
        }
      }, 1000)
    }
  },
  mounted: function() {
    if (this.$props.scale) {
      this.scaleFactor = parseInt(this.$props.scale)
      this.$refs.zoom.style.transform = "scale(" + this.scaleFactor + ")"
    }
    this.initEventLoaded()
    this.initEventResized()
  },
  updated: function() {
    this.initEventLoaded()
  },
  beforeDestroy: function() {
    this.resizeCheckInterval && clearInterval(this.resizeCheckInterval)
  }
}
