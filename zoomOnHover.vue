<template>
  <div
    :class="['zoom-on-hover', { zoomed }]"
    @touchstart="touchzoom"
    @mousemove="move"
    @mouseenter="zoom"
    @mouseleave="unzoom"
  >
    <img class="normal" ref="normal" :src="src" @load="load" />
    <img
      class="zoom"
      ref="zoom"
      :src="imgZoom || src"
      @load="loadZoom"
      :style="{ left: zoomLeft, top: zoomTop }"
    />
  </div>
</template>

<script>
// this component displays an image with the width of the parent element and on hover shows
// the full image or a scaled image in the image area.
// features: activate/deactivate method, active/inactive on load, scale parameter, separate zoom image,
// event when all images loaded, event when images resized (responsive css, etc)
// https://github.com/Intera/vue-zoom-on-hover

export default {
  props: {
    src: {
      type: String,
      required: true,
    },

    imgZoom: {
      type: String,
    },

    scale: {
      type: Number,
      default: 3,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      resizeCheckInterval: null,
      zoomed: false,
      loaded: false,
      loadedZoom: false,
      zoomLeft: "0px",
      zoomTop: "0px",
    };
  },

  mounted() {
    this.initEventResized();
    this.handleScaleChange();
  },

  beforeDestroy() {
    this.resizeCheckInterval && clearInterval(this.resizeCheckInterval);
  },

  computed: {
    pageOffset() {
      // -> {x: number, y: number}
      // get the left and top offset of a dom block element
      const rect = this.$el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      return {
        y: rect.top + scrollTop,
        x: rect.left + scrollLeft,
      };
    },

    imagesLoaded() {
      return this.loaded && this.loadedZoom;
    },
  },

  watch: {
    src() {
      this.loaded = false;
      this.loadedZoom = false;
      this.zoomed = false;
    },

    scale: {
      immediate: true,
      handler() {
        this.handleScaleChange();
      },
    },
  },

  methods: {
    handleScaleChange() {
      if (this.$refs?.zoom) {
        this.$refs.zoom.style.transform = "scale(" + this.scale + ")";
      }
    },

    touchzoom(event) {
      if (!this.imagesLoaded || this.disabled) {
        return;
      }

      this.move(event);
      this.zoomed = !this.zoomed;
    },

    zoom() {
      if (this.imagesLoaded && !this.disabled) {
        this.zoomed = true;
      }
    },

    unzoom() {
      if (this.imagesLoaded && !this.disabled) {
        this.zoomed = false;
      }
    },

    move(event) {
      const zoom = this.$refs.zoom;
      const normal = this.$refs.normal;

      if (this.disabled || !this.zoomed || !zoom || !normal) {
        return;
      }

      const offset = this.pageOffset;
      const relativeX = event.clientX - offset.x + window.pageXOffset;
      const relativeY = event.clientY - offset.y + window.pageYOffset;
      const normalFactorX = relativeX / normal.offsetWidth;
      const normalFactorY = relativeY / normal.offsetHeight;
      const x =
        normalFactorX * (zoom.offsetWidth * this.scale - normal.offsetWidth);
      const y =
        normalFactorY * (zoom.offsetHeight * this.scale - normal.offsetHeight);
      this.zoomLeft = -x + "px";
      this.zoomTop = -y + "px";
    },

    load(e) {
      this.loaded = true;
      this.checkLoaded(e);
    },

    loadZoom(e) {
      this.loadedZoom = true;
      this.checkLoaded(e);
    },

    checkLoaded(e) {
      if (this.imagesLoaded) {
        this.$emit("load", e);
      }
    },

    initEventResized() {
      const normal = this.$refs.normal;
      let previousWidth = normal.offsetWidth;
      let previousHeight = normal.offsetHeight;

      this.resizeCheckInterval = setInterval(() => {
        if (
          previousWidth != normal.offsetWidth ||
          previousHeight != normal.offsetHeight
        ) {
          previousWidth = normal.offsetWidth;
          previousHeight = normal.offsetHeight;
          this.$emit("resized", {
            width: normal.width,
            height: normal.height,
            fullWidth: normal.naturalWidth,
            fullHeight: normal.naturalHeight,
          });
        }
      }, 1000);
    },
  },
};
</script>

<style scoped>
.zoom-on-hover {
  position: relative;
  overflow: hidden;
}

.zoom-on-hover .normal {
  width: 100%;
}

.zoom-on-hover .zoom {
  position: absolute;
  opacity: 0;
  transform-origin: top left;
}

.zoom-on-hover.zoomed .zoom {
  opacity: 1;
}

.zoom-on-hover.zoomed .normal {
  opacity: 0;
}
</style>
