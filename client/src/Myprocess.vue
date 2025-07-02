<template>
  <div class="process">
    <div class="bar">
      <div class="bg"></div>
      <div class="value" :style="{width:process.percent+'%'}"></div>
    </div>
    <span style="margin-top: -2px;">{{ process.percent }}%</span>
  </div>
</template>

<script lang="ts" setup>
let  process = defineProps(["percent"])
</script>

<style scoped>
.process{
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}

.bar{
  width: 80%;
  height: 15px;
  position: relative;
}

.bg{
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: gainsboro;
  border-radius: 10px;
}

.value{
  width: 0%;
  height: 100%;
  position: absolute;
  background-color: rgb(0, 247, 128);
  border-radius: 10px;
  /* transition: 0.5s; */
}
</style>