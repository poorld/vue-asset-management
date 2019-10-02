import assetEnum from '../model/assetEnum.js'

/*
### 资产管理:
状态:
-1 未使用 ->2/3/4
-2 已借用 ->3
-3 已归还 ->2
-4 已报废 ->1
报废方式: scrapWay
-1 损坏
-2 丢失
-3 转卖
-4 赠送

###资产类别
-1 正常
-2 报废

### 存放地点:
状态:
-1 正常
-2 报废
类型:
-1 固定资产
-2 耗材物品

### 供应商
类型:
-1 生产商
-2 代理商
-3 零件
状态:
-1 正常
-2 报废

### 品牌
-1 已启用
-2 已禁用
 */

let {
    PropertyStateEnum,
    LocaleTypeEnum,
    LocaleStateEnum,
    SupplierTypeEnum,
    SupplierStateEnum,
    DepartmentStateEnum,
    PropertyClassStateEnum,
    BrandStateEnum

  } = assetEnum

var format = {
    // 转换资产状态
    formatPropertyState(obj){
        // let state =  obj.propertyState == 1 ? '未使用' : obj.propertyState == 2 ? '使用中' : ''
        let state = obj.propertyState

        return PropertyStateEnum.properties[state].value
    },

    // 转换存放地点类型
    formatLocaleType(obj){
        // let type = obj.localeType == 1 ? '固定资产' : obj.localeType == 2 ? '耗材物品' : ''
        let type = obj.localeType

        return LocaleTypeEnum.properties[type].name
    },
    // 转换存放地点转态
    formatLocaleState(obj){
        // let state = obj.localeState == 1 ? '正常' : obj.localeState == 2 ? '报废' : ''
        let state = obj.localeState

        return LocaleStateEnum.properties[state].name
    },
    // 供应商类型
    formatSupplierType(obj){
        // let type = obj.supplierType == 1 ? '生产商': obj.supplierType == 2 ? '代理商' : obj.supplierType == 3 ? '零件' : ''
        let type = obj.supplierType

        return SupplierTypeEnum.properties[type].name
    },
    // 供应商状态
    formatSupplierState(obj){
        // let state = obj.supplierState == 1 ? '正常' : obj.supplierState == 2 ? '报废': ''
        let state = obj.supplierState

        return SupplierStateEnum.properties[state].name
    },
    // 部门状态
    formatDepartmentState(obj){
        // let state = obj.departmentState == 1 ? '正常' : obj.departmentState == 2 ? '已禁用': ''
        let state = obj.departmentState

        return DepartmentStateEnum.properties[state].name
    },
    //资产类别
    formatPropertyClassState(obj){
        // let state = obj.propertyClassState == 1 ? '正常' : obj.propertyClassState == 2 ? '报废' : ''
        let state = obj.propertyClassState
        return PropertyClassStateEnum.properties[state].name
    },
    //品牌
    formatBrandState(obj){
        // let state = obj.brandState == 1 ? '已启用' : obj.brandState == 2 ? '已禁用' : ''
        let state = obj.brandState

        return BrandStateEnum.properties[state].name
    },
    //品牌状态
    brandStateChange(state){
        return state == 1 ? 2 : 1
    },

    getTimestampStr(){
        let myDate = new Date()
        return myDate.getTime()
    }

}

export default format
