<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { FieldSettingMode1 } from '@views/_components/_config.js'; 
export default {
  name: 'App',
  provide () {
      return {
          // point 下属 bit 字段配置默认模式一
          FieldSettingMode1
      }
  }
}
</script>

