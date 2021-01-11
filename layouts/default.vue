<template>
  <div>
    <default-header />
    
  </div>
</template>

<script>
// ヘッダ＆フッタをインポート
import DefaultHeader from '~/components/SampleHeader.vue'

export default {
  name: 'default',	// テンプレート名
  components: {
    DefaultHeader,		// <default-header>に対応
  }
}
</script>