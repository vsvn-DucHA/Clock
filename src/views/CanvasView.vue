<template>
  <div>
    <canvas ref="canvasRef" height="600" width="600" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'

const canvasRef = useTemplateRef('canvasRef')
const update = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const now = new Date()
  // const hour = now.getHours()
  // const minute = now.getMinutes()
  const second = now.getSeconds()
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = 200
  const numPoints = 24
  const offset = 30
  ctx.lineCap = 'round'
  // Vẽ hình tròn
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
  ctx.fillStyle = 'transparent'
  ctx.fill()
  ctx.lineWidth = 2
  ctx.strokeStyle = '#000'
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI)
  ctx.lineWidth = 1
  ctx.strokeStyle = '#000'
  ctx.stroke()

  // vẽ số vs vạch ngăn cách
  for (let i = 0; i < numPoints; i++) {
    const angle = (i * 2 * Math.PI) / numPoints - (Math.PI * 10) / 24
    const x1 = centerX + (radius - offset) * Math.cos(angle)
    const y1 = centerY + (radius - offset) * Math.sin(angle)
    const x2 = centerX + (radius - offset / 2) * Math.cos(angle)
    const y2 = centerY + (radius - offset / 2) * Math.sin(angle)
    const x3 = centerX + (radius + offset / 2 + 10) * Math.cos(angle)
    const y3 = centerY + (radius + offset / 2 + 10) * Math.sin(angle)
    let x4 = centerX + (radius + offset / 2 + 30) * Math.cos(angle)
    let y4 = centerY + (radius + offset / 2 + 30) * Math.sin(angle)

    if (i >= 4 && i <= 18) {
      y4 += 7
    }
    if (i >= 11 && i <= 23) {
      x4 -= 10
    }

    const x0 = centerX + offset * Math.cos(angle)
    const y0 = centerY + offset * Math.sin(angle)

    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)

    ctx.strokeStyle = 'rgba(0,0,0,0.3)'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(x2, y2)
    ctx.lineTo(x3, y3)
    ctx.strokeStyle = '#000'
    if (i % 6 === 5) ctx.lineWidth = 2.5
    else ctx.lineWidth = 1
    ctx.stroke()

    ctx.fillStyle = 'black'
    ctx.font = '18px Kalam'
    const text = `${i + 1}`
    ctx.fillText(text, x4, y4)
  }

  // vẽ trái tim
  const offsetX = centerX - 229
  const offsetY = centerY - 5 - 201
  ctx.beginPath()
  ctx.moveTo(centerX, centerY - 5)
  ctx.bezierCurveTo(
    217 + offsetX,
    190 + offsetY,
    213 + offsetX,
    213 + offsetY,
    229 + offsetX,
    216 + offsetY,
  )
  ctx.bezierCurveTo(
    245 + offsetX,
    213 + offsetY,
    241 + offsetX,
    190 + offsetY,
    centerX,
    centerY - 5,
  )
  ctx.fillStyle = '#f83b6d'
  ctx.fill()
  ctx.strokeStyle = '#f83b6d'
  ctx.stroke()

  const angle = (second * 2 * Math.PI) / 60 - Math.PI / 2
  const x0 = centerX - 45 * Math.cos(angle)
  const y0 = centerY - 45 * Math.sin(angle)
  const x1 = centerX - 16 * Math.cos(angle)
  const y1 = centerY - 16 * Math.sin(angle)
  const x2 = centerX + 16 * Math.cos(angle)
  const y2 = centerY + 16 * Math.sin(angle)
  const x3 = centerX + (radius - 2 * offset) * Math.cos(angle)
  const y3 = centerY + (radius - 2 * offset) * Math.sin(angle)

  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x1, y1)
  ctx.strokeStyle = '#FFD700'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x3, y3)

  ctx.strokeStyle = '#FFD700'
  ctx.lineWidth = 2
  ctx.stroke()

  // vẽ vòng tròn tâm
  ctx.beginPath()
  ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI) // Bán kính lớn hơn để tạo viền ngoài
  ctx.lineWidth = 2 // Độ dày viền ngoài
  ctx.strokeStyle = '#000' // Màu viền ngoài
  ctx.stroke()
  // const arrowLength = 10
  // const arrowX1 = x3 - arrowLength * Math.cos(angle - Math.PI / 6)
  // const arrowY1 = y3 - arrowLength * Math.sin(angle - Math.PI / 6)
  // const arrowX2 = x3 - arrowLength * Math.cos(angle + Math.PI / 6)
  // const arrowY2 = y3 - arrowLength * Math.sin(angle + Math.PI / 6)

  // // Vẽ mũi tên
  // ctx.beginPath()
  // ctx.moveTo(x3, y3)
  // ctx.lineTo(arrowX1, arrowY1)
  // ctx.moveTo(x3, y3)
  // ctx.lineTo(arrowX2, arrowY2)
  // ctx.strokeStyle = '#ffca77'
  // ctx.lineWidth = 2
  // ctx.stroke()
}
onMounted(() => {
  setInterval(() => {
    update()
  }, 1000)
})
</script>

<style lang="scss" scoped></style>
