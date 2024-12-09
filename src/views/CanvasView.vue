<template>
  <div
    style="
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    "
  >
    <canvas ref="canvasRef" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import NightImage from '@/assets/night.svg'
const timeList = [
  [23, 7, 'ngủ'],
  [7, 8, 'Prepare -> Move'],
  [8, 12, 'Ca sáng'],
  [12, 13, 'Ca sáng'],
  [13, 17, 'Ca sáng'],
  [17, 208 / 12, 'Ca sáng'],
  [208 / 12, 18, 'Ca sáng'],
]
let animationFrameId: number
const img = new Image()
img.crossOrigin = 'anonymous'
img.src = NightImage
const canvasRef = useTemplateRef('canvasRef')

function update() {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Xóa canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Vẽ các đối tượng (bao gồm ảnh)
  drawContent(ctx)

  // Yêu cầu vẽ lại
  animationFrameId = requestAnimationFrame(update)
}
const drawContent = (ctx: CanvasRenderingContext2D) => {
  const canvas = canvasRef.value
  if (!canvas) return
  const now = new Date()
  // const hour = now.getHours()
  // const minute = now.getMinutes()
  const second = now.getSeconds()

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const pixelRatio = window.devicePixelRatio || 1
  // Kích thước hiển thị
  const c = 600
  const displayWidth = c
  const displayHeight = c

  // Cập nhật kích thước nội bộ theo tỷ lệ pixel
  canvas.width = displayWidth * pixelRatio
  canvas.height = displayHeight * pixelRatio
  canvas.style.width = `${displayWidth}px`
  canvas.style.height = `${displayHeight}px`

  // Phóng to nội dung theo tỷ lệ pixel
  ctx.scale(pixelRatio, pixelRatio)

  const centerX = displayWidth / 2
  const centerY = displayHeight / 2
  const radius = 200
  const numPoints = 288
  const offset = 30
  ctx.lineCap = 'round'

  const flatUniqueTimeList = Array.from(new Set(timeList.flat()))

  // vẽ số vs vạch ngăn cách
  for (let i = 0; i < numPoints; i++) {
    if (!flatUniqueTimeList.includes((i + 1) / 12)) {
      continue
    }

    const angle =
      (i * 2 * Math.PI) / numPoints -
      (Math.PI * (numPoints / 2 - 2)) / numPoints
    const x1 = centerX + (radius - offset) * Math.cos(angle)
    const y1 = centerY + (radius - offset) * Math.sin(angle)
    const x2 = centerX + (radius - offset / 2) * Math.cos(angle)
    const y2 = centerY + (radius - offset / 2) * Math.sin(angle)
    const x3 = centerX + (radius + offset / 2 + 10) * Math.cos(angle)
    const y3 = centerY + (radius + offset / 2 + 10) * Math.sin(angle)
    let x4 = centerX + (radius + offset / 2 + 20) * Math.cos(angle)
    let y4 = centerY + (radius + offset / 2 + 20) * Math.sin(angle)

    if (i >= numPoints / 4 - 1 && i <= (numPoints / 4) * 3 - 1) {
      y4 += 7
    }

    if (i >= numPoints / 2 - 1 && i <= (numPoints / 24) * 13 - 1) {
      x4 += 8
    }

    if (i >= numPoints / 2 - 1) {
      ctx.textAlign = 'end'
    } else {
      ctx.textAlign = 'start'
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
    const time = (i + 1) / 12
    const text = Number.isInteger(time) ? `${time}` : convertToHourMinute(time)

    ctx.fillText(text, x4, y4)
  }
  // Vẽ hình tròn
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
  ctx.fillStyle = 'transparent'
  ctx.fill()
  ctx.lineWidth = 2
  ctx.strokeStyle = '#000'
  ctx.stroke()

  // Vẽ viền ngoài
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI)
  ctx.lineWidth = 1
  ctx.strokeStyle = '#000'
  ctx.stroke()

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

  // vẽ vòng tròn tâm
  ctx.beginPath()
  ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI) // Bán kính lớn hơn để tạo viền ngoài
  ctx.lineWidth = 1.5 // Độ dày viền ngoài
  ctx.strokeStyle = 'rgba(0,0,0,.5)' // Màu viền ngoài
  ctx.stroke()

  drawRotatedTextBetweenDirections(
    ctx,
    'Prepare -> Move',
    centerX,
    centerY,
    radius,
    7,
    8,
  )
  ctx.drawImage(
    img,
    centerX + 30,
    centerY - 100,
    img.naturalWidth * 0.4,
    img.naturalHeight * 0.4,
  )

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
}
const drawRotatedTextBetweenDirections = (
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  radius: number,
  direction1: number,
  direction2: number,
) => {
  // Chuyển hướng thành góc tính bằng radian
  const angle1 = ((direction1 % 24) / 12) * Math.PI
  const angle2 = ((direction2 % 24) / 12) * Math.PI

  // Tính góc trung bình giữa hai hướng
  const avgAngle = (angle1 + angle2) / 2 - Math.PI / 2

  // Tính tọa độ chữ dựa vào góc trung bình
  const textX = centerX + radius * Math.cos(avgAngle) - 10
  const textY = centerY + radius * Math.sin(avgAngle)

  // Lưu trạng thái gốc của canvas
  ctx.save()

  // Dịch chuyển và xoay canvas tới vị trí và góc mong muốn
  ctx.translate(textX, textY)
  ctx.rotate(avgAngle)

  // Vẽ chữ tại gốc tọa độ mới
  ctx.font = '12px Kalam'
  ctx.textAlign = 'end'
  ctx.fillText(text, 0, 0)

  // Khôi phục trạng thái canvas
  ctx.restore()
}
function convertToHourMinute(decimalTime: number): string {
  const hours = Math.floor(decimalTime)
  const minutes = Math.round((decimalTime - hours) * 60)

  return `${hours}h${minutes < 10 ? '0' + minutes : minutes}`
}

onMounted(() => {
  update()
})
onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
})
</script>

<style lang="scss" scoped></style>
