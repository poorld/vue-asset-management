// 资产状态
var PropertyStateEnum = {
  NO_USE: 1, //未使用
  IN_USE: 2, //使用中
  properties: {
    1: {name: "未使用", value: 1},
    2: {name: "使用中", value: 2},
  }
}

// 存放地点类型
var LocaleTypeEnum = {
  FIXED_ASSETS: 1, //固定资产
  CONSUMABLE_ITEMS: 2,//耗材物品
  properties: {
    1: {name: "固定资产", value: 1},
    2: {name: "耗材物品", value: 2},
  }
}

// 存放地点转态
var LocaleStateEnum = {
  NORMAL: 1,//正常
  SCRAP: 2,//报废
  properties: {
    1: {name: "正常", value: 1},
    2: {name: "报废", value: 2},
  }
}

// 供应商类型
var SupplierTypeEnum = {
  PRODUCERS: 1,//生产商
  AGENT: 2,//代理商
  PART: 3,//零件
  properties: {
    1: {name: "生产商", value: 1},
    2: {name: "代理商", value: 2},
    3: {name: "零件", value: 3}
  }
}

// 供应商状态
var SupplierStateEnum = {
  NORMAL: 1,//正常
  SCRAP: 2,//报废
  properties: {
    1: {name: "正常", value: 1},
    2: {name: "报废", value: 2},
  }
}

// 部门状态
var DepartmentStateEnum = {
  NORMAL: 1,//正常
  DISABLE: 2,//已禁用
  properties: {
    1: {name: "正常", value: 1},
    2: {name: "已禁用", value: 2},
  }
}

//资产类别
var PropertyClassStateEnum = {
  NORMAL: 1,//正常
  SCRAP: 2,//报废
  properties: {
    1: {name: "正常", value: 1},
    2: {name: "报废", value: 2},
  }
}

//品牌
var BrandStateEnum = {
  ENABLE: 1,// 已启用
  DISABLE: 2,//已禁用
  properties: {
    1: {name: "已启用", value: 1},
    2: {name: "已禁用", value: 2},
  }
}

export default {
  PropertyStateEnum,
  LocaleTypeEnum,
  LocaleStateEnum,
  SupplierTypeEnum,
  SupplierStateEnum,
  DepartmentStateEnum,
  PropertyClassStateEnum,
  BrandStateEnum,

}
