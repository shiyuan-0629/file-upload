<template>
  <div class="box">
    <div class="container" @dragenter.self.prevent @dragover.self.prevent @drop.self.prevent="drop($event)">
      <span>
        <MostlyCloudy style="width: 60px;transform: translateY(40%);" /> 将目录或多个文件拖到此处进行扫描
      </span>
      <span>支持的文件类型：jpg、jpeg、bmp、gif、png</span>
      <span>每个文件允许的最大尺寸：1M</span>
    </div>
    <div class="input">
      <!-- 选择多个文件 -->
      <label class="label" for="file">选择多个文件</label>
      <input type="file" multiple id="file" @change="upload($event)">
      <!-- 选择文件夹 -->
      <label class="label" for="directory">选择文件夹</label>
      <input type="file" webkitdirectory mozdirectory odirectory id="directory" @change="upload($event)">
    </div>
    <div>
      <table>
        <thead>
          <tr>
            <th>文件名</th>
            <th>类型</th>
            <th>大小</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(file, index) in vfiles" :key="file.id">
            <td>{{ file.name }}</td>
            <td>{{ file.type }}</td>
            <td>{{ (file.size / 1024 ).toFixed(2) }}MB</td>
            <td>
              <Myprocess v-show="file.process" :percent="file.process"></Myprocess>
              <span v-show="!file.process">{{ file.status }}</span>
            </td>
            <td>
              <Delete style="width: 20px;cursor: pointer;" @click="DeleteFilled(index)" />
            </td>
          </tr>
        </tbody>
      </table>
      <div class="data" v-if="!size">
        <DocumentAdd style="width: 80px;display: block;" />
        <span>No DATA</span>
      </div>
      <div class="info">
        <span>文件数量：{{ vfiles.length }}</span>
        <span class="success">成功上传：{{ count }}</span>
        <span>总大小：{{ (size / 1024).toFixed(2) }}MB</span>
      </div>
    </div>
    <div>
      <label class="start" for="start" style="margin-top: 20px;" @click="start()">开始上传</label>
      <input type="button" id="start">
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { DocumentAdd, MostlyCloudy, Delete, Tickets } from '@element-plus/icons-vue'
import Myprocess from './Myprocess.vue'
const vfiles = ref([])
const tfiles = []
let size = ref(0)
let count = ref(0)
const formatFile = (file) => {
  const f = {
    id: file.lastModified,
    name: file.name,
    type: file.type,
    size: file.size / 1024,
    process: 0,
    // status:"等待上传"
    status: (file.size < 1024 * 1024) && (file.type.startsWith("image")) ? "等待上传" : "文件异常"
  }
  vfiles.value.push(f);
  size.value = size.value + f.size;
  if (f.status === "等待上传") {
    tfiles.push(file);
  }
}

const fun = (entries) => {
  for (const entry of entries) {
    if (entry.isFile) {
      entry.file((file) => {
        formatFile(file)
      })
    } else {
      const reader = entry.createReader();
      reader.readEntries((entries) => {
        fun(entries);
      })
    }
  }
  return;
}

function drop($event) {
  const items = $event.dataTransfer.items;
  for (const item of items) {
    const entry = item.webkitGetAsEntry();
    if (entry.isDirectory) {
      const reader = entry.createReader();
      reader.readEntries((entries) => {
        fun(entries);
      })
    } else {
      entry.file((file) => {
        formatFile(file)
      })
    }
  }
}

function upload($event) {
  for (const file of $event.target.files) {
    formatFile(file)
  }
}

function DeleteFilled(index) {
  const f = tfiles.find((item) => item.lastModified === vfiles.value[index].id)
  if (f !== undefined) {
    const i = tfiles.indexOf(f)
    tfiles.splice(i, 1)
  }
  vfiles.value.splice(index, 1)
}

import ExecuteQueue from '@/utils/utils.ExecuteQueue';
import axios from 'axios';
const options = {
  perConsumeCount: 2,
  execute: (file, onSucess, onError) => {
    const formData = new FormData();
    formData.append('file', file);
    axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        let percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        const f = vfiles.value.find((item) => item.id === file.lastModified)
        const index = vfiles.value.indexOf(f)
        vfiles.value[index].process = percent
      }
    })
      .then(response => {
        count.value++
        onSucess()
      })
      .catch(error => {
        const f = vfiles.value.find((item) => item.id === file.lastModified)
        const index = vfiles.value.indexOf(f)
        vfiles.value[index].process = 0
        vfiles.value[index].status = "上传失败"
        onError()
      }).finally(() => {
        const index = tfiles.indexOf(file)
        tfiles.splice(index, 1)
      });
  },
  isAutoStart: true
}

const start = () => {
  const executeQueue = new ExecuteQueue(options)
  executeQueue.pushTasks(tfiles)
}




</script>

<style scoped>
.box {
  width: 100vw;
  padding: 30px;
  box-sizing: border-box;
}

.container {
  width: 100%;
  height: 300px;
  border: 1px grey dotted;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  color: #cccccc;
  font-size: 20px;
}


.input {
  width: 100%;
  height: 100px;
  padding: 20px 0px;
  box-sizing: border-box;
}

input {
  display: none;
}

.label {
  display: inline-block;
  width: 150px;
  height: 60px;
  margin-right: 20px;
  background-color: #2456ef;
  border-radius: 10px;
  text-align: center;
  line-height: 60px;
  color: aliceblue;
}

.start {
  display: inline-block;
  width: 120px;
  height: 40px;
  border: 1px greenyellow solid;
  border-radius: 3px;
  text-align: center;
  line-height: 40px;
  color: rgb(109, 156, 39);
}

table {
  width: 100%;
  border: 1px #dbdbdb solid;
}


tr {
  width: 100%;
}

th {
  background-color: #fafafa;
}

td,
th {
  width: 20%;
  height: 60px;
  text-align: center;
  line-height: 60px;
}

.data {
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #cccccc;
}

.info {
  margin-top: 20px;
}

.info span {
  display: inline-block;
  width: 120px;
  height: 20px;
  border: 1px gainsboro solid;
  text-align: center;
  font-size: 14px;
  line-height: 20px;
  margin-right: 20px;
  border-radius: 3px;
}

.success {
  color: rgb(113, 167, 33);
}

.container span {
  display: block;
}
</style>