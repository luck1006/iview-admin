
<template>
  <div>
    <i-form ref="formitem"
            :model="formItem"
            :rules="ruleValidate"
            :label-width="90"
            class="formitem"
            inline>
      <Row class="row1">
        <Col span="14"
             style="width: 75%">
        <Form-item label="订单编号："
                   prop="orderId"
                   style="width: 100%">
          <i-input v-model="formItem.orderId"
                   placeholder="请输入订单编号"
                   size="large"
                   style="width: 80%">
          </i-input>
        </Form-item>
        </Col>
        <Col span="4"
             style="width: 24%">
        <Form-item style="margin-left:5px">
          <i-button type="primary"
                    @click="run('formitem')">取消订单</i-button>
          <i-button type="primary"
                    @click="handleReset('formitem')"
                    style="margin-left: 5px">重置</i-button>
        </Form-item>
        </Col>
      </Row>
    </i-form>
  </div>
</template>

<script>
import { CancelOrder } from '@/api/data'
export default {
  data () {
    return {
      formItem: {
        orderId: ''
        // requestmethod: ""
      },

      ruleValidate: {
        orderId: [
          { required: true, message: 'Please enter the orderId ', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    run (formItem) {
      // this.$Loading.start()
      this.$refs.formitem.validate(valid => {
        if (valid) {
          console.log('formItem', this.formItem)
          CancelOrder({ orderId: this.formItem.orderId }).then(res => {
            console.log('orderId', this.formItem.orderId)
            if (res.data.success === true || res.data.success === 'true') {
              this.$Message.success('订单 ' + this.formItem.orderId + ' 取消成功')
            } else {
              this.$Message.error({
                content: '执行失败或者不支持此类型订单取消，请重试或者去订单系统取消',
                duration: 3
              })
            }
          })
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    handleReset (orderId) {
      this.$refs[orderId].resetFields()
    }
  }
}

</script>
<style>
.ivu-form-item-content {
  margin-left: 20px !important;
}
</style>
