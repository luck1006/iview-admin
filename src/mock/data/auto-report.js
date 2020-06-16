export default {
  'success': true,
  'data': {
    'type': 'suite',
    'id': 1,
    'name': 'demo',
    'child': [{
      'type': 'suite',
      'id': 2,
      'name': '零售',
      'child': [{
        'type': 'suite',
        'id': 3,
        'name': 'shop',
        'child': [{
          'type': 'test',
          'id': 4,
          'name': '获取token',
          'child': [],
          'runtime': 25772,
          'result': 'success',
          'rest': 'http://public-api.shop.mall.tuniu-sit.org/shop/produceToken',
          'inparams': '{\n"userId":{{retail_id}},\n"userType":1\n}',
          'outparams': '{"success": true, "errorCode": 710000, "msg": "OK", "data": "a55361f2d25141a6bd26724914315917"}',
          'checkout': "['校验成功,全局校验OK~~', '校验OK~~返回结果中{\"success\": true, \"errorCode\": 710000, \"msg\": \"OK\", \"data\": \"a55361f2d25141a6bd26724914315917\"}字段中包含预期返回值  \"success\": true,\\n  \"errorCode\": 710000,\\n  \"msg\": \"OK\",全部字段', '校验OK~~接口返回数据中/success校验路径字段值匹配成功为true']"
        }, {
          'type': 'test',
          'id': 5,
          'name': '获取token',
          'child': [],
          'runtime': 25772,
          'result': 'fail',
          'rest': 'http://public-api.shop.mall.tuniu-sit.org/shop/produceToken',
          'inparams': '{\n"userId":{{retail_id}},\n"userType":1\n}',
          'outparams': '{"success": true, "errorCode": 710000, "msg": "OK", "data": "a55361f2d25141a6bd26724914315917"}',
          'checkout': "['校验成功,全局校验OK~~', '校验OK~~返回结果中{\"success\": true, \"errorCode\": 710000, \"msg\": \"OK\", \"data\": \"a55361f2d25141a6bd26724914315917\"}字段中包含预期返回值  \"success\": true,\\n  \"errorCode\": 710000,\\n  \"msg\": \"OK\",全部字段', '校验OK~~接口返回数据中/success校验路径字段值匹配成功为true']"
        }],
        'runtime': null,
        'rest': '',
        'result': null,
        'inparams': '',
        'outparams': '',
        'checkout': ''
      }],
      'runtime': null,
      'result': null,
      'rest': '',
      'inparams': '',
      'outparams': '',
      'checkout': ''
    }],
    'runtime': null,
    'result': null,
    'rest': '',
    'inparams': '',
    'outparams': '',
    'checkout': ''
  }
}
