<template>
  <!-- element-ui级联组件 -->
  <el-cascader
    :value="value"
    :options="treeData"
    :props="props"
    separator="-"
    size="mini"
    @change="changeValue"
  />
</template>
<script>
import { getDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'
export default {
  props: {
    // 这个value是接收的父组件的v-model的:value
    value: {
      type: Number, // 存储的是父组件的userInfo.departmentId，所以值是数字
      default: null
    }
  },
  data() {
    return {
      treeData: [], // 赋值给级联组件的options
      props: {
        label: 'name', // 要展示的字段，name是treeData数组里的数据的name属性，展示的是对应的属性值
        value: 'id' // 要存储的字段，级联组件内部会根据value的值来渲染树形数据的关系，id是treeData数组里的数据的id属性
      }
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      this.treeData = transListToTreeData(await getDepartment(), 1) // 将组织架构的列表数据转化成树形，并赋值给treeData
    },
    changeValue(list) {
      // list这个形参是一个数组，数组的元素是所有选中的级联部分的value值，也就是树形数据的id值
      // 通过input来把选中的最后的那个层级的数据的id传给父组件，作为departmentId的值
      if (list.length > 0) {
        this.$emit('input', list[list.length - 1])
      } else {
        this.$emit('input', null) // 如果长度为0，说明值为空
      }
    }
  }
}
</script>
