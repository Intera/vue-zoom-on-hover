<template>
<div class="zoom-on-hover" @mousemove="move" @mouseenter="zoom" @mouseleave="unzoom">
	<img class="normal" ref="normal" :src="imgNormal"/>
	<img class="zoom" ref="zoom" :src="imgZoom || imgNormal"/>
</div>
</template>

<style lang="less">
.zoom-on-hover {
  position: relative;
  overflow: hidden;
	.normal {
		width: 100%;
	}
	.zoom {
		position: absolute;
		opacity: 0;
    transform-origin: top left;
	}
}
</style>

<script>
/* this component displays an image with the width of the parent element and on hover
shows the full image or a scaled image in the image area.
features: activate/deactivate method, active/inactive on load, scale parameter, separate zoom image */

function pageOffset(el) {
	// -> {x: number, y: number}
	// get the left and top offset of a dom block element
  var rect = el.getBoundingClientRect(),
			scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
			scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { y: rect.top + scrollTop, x: rect.left + scrollLeft }
}

export default {
  props:
	['imgNormal', 'imgZoom', 'scale', 'disabled'],
	data() {
		return {
			scaleFactor: 1
		}
	},
  methods: {
		zoom() {
			if(this.disabled) return
			this.$refs.zoom.style.opacity = 1
			this.$refs.normal.style.opacity = 0
		},
		unzoom() {
			if(this.disabled) return
			this.$refs.zoom.style.opacity = 0
			this.$refs.normal.style.opacity = 1
		},
    move(event) {
			if(this.disabled) return
			var offset = pageOffset(this.$el)
			var zoom = this.$refs.zoom
			var normal = this.$refs.normal
			var relativeX = event.clientX - offset.x + window.scrollX
			var relativeY = event.clientY - offset.y + window.scrollY
			var normalPercentX = relativeX / normal.offsetWidth
			var normalPercentY = relativeY / normal.offsetHeight
			var x = normalPercentX * (zoom.offsetWidth * this.scaleFactor - normal.offsetWidth)
			var y = normalPercentY * (zoom.offsetHeight * this.scaleFactor - normal.offsetHeight)
      zoom.style.left = -x + "px"
      zoom.style.top = -y + "px"
    }
  },
	mounted() {
		if(this.$props.scale) {
			this.scaleFactor = parseInt(this.$props.scale)
			this.$refs.zoom.style.transform = "scale(" + this.scaleFactor + ")"
		}
	}
}
</script>
